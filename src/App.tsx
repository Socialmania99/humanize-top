import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  UserCheck, 
  RefreshCw, 
  Type, 
  Search, 
  MessageSquare, 
  Globe, 
  FileText, 
  PenTool,
  History,
  LayoutDashboard,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { Mascot } from './components/Mascot';
import { ToolType, User } from './types';
import { HumanizerTool } from './components/tools/HumanizerTool';
import { DetectorTool } from './components/tools/DetectorTool';
import { ParaphraserTool } from './components/tools/ParaphraserTool';
import { GrammarTool } from './components/tools/GrammarTool';
import { ChatTool } from './components/tools/ChatTool';
import { TranslatorTool } from './components/tools/TranslatorTool';
import { SummarizerTool } from './components/tools/SummarizerTool';
import { WriterTool } from './components/tools/WriterTool';
import { HistoryView } from './components/HistoryView';

const USER_EMAIL = "Aditya.wapka@gmail.com";

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolType | 'history' | 'dashboard'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/user/${USER_EMAIL}`)
      .then(res => res.json())
      .then(setUser);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detector', label: 'AI Detector', icon: Shield },
    { id: 'humanizer', label: 'Humanizer', icon: UserCheck },
    { id: 'paraphraser', label: 'Paraphraser', icon: RefreshCw },
    { id: 'grammar', label: 'Grammar Checker', icon: Type },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'translator', label: 'Translator', icon: Globe },
    { id: 'summarizer', label: 'Summarizer', icon: FileText },
    { id: 'writer', label: 'AI Writer', icon: PenTool },
    { id: 'history', label: 'History', icon: History },
  ];

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard': return <DashboardView onSelectTool={(tool) => setActiveTool(tool as any)} />;
      case 'detector': return <DetectorTool userEmail={USER_EMAIL} />;
      case 'humanizer': return <HumanizerTool userEmail={USER_EMAIL} />;
      case 'paraphraser': return <ParaphraserTool userEmail={USER_EMAIL} />;
      case 'grammar': return <GrammarTool userEmail={USER_EMAIL} />;
      case 'chat': return <ChatTool userEmail={USER_EMAIL} />;
      case 'translator': return <TranslatorTool userEmail={USER_EMAIL} />;
      case 'summarizer': return <SummarizerTool userEmail={USER_EMAIL} />;
      case 'writer': return <WriterTool userEmail={USER_EMAIL} />;
      case 'history': return <HistoryView userEmail={USER_EMAIL} />;
      default: return <DashboardView onSelectTool={(tool) => setActiveTool(tool as any)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F0] text-[#141414] font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#141414] text-white flex flex-col relative z-20"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <Mascot size={32} />
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight"
            >
              Humanize Top
            </motion.span>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTool(item.id as any)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTool === item.id 
                  ? 'bg-[#00FF00] text-[#141414] font-semibold shadow-[0_0_15px_rgba(0,255,0,0.3)]' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          {isSidebarOpen ? (
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Credits</span>
                <Zap size={14} className="text-[#00FF00]" />
              </div>
              <div className="text-2xl font-bold">{user?.credits || 0}</div>
              <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00FF00]" 
                  style={{ width: `${Math.min(((user?.credits || 0) / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Zap size={20} className="text-[#00FF00]" />
              <span className="text-[10px] font-bold">{user?.credits || 0}</span>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-[#00FF00] text-[#141414] p-1 rounded-full shadow-lg"
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-black/5 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold capitalize">{activeTool.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-black/60">{USER_EMAIL}</div>
            <div className="w-8 h-8 rounded-full bg-[#141414] text-white flex items-center justify-center text-xs font-bold">
              {USER_EMAIL[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto h-full"
            >
              {renderTool()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function DashboardView({ onSelectTool }: { onSelectTool: (tool: string) => void }) {
  const tools = [
    { id: 'detector', label: 'AI Detector', desc: 'Identify AI-generated segments with precision.', icon: Shield, color: 'bg-blue-500' },
    { id: 'humanizer', label: 'Humanizer', desc: 'Transform AI text into natural human content.', icon: UserCheck, color: 'bg-emerald-500' },
    { id: 'paraphraser', label: 'Paraphraser', desc: 'Rewrite text while keeping the core meaning.', icon: RefreshCw, color: 'bg-purple-500' },
    { id: 'grammar', label: 'Grammar', desc: 'Real-time syntax and spelling correction.', icon: Type, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <Mascot size={80} className="mx-auto" />
        <h1 className="text-5xl font-bold tracking-tight">Welcome to Humanize Top</h1>
        <p className="text-xl text-black/60 max-w-2xl mx-auto">
          The ultimate suite for AI detection and humanization. Bypass detectors and create content that resonates.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileHover={{ y: -5 }}
            onClick={() => onSelectTool(tool.id)}
            className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-xl transition-all text-left group"
          >
            <div className={`${tool.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              <tool.icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{tool.label}</h3>
            <p className="text-sm text-black/50 leading-relaxed">{tool.desc}</p>
          </motion.button>
        ))}
      </div>

      <section className="bg-[#141414] text-white rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-bold">Ready to Humanize?</h2>
          <p className="text-white/60 text-lg">
            Our advanced algorithms ensure your content sounds natural, engaging, and 100% human. 
            Join thousands of creators who trust Humanize Top.
          </p>
          <button 
            onClick={() => onSelectTool('humanizer')}
            className="bg-[#00FF00] text-[#141414] px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform"
          >
            Get Started Now
          </button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <div className="text-3xl font-bold text-[#00FF00]">99.9%</div>
            <div className="text-sm text-white/50">Human Score</div>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <div className="text-3xl font-bold text-[#00FF00]">100+</div>
            <div className="text-sm text-white/50">Languages</div>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <div className="text-3xl font-bold text-[#00FF00]">24/7</div>
            <div className="text-sm text-white/50">AI Support</div>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <div className="text-3xl font-bold text-[#00FF00]">Instant</div>
            <div className="text-sm text-white/50">Processing</div>
          </div>
        </div>
      </section>
    </div>
  );
}
