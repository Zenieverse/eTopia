import React from 'react';
import { ChatMessage, AgentType, UserProfile } from '../types';
import {
  Sparkles,
  Bot,
  Compass,
  DollarSign,
  Users,
  LineChart,
  ShieldCheck,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

interface CopilotPanelProps {
  profile: UserProfile;
  triggerAIContext: (instructions: string, prompt: string, history: ChatMessage[]) => Promise<string>;
}

export default function CopilotPanel({ profile, triggerAIContext }: CopilotPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeAgent, setActiveAgent] = React.useState<AgentType>('opportunity');
  const [conversations, setConversations] = React.useState<Record<AgentType, ChatMessage[]>>({
    opportunity: [
      { id: '1', sender: 'assistant', text: "Hello! Space-matched Opportunity Agent online. Ask me to find matching freelance jobs or curriculum certifications based on your profile skills.", timestamp: '01:00' }
    ],
    mentor: [
      { id: '1', sender: 'assistant', text: "Expert Mentor Agent online. Submit a business model or project structure for continuous VC-grade advisory.", timestamp: '01:00' }
    ],
    funding: [
      { id: '1', sender: 'assistant', text: "Smart Funding Agent online. I review pitch goals, seed alignments, or draft NGO grant requests with you.", timestamp: '01:00 font-mono' }
    ],
    community: [
      { id: '1', sender: 'assistant', text: "Grassroot Community Builder online. Let's design volunteer recruitment plans or regional forums structure.", timestamp: '01:00' }
    ],
    impact: [
      { id: '1', sender: 'assistant', text: "Social & Ecological Footprint auditor online. I analyze your profile activities and chart UN SDG alignment parameters.", timestamp: '01:00' }
    ],
    governance: [
      { id: '1', sender: 'assistant', text: "Transparent Governance Advisor online. Ask me about draft proposal formats or fund auditing guidelines.", timestamp: '01:00' }
    ],
    idecide: [],
  });

  const [inputText, setInputText] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const agentsList: { id: AgentType; label: string; desc: string; icon: any; color: string }[] = [
    { id: 'opportunity', label: 'Opportunity Matcher', desc: 'Syllabus & Job Finder helper', icon: Compass, color: 'text-sky-400 bg-sky-400/10' },
    { id: 'mentor', label: 'Incubator Mentor', desc: 'Expert venture strategy coach', icon: Bot, color: 'text-amber-400 bg-amber-400/10' },
    { id: 'funding', label: 'Smart Funding', desc: 'Grants matching & pitch strategist', icon: DollarSign, color: 'text-pink-400 bg-pink-400/10' },
    { id: 'community', label: 'Community Builder', desc: 'Volunteer campaigns alignment', icon: Users, color: 'text-indigo-400 bg-indigo-400/10' },
    { id: 'impact', label: 'Footprint auditor', desc: 'UN SDG and ecological metrics assessor', icon: LineChart, color: 'text-emerald-400 bg-emerald-400/10' },
    { id: 'governance', label: 'Sovereign Governance', desc: 'Proposals formatting & ledger neutral audits', icon: ShieldCheck, color: 'text-rose-400 bg-rose-400/10' },
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const currentHistory = conversations[activeAgent];
    const userMsg: ChatMessage = {
      id: `cop-usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...currentHistory, userMsg];
    setConversations(prev => ({
      ...prev,
      [activeAgent]: updatedHistory,
    }));
    setInputText('');
    setLoading(true);

    try {
      const response = await triggerAIContext(activeAgent, text, updatedHistory);

      const assMsg: ChatMessage = {
        id: `cop-ass-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations(prev => ({
        ...prev,
        [activeAgent]: [...prev[activeAgent], assMsg],
      }));
    } catch (e) {
      setConversations(prev => ({
        ...prev,
        [activeAgent]: [
          ...prev[activeAgent],
          {
            id: `cop-err-${Date.now()}`,
            sender: 'assistant',
            text: 'Connection failed. Please configure GEMINI_API_KEY inside secrets panel.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  const activeAgentDetail = agentsList.find(a => a.id === activeAgent) || agentsList[0];

  return (
    <>
      {/* Floating activation button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-55 glass-button-primary shadow-2xl text-white p-4.5 rounded-2xl flex items-center space-x-2.5 transition duration-300 focus:outline-none cursor-pointer scale-105"
      >
        <Sparkles className="h-4.5 w-4.5 animate-pulse text-indigo-300" />
        <span className="text-xs font-bold font-sans">AI Copilot Hub</span>
      </button>

      {/* Slide drawer container */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-110 glass-sidebar shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Draw Header */}
        <div className="bg-white/[0.02] p-4.5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-400 fill-indigo-400" />
            <div>
              <h3 className="text-white text-xs uppercase font-mono font-bold tracking-wider">Multi-Agent Orchestrator</h3>
              <p className="text-[10px] text-slate-400">6 Specialized AI Agents Co-working</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 focus:outline-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Action row with Agent selection */}
        <div className="bg-white/[0.01] p-3.5 border-b border-white/5 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
          {agentsList.map(ag => {
            const Icon = ag.icon;
            const isActive = activeAgent === ag.id;
            return (
              <button
                key={ag.id}
                onClick={() => setActiveAgent(ag.id)}
                className={`py-1.5 px-3 rounded-xl text-[10px] uppercase font-mono tracking-wider font-bold transition whitespace-nowrap flex items-center space-x-1.5 focus:outline-none border cursor-pointer ${
                  isActive
                    ? 'bg-indigo-500/15 border-indigo-400/50 text-indigo-300 shadow-[0_0_12px_rgba(129,140,248,0.15)] font-semibold'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{ag.id === 'opportunity' ? 'Opportun' : ag.id === 'governance' ? 'Govern' : ag.id}</span>
              </button>
            );
          })}
        </div>

        {/* Current Agent focus details card */}
        <div className="px-4 py-3 bg-white/[0.01] border-b border-white/5 flex items-center space-x-3 text-xs leading-tight">
          <div className={`p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/15`}>
            {React.createElement(activeAgentDetail.icon, { className: 'h-4 w-4' })}
          </div>
          <div>
            <p className="text-white font-bold leading-normal">{activeAgentDetail.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{activeAgentDetail.desc}</p>
          </div>
        </div>

        {/* Conversations timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs sm:text-xs">
          {conversations[activeAgent].map((msg, index) => {
            const isAss = msg.sender === 'assistant';
            return (
              <div key={index} className={`flex ${isAss ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-xl p-3 leading-relaxed relative ${
                  isAss
                    ? 'bg-white/[0.03] text-slate-300 border border-white/5'
                    : 'bg-indigo-500/15 text-indigo-150 border border-indigo-400/30 font-semibold shadow-[0_2px_12px_rgba(129,140,248,0.1)]'
                }`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                <Loader2 className="h-4.5 w-4.5 animate-spin text-indigo-400" />
                <span>{activeAgentDetail.label} thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat input box */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="p-3.5 bg-white/[0.02] border-t border-white/5 flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={`Query ${activeAgentDetail.label}...`}
            className="flex-1 glass-input rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="glass-button-primary disabled:opacity-50 text-white rounded-xl px-4 py-2 text-xs font-bold transition focus:outline-none cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40"
        ></div>
      )}
    </>
  );
}
