import React from 'react';
import { UserProfile, ChatMessage } from '../types';
import {
  MessageSquareCode,
  GraduationCap,
  Briefcase,
  Layers,
  HeartPulse,
  Scale,
  Sparkles,
  Send,
  Loader2,
} from 'lucide-react';

interface IDecideProps {
  profile: UserProfile;
  triggerAIContext: (instructions: string, prompt: string, history: ChatMessage[]) => Promise<string>;
}

export default function IDecide({ profile, triggerAIContext }: IDecideProps) {
  const [activeCategory, setActiveCategory] = React.useState<'Education' | 'Career' | 'Business' | 'Health' | 'Civics'>('Career');
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: `Hello ${profile.name}! I am I-Decide AI, your dedicated decision-support assistant.
How can I assist you today? Select a focus sector or ask me anything regarding local education, business legal structures, health resources coordination, or active civic engagement.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const presets = {
    Education: [
      'Draw up a microlearning course syllabus for AI ethics.',
      'Recommend regional digital inclusion programs for community elders.',
    ],
    Career: [
      'What core skills should I master to shift from virtual assistant to junior data analyst?',
      'Critique a mock resume focused on rural telemetry software builds.',
    ],
    Business: [
      'Draft a registration roadmap for a cooperative neighborhood battery enterprise.',
      'Check standard licensing regulations for organic recycling farms.',
    ],
    Health: [
      'Guide me on routing localized clinics equipped with translation specialists.',
      'How do I audit generic prescription medications for safety?',
    ],
    Civics: [
      'Format a public governance proposal draft seeking $10,000 for mesh network supplies.',
      'Design a grassroot volunteer recruitment matrix for localized heat gardens.',
    ],
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await triggerAIContext(
        'idecide',
        `User is asking about category [${activeCategory}] with prompt: ${textToSend}.`,
        messages
      );

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Apologies, my decision logic matching failed. Ensure GEMINI_API_KEY is configured in backend secrets.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <MessageSquareCode className="h-6 w-6 text-indigo-400" />
          <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
            I-Decide AI Support Engine
          </h2>
        </div>
        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
          Context-aware expert guidance for navigating essential services, career trajectories, local cooperatives orchestration, and grassroots legal processes securely on eTopia.
        </p>

        {/* Dynamic Category Selector */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-6">
          {(['Education', 'Career', 'Business', 'Health', 'Civics'] as const).map(cat => {
            const icons = {
              Education: GraduationCap,
              Career: Briefcase,
              Business: Layers,
              Health: HeartPulse,
              Civics: Scale,
            };
            const Icon = icons[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-3 px-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition whitespace-nowrap cursor-pointer focus:outline-none ${
                  activeCategory === cat
                    ? 'bg-indigo-500/15 border-indigo-400 text-indigo-300 font-semibold shadow-[0_0_8px_rgba(129,140,248,0.15)]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="text-[11px] font-medium tracking-tight">{cat} Guidance</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid splits chat & Presets list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        {/* Presets Sidebar List */}
        <div className="glass-card p-5 rounded-2xl hidden lg:flex flex-col h-full justify-between">
          <div className="space-y-4">
            <h3 className="text-white text-xs uppercase font-mono font-bold tracking-wider text-slate-450 border-b border-white/5 pb-2.5">
              Preset {activeCategory} Prompts
            </h3>
            <div className="space-y-2">
              {presets[activeCategory].map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(preset)}
                  className="w-full text-left bg-white/5 hover:bg-white/[0.08] p-3 rounded-xl border border-white/5 text-xs text-slate-300 hover:text-white transition leading-relaxed block cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
            <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 mb-1 leading-none">Decision Audit</p>
            <p className="text-[10px] text-slate-450 leading-normal">
              I-Decide leverages audited municipal rules and curriculum matrixes to ensure extreme, localized precision.
            </p>
          </div>
        </div>

        {/* Conversational Screen */}
        <div className="lg:col-span-2 glass-card p-0 flex flex-col h-full overflow-hidden border border-white/5">
          {/* Active Copilot banner */}
          <div className="bg-white/[0.02] py-3.5 px-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-indigo-400 fill-indigo-400" />
              <span className="text-xs text-white font-bold">I-Decide Intelligent Orchestrator</span>
            </div>
            <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
              ACTIVE
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs md:text-sm">
            {messages.map((msg, index) => {
              const isAss = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id || index}
                  className={`flex ${isAss ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed relative border ${
                      isAss
                        ? 'glass-card-nested border-white/5 text-slate-200'
                        : 'bg-indigo-500/15 text-indigo-250 border-indigo-400/20 font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1.5 ${
                        isAss ? 'text-slate-500' : 'text-indigo-400/60'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="glass-card-nested border-white/5 rounded-2xl p-3 flex items-center space-x-2 text-slate-400 text-xs font-mono font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                  <span>I-Decide synthesizing path recommendation...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick inline preset buttons under mobile viewports */}
          <div className="lg:hidden px-4 bg-white/[0.01] py-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {presets[activeCategory].map((preset, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(preset)}
                className="bg-white/5 text-slate-400 hover:text-white px-3 py-1 rounded-full text-[10px] border border-white/5 cursor-pointer"
              >
                {preset.substring(0, 24)}...
              </button>
            ))}
          </div>

          {/* Message form entry */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="p-3 bg-white/[0.02] border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              placeholder={`Ask I-Decide AI regarding ${activeCategory} guidance...`}
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              className="flex-1 glass-input rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-550 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="glass-button-primary disabled:opacity-50 rounded-xl p-2.5 flex items-center justify-center transition cursor-pointer"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
