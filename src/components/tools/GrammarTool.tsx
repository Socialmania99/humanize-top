import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Type, CheckCircle, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { checkGrammar } from '../../lib/gemini';

export const GrammarTool: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ correctedText: string; changes: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCheck = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await checkGrammar(input);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.correctedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
            <Type size={20} />
          </div>
          <h3 className="text-2xl font-bold">Grammar Checker</h3>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text to check for grammar, spelling, and punctuation errors..."
          className="w-full h-64 p-6 rounded-2xl bg-[#F5F5F0] border-none focus:ring-2 focus:ring-orange-500 resize-none text-lg"
        />

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-black/40 font-medium">
            Real-time syntax and spelling correction
          </div>
          <button
            onClick={handleCheck}
            disabled={loading || !input.trim()}
            className="bg-[#141414] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
            Check Grammar
          </button>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm relative">
            <h4 className="text-lg font-bold mb-4">Corrected Text</h4>
            <div className="p-6 rounded-2xl bg-[#F5F5F0] min-h-[200px] text-lg leading-relaxed whitespace-pre-wrap">
              {result.correctedText}
            </div>
            <button
              onClick={copyToClipboard}
              className="absolute top-12 right-12 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-black/60 hover:text-orange-600"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
            <h4 className="text-lg font-bold mb-4">Changes Made</h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {result.changes.length > 0 ? (
                result.changes.map((change, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-100 text-sm">
                    <AlertCircle size={18} className="text-orange-500 shrink-0" />
                    <span className="text-orange-900">{change}</span>
                  </div>
                ))
              ) : (
                <div className="text-black/40 italic">No errors found! Your text is perfect.</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
