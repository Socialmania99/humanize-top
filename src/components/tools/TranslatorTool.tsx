import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, ArrowRight, Loader2, Copy, Check } from 'lucide-react';
import { translateText } from '../../lib/gemini';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali', 'Turkish', 'Dutch', 'Polish', 'Vietnamese', 'Thai'
];

export const TranslatorTool: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await translateText(input, targetLang);
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Globe size={20} />
            </div>
            <h3 className="text-2xl font-bold">Any-to-Any Translator</h3>
          </div>
          
          <div className="flex items-center gap-4 bg-[#F5F5F0] p-1 rounded-full">
            <div className="px-6 py-2 text-sm font-bold text-black/40">Auto Detect</div>
            <ArrowRight size={16} className="text-black/20" />
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-white px-6 py-2 rounded-full text-sm font-bold border-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-80 p-8 rounded-[32px] bg-[#F5F5F0] border-none focus:ring-2 focus:ring-blue-500 resize-none text-xl leading-relaxed"
          />
          
          <div className="relative">
            <div className="w-full h-80 p-8 rounded-[32px] bg-[#F5F5F0] border-none overflow-y-auto text-xl leading-relaxed whitespace-pre-wrap">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-black/20 gap-4">
                  <Loader2 className="animate-spin" size={48} />
                  <p className="font-bold">Translating your content...</p>
                </div>
              ) : result ? (
                result
              ) : (
                <div className="h-full flex items-center justify-center text-black/20 italic">
                  Translation will appear here...
                </div>
              )}
            </div>
            {result && !loading && (
              <button
                onClick={copyToClipboard}
                className="absolute top-6 right-6 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-black/60 hover:text-blue-600"
              >
                {copied ? <Check size={24} /> : <Copy size={24} />}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={loading || !input.trim()}
            className="bg-[#141414] text-white px-12 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-blue-600 transition-all disabled:opacity-50 hover:scale-105"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Globe size={24} />}
            Translate Now
          </button>
        </div>
      </div>
    </div>
  );
};
