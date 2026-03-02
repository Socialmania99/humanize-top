import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Loader2, User, Bot } from 'lucide-react';
import { chatWithAI } from '../../lib/gemini';
import ReactMarkdown from 'react-markdown';

export const ChatTool: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const response = await chatWithAI(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response || "" }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-black/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-xl font-bold">AI Chat Assistant</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-black/20">
            <MessageSquare size={64} />
            <p className="text-xl font-bold">Start a conversation with Humanize Top AI</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-[#141414] text-white' : 'bg-[#00FF00] text-[#141414]'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-3xl ${
              msg.role === 'user' ? 'bg-[#141414] text-white rounded-tr-none' : 'bg-[#F5F5F0] text-[#141414] rounded-tl-none'
            }`}>
              <div className="markdown-body prose prose-sm max-w-none">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#00FF00] text-[#141414] flex items-center justify-center shrink-0">
              <Bot size={20} />
            </div>
            <div className="bg-[#F5F5F0] p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="animate-spin text-black/40" size={20} />
              <span className="text-sm font-bold text-black/40">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-black/5 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
            className="w-full p-4 pr-16 rounded-2xl bg-[#F5F5F0] border-none focus:ring-2 focus:ring-indigo-500 text-lg"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#141414] text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
