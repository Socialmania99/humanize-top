import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History, Calendar, UserCheck, Shield, Clock, Trash2 } from 'lucide-react';
import { HistoryItem } from '../types';

export const HistoryView: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/history/${userEmail}`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      });
  }, [userEmail]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gray-500 flex items-center justify-center text-white">
            <History size={20} />
          </div>
          <h3 className="text-2xl font-bold">Your History</h3>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-black/20 font-bold">
            Loading your history...
          </div>
        ) : history.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-black/20 gap-4">
            <Clock size={48} />
            <p className="font-bold">No history found yet. Start humanizing!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#F5F5F0] p-6 rounded-3xl border border-black/5 flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                  item.type === 'humanizer' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}>
                  {item.type === 'humanizer' ? <UserCheck size={24} /> : <Shield size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold capitalize">{item.type}</span>
                    <span className="text-xs text-black/30 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-black/60 truncate max-w-xl">
                    {item.original_text}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-600">{item.score}%</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-black/30">Score</div>
                  </div>
                  <button className="p-3 bg-white rounded-xl text-black/40 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
