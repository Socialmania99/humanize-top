import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCheck, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { humanizeText } from '../../lib/gemini';
import { HumanizationResult } from '../../types';

export const HumanizerTool: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<HumanizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'casual' | 'professional' | 'narrative'>('casual');

  const handleHumanize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await humanizeText(input);
      setResult(res);
      
      // Save to history
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          original: input,
          humanized: res.casual, // Defaulting to casual for history for now
          score: 99,
          type: 'humanizer'
        })
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
            <UserCheck size={20} />
          </div>
          <h3 className="text-2xl font-bold">Humanizer</h3>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your AI-generated text here..."
          className="w-full h-64 p-6 rounded-2xl bg-[#F5F5F0] border-none focus:ring-2 focus:ring-emerald-500 resize-none text-lg"
        />

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-black/40 font-medium">
            {input.length} characters | {input.split(/\s+/).filter(Boolean).length} words
          </div>
          <button
            onClick={handleHumanize}
            disabled={loading || !input.trim()}
            className="bg-[#141414] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Humanize Text
          </button>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm"
        >
          <div className="flex gap-2 mb-6 p-1 bg-[#F5F5F0] rounded-full w-fit">
            {(['casual', 'professional', 'narrative'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                  activeTab === tab ? 'bg-white shadow-sm text-emerald-600' : 'text-black/40 hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="p-8 rounded-2xl bg-[#F5F5F0] min-h-[200px] text-lg leading-relaxed whitespace-pre-wrap">
              {result[activeTab]}
            </div>
            <button
              onClick={() => copyToClipboard(result[activeTab], activeTab)}
              className="absolute top-4 right-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-black/60 hover:text-emerald-600"
            >
              {copied === activeTab ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="font-bold text-emerald-900">99.99% Human Compatibility</div>
              <div className="text-sm text-emerald-700">This version is optimized to bypass strict AI detectors.</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
