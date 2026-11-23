'use client';

import { plainEdit } from './plain-edit';
import { useEffect, useRef, useState } from 'react';

type Tool = { title: string; engine: string; archetype: string; description: string };
type Session = { prompt(input: string, options: {signal: AbortSignal}): Promise<string>; destroy(): void };
type Model = { availability(): Promise<string>; create(options: {signal: AbortSignal}): Promise<Session> };
const endpoint = process.env.NEXT_PUBLIC_WRITING_API;
const instructions: Record<string, string> = {
  rewrite: 'Rewrite naturally. Preserve the meaning, facts, numbers and names. Return only the revised text.',
  summarize: 'Summarize the supplied text. Use only information found in it.',
  grammar: 'Correct spelling, punctuation and grammar. Preserve the original meaning. Return the corrected text.',
  translate: 'Translate the supplied text into the requested language. Return only the translation.'
};

export function LiveWriting({tool}: {tool: Tool}) {
  const [input, setInput] = useState('');
  const [choice, setChoice] = useState(tool.engine === 'translate' ? 'English' : 'Natural');
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<{question:string; answer:string}[]>([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const active = useRef<AbortController | null>(null);
  const chat = tool.archetype === 'chat';
  useEffect(() => () => active.current?.abort(), []);

  async function run() {
    if (!input.trim() || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setBusy(true);
    setStatus('Preparing the writing service…');
    const task = instructions[tool.engine] || (chat ? 'Answer the latest question using the conversation for context.' : 'Create the requested document from the brief.');
    const context = chat ? history.slice(-3).map(item => item.question + '\n' + item.answer).join('\n').slice(-7000) : '';
    const prompt = [tool.title, task, tool.engine === 'translate' ? 'Target language: ' + choice : 'Tone: ' + choice, context, input.trim()].filter(Boolean).join('\n\n');
    let session: Session | undefined;
    try {
      let result: string;
      if (endpoint) {
        const response = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt}), signal:controller.signal});
        const data = await response.json() as {text?: string; error?: string};
        if (!response.ok) throw new Error(data.error || 'The writing service could not complete this request.');
        result = data.text ?? "";
      } else {
        const model = (window as Window & {LanguageModel?: Model}).LanguageModel;
        if (!model || await model.availability() === 'unavailable') throw new Error('On-device AI is unavailable in this browser. This site needs its hosted writing service enabled to support this device.');
        setStatus('Preparing the on-device model. The first download can take a few minutes.');
        session = await model.create({signal:controller.signal});
        setStatus('Writing…');
        result = await session.prompt(prompt, {signal:controller.signal});
      }
      if (controller.signal.aborted) return;
      if (!result?.trim()) throw new Error('The model returned an empty response.');
      setAnswer(result);
      if (chat) {
        setHistory(previous => [...previous, {question:input, answer:result}]);
        setInput('');
      }
      setStatus('Done.');
    } catch (error) {
      setStatus(controller.signal.aborted ? 'Stopped.' : error instanceof Error ? error.message : 'Please try again.');
    } finally {
      session?.destroy();
      active.current = null;
      setBusy(false);
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([answer], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = tool.title + '.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className="generator-layout">
    <section className="brief-panel">
      <label className="field"><span>{chat ? 'Your question' : tool.archetype === 'editor' ? 'Your text' : 'Your brief'}</span>
        <textarea rows={10} maxLength={12000} disabled={busy} value={input} onChange={e => setInput(e.target.value)} /></label>
      <label className="field"><span>{tool.engine === 'translate' ? 'Target language' : 'Tone'}</span>
        <select disabled={busy} value={choice} onChange={e => setChoice(e.target.value)}>
          {(tool.engine === 'translate' ? ['English','Hindi','Spanish','French','German','Japanese'] : ['Natural','Professional','Conversational','Concise']).map(value => <option key={value}>{value}</option>)}
        </select></label>
      <p>{endpoint ? 'Submitting sends your text to the hosted AI service.' : 'Uses on-device AI in supported browsers.'}</p>
      <button className="primary" disabled={busy || !input.trim()} onClick={run}>{chat ? 'Send' : tool.engine === 'rewrite' ? 'Rewrite text' : 'Generate result'}</button>
      {tool.engine === 'rewrite' && <button className="secondary" disabled={busy || !input.trim()} onClick={() => {
        const edited = plainEdit(input);
        setAnswer(edited);
        setStatus(edited === input ? 'No matching wordy phrases found.' : 'Simplified common phrases on this device.');
      }}>Simplify common phrases locally</button>}
      {busy && <button onClick={() => active.current?.abort()}>Stop</button>}
      <p role="status">{status}</p>
    </section>
    <section className="result-panel"><h2>{chat ? 'Conversation' : 'Result'}</h2>
      {chat ? history.map((turn, index) => <article key={index}><strong>{turn.question}</strong><p style={{whiteSpace:'pre-wrap'}}>{turn.answer}</p></article>) : <p style={{whiteSpace:'pre-wrap'}}>{answer}</p>}
      {answer && <div className="output-actions"><button onClick={async () => {try {await navigator.clipboard.writeText(answer); setStatus('Copied.');} catch {setStatus('Please select the result and copy it manually.');}}}>Copy result</button><button onClick={download}>Download text</button></div>}
    </section>
  </div>;
}
