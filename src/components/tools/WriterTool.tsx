import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PenTool, Sparkles, Loader2, Copy, Check, UserCheck } from 'lucide-react';
import { generateDraft } from '../../lib/gemini';
import ReactMarkdown from 'react-markdown';

export const WriterTool: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleWrite = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await generateDraft(input);
      setResult(res || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white">
            <PenTool size={20} />
          </div>
          <h3 className="text-2xl font-bold">AI Writer</h3>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What should I write for you? (e.g., 'A blog post about sustainable energy')"
          className="w-full h-32 p-6 rounded-2xl bg-[#F5F5F0] border-none focus:ring-2 focus:ring-rose-500 resize-none text-lg"
        />

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-black/40 font-medium">
            Generates a draft and automatically humanizes it
          </div>
          <button
            onClick={handleWrite}
            disabled={loading || !input.trim()}
            className="bg-[#141414] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-rose-600 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Generate Draft
          </button>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm relative"
        >
          <div className="flex items-center gap-2 mb-6 text-rose-600">
            <UserCheck size={20} />
            <h4 className="text-lg font-bold">Humanized Draft</h4>
          </div>
          
          <div className="p-8 rounded-2xl bg-[#F5F5F0] min-h-[400px] markdown-body prose prose-rose max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          
          <button
            onClick={copyToClipboard}
            className="absolute top-12 right-12 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-black/60 hover:text-rose-600"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </motion.div>
      )}
    </div>
  );
};
