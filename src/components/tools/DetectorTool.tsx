import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Search, Loader2, AlertCircle } from 'lucide-react';
import { detectAI } from '../../lib/gemini';
import { DetectionResult } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const DetectorTool: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await detectAI(input);
      setResult({
        ...res,
        wordCount: input.split(/\s+/).filter(Boolean).length,
        charCount: input.length
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const data = result ? [
    { name: 'AI Probability', value: result.score },
    { name: 'Human Probability', value: 100 - result.score }
  ] : [];

  const COLORS = ['#EF4444', '#10B981'];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white">
            <Shield size={20} />
          </div>
          <h3 className="text-2xl font-bold">AI Detector</h3>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text to analyze for AI patterns..."
          className="w-full h-64 p-6 rounded-2xl bg-[#F5F5F0] border-none focus:ring-2 focus:ring-blue-500 resize-none text-lg"
        />

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-black/40 font-medium">
            {input.length} characters | {input.split(/\s+/).filter(Boolean).length} words
          </div>
          <button
            onClick={handleDetect}
            disabled={loading || !input.trim()}
            className="bg-[#141414] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            Analyze Text
          </button>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="md:col-span-1 bg-white rounded-[32px] p-8 border border-black/5 shadow-sm flex flex-col items-center">
            <h4 className="text-lg font-bold mb-4">AI Print Score</h4>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-4xl font-black mt-2" style={{ color: result.score > 50 ? '#EF4444' : '#10B981' }}>
              {result.score}%
            </div>
            <div className="text-sm text-black/40 font-medium mt-1">AI Probability</div>
          </div>

          <div className="md:col-span-2 bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
            <h4 className="text-lg font-bold mb-6">Segment Analysis</h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {result.segments.map((segment, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border transition-all ${
                    segment.aiProbability > 70 
                      ? 'bg-red-50 border-red-100' 
                      : segment.aiProbability > 30 
                        ? 'bg-orange-50 border-orange-100' 
                        : 'bg-emerald-50 border-emerald-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">Segment {idx + 1}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      segment.aiProbability > 70 ? 'bg-red-500 text-white' : 'bg-black/5 text-black/60'
                    }`}>
                      {segment.aiProbability}% AI
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{segment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
