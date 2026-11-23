import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.mjs';

const origin = 'https://humanize.top';
function request(body = {prompt: 'Rewrite: Mira delivered 17 reports.'}, options = {}) {
  return new Request('https://worker.example/generate', {
    method: 'POST', headers: {Origin: origin, 'Content-Type': 'application/json'},
    body: JSON.stringify(body), ...options
  });
}
function environment(overrides = {}) {
  return {LIMIT: {limit: async () => ({success: true})}, AI: {run: async () => ({response: 'Mira handed in 17 reports.'})}, ...overrides};
}
test('successful rewrite returns the model text with production CORS headers', async () => {
  let received;
  const env = environment({AI: {run: async (model, input) => {received = {model,input}; return {response: 'Mira handed in 17 reports.'};}}});
  const res = await worker.fetch(request(), env);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), origin);
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await res.json(), {text: 'Mira handed in 17 reports.'});
  assert.equal(received.input.messages[0].content, 'Rewrite: Mira delivered 17 reports.');
});
test('preflight permits both production origins without consuming quota', async () => {
  for (const host of [origin, 'https://www.humanize.top']) {
    const res = await worker.fetch(request(undefined, {method:'OPTIONS', body:undefined, headers:{Origin:host}}), {});
    assert.equal(res.status, 204);
    assert.equal(res.headers.get('Access-Control-Allow-Origin'), host);
  }
});
test('rejects unknown origins, paths, methods and media types', async () => {
  assert.equal((await worker.fetch(request(undefined, {headers:{Origin:'https://example.com'}}), {})).status,403);
  assert.equal((await worker.fetch(new Request('https://worker.example/other',{headers:{Origin:origin}}), {})).status,404);
  assert.equal((await worker.fetch(request(undefined,{method:'GET',body:undefined}), {})).status,405);
  assert.equal((await worker.fetch(request(undefined,{headers:{Origin:origin}}), {})).status,415);
});
test('rejects malformed, empty and oversized prompts without running AI', async () => {
  const env = environment({AI:{run:async () => {assert.fail('invalid input reached AI');}}});
  for (const body of ['{', 'null', '{}', JSON.stringify({prompt:12}), JSON.stringify({prompt:' '}), JSON.stringify({prompt:'x'.repeat(24001)})]) {
    assert.equal((await worker.fetch(request(undefined,{body}),env)).status,400);
  }
});
test('bounds request bodies even without Content-Length', async () => {
  const env = environment();
  assert.equal((await worker.fetch(request(undefined,{body:'x'.repeat(100001)}),env)).status,413);
  assert.equal((await worker.fetch(request(undefined,{headers:{Origin:origin,'Content-Type':'application/json','Content-Length':'100001'}}),env)).status,413);
});
test('rate limit uses visitor IP and returns a recoverable 429', async () => {
  let key;
  const env = environment({LIMIT:{limit:async (input) => {key=input.key;return {success:false};}}});
  const res = await worker.fetch(request(undefined,{headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'}}),env);
  assert.equal(res.status,429); assert.equal(key,'192.0.2.1');
  assert.match((await res.json()).error,/minute/);
});
test('AI failures and empty results return 503 without leaking internals', async () => {
  for (const run of [async () => {throw new Error('private detail');},async () => ({response:' '})]) {
    const res=await worker.fetch(request(),environment({AI:{run}}));
    assert.equal(res.status,503); assert.doesNotMatch(await res.text(),/private detail/);
  }
});
