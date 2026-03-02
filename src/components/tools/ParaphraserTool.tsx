import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { paraphraseText } from '../../lib/gemini';

export const ParaphraserTool: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleParaphrase = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await paraphraseText(input);
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
          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white">
            <RefreshCw size={20} />
          </div>
          <h3 className="text-2xl font-bold">Paraphraser</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-sm font-bold text-black/40 uppercase tracking-wider">Original Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to paraphrase..."
              className="w-full h-80 p-6 rounded-2xl bg-[#F5F5F0] border-none focus:ring-2 focus:ring-purple-500 resize-none text-lg"
            />
          </div>

          <div className="space-y-4 relative">
            <label className="text-sm font-bold text-black/40 uppercase tracking-wider">Paraphrased Result</label>
            <div className="w-full h-80 p-6 rounded-2xl bg-[#F5F5F0] border-none overflow-y-auto text-lg leading-relaxed whitespace-pre-wrap">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-black/20 gap-4">
                  <Loader2 className="animate-spin" size={48} />
                  <p className="font-bold">Rewriting your content...</p>
                </div>
              ) : result ? (
                result
              ) : (
                <div className="h-full flex items-center justify-center text-black/20 italic">
                  Result will appear here...
                </div>
              )}
            </div>
            {result && !loading && (
              <button
                onClick={copyToClipboard}
                className="absolute top-12 right-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-black/60 hover:text-purple-600"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-black/40 font-medium">
            Advanced synonym mapping active
          </div>
          <button
            onClick={handleParaphrase}
            disabled={loading || !input.trim()}
            className="bg-[#141414] text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Paraphrase Now
          </button>
        </div>
      </div>
    </div>
  );
};
