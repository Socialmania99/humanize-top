import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, List, Loader2, Copy, Check, Sparkles } from 'lucide-react';
import { summarizeText } from '../../lib/gemini';
import ReactMarkdown from 'react-markdown';

export const SummarizerTool: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await summarizeText(input);
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
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white">
            <FileText size={20} />
          </div>
          <h3 className="text-2xl font-bold">Summarizer</h3>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste long articles or documents to condense into key bullet points..."
          className="w-full h-64 p-6 rounded-2xl bg-[#F5F5F0] border-none focus:ring-2 focus:ring-teal-500 resize-none text-lg"
        />

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-black/40 font-medium">
            Condenses content into key takeaways
          </div>
          <button
            onClick={handleSummarize}
            disabled={loading || !input.trim()}
            className="bg-[#141414] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-teal-600 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <List size={20} />}
            Summarize Now
          </button>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm relative"
        >
          <div className="flex items-center gap-2 mb-6 text-teal-600">
            <Sparkles size={20} />
            <h4 className="text-lg font-bold">Key Summary Points</h4>
          </div>
          
          <div className="p-8 rounded-2xl bg-[#F5F5F0] min-h-[200px] markdown-body prose prose-teal max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          
          <button
            onClick={copyToClipboard}
            className="absolute top-12 right-12 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-black/60 hover:text-teal-600"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </motion.div>
      )}
    </div>
  );
};
