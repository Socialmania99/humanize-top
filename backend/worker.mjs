const allowed = new Set(["https://humanize.top", "https://www.humanize.top"]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (!allowed.has(origin)) return new Response("Forbidden", { status: 403 });
    const headers = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    };
    const reply = (data, status = 200) => Response.json(data, { status, headers });
    if (new URL(request.url).pathname !== "/generate") return reply({}, 404);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return reply({}, 405);
    if (!request.headers.get("content-type")?.includes("application/json")) return reply({}, 415);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!(await env.LIMIT.limit({ key: ip })).success) return reply({error:"Please try again in a minute."}, 429);
    const size = Number(request.headers.get("content-length"));
    if (size > 100000) return reply({}, 413);
    // Bound the actual stream too: chunked requests need not send Content-Length.
    const reader = request.body?.getReader();
    const chunks = [];
    let bytes = 0;
    if (reader) {
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 100000) {
          await reader.cancel();
          return reply({}, 413);
        }
        chunks.push(value);
      }
    }
    const body = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    let payload;
    try { payload = JSON.parse(new TextDecoder().decode(body)); } catch { payload = null; }
    const prompt = payload?.prompt;
    if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 24000) return reply({error:"Please shorten your text."}, 400);
    try {
      const result = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [{ role:"user", content:prompt }], max_tokens:1600
      });
      if (!result?.response?.trim()) throw new Error("empty");
      return reply({text:result.response});
    } catch {
      return reply({error:"The writing service is unavailable. Please try again later."}, 503);
    }
  }
};
