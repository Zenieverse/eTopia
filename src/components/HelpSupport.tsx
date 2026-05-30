import React from 'react';
import { UserProfile, ServiceHelpDesk } from '../types';
import {
  HeartHandshake,
  BookOpen,
  Scale,
  Activity,
  Users,
  Award,
  Sparkles,
  Send,
} from 'lucide-react';

interface HelpSupportProps {
  profile: UserProfile;
  onModifyProfile: (updater: Partial<UserProfile>) => void;
}

export default function HelpSupport({ profile, onModifyProfile }: HelpSupportProps) {
  const [selectedService, setSelectedService] = React.useState<ServiceHelpDesk | null>(null);
  const [ticketInput, setTicketInput] = React.useState('');
  const [assistanceLog, setAssistanceLog] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const services: ServiceHelpDesk[] = [
    {
      id: 'h-1',
      name: 'Digital Literacy Hub',
      category: 'Digital Literacy',
      description: 'Acquire standard computing, internet protocols verification, smart navigation, and LLM prompting safety certificates.',
      availableStaff: 3,
    },
    {
      id: 'h-2',
      name: 'Career Guidance Office',
      category: 'Career Counseling',
      description: 'Receive counseling matching your career path to open local cooperative needs, and complete portfolio audits.',
      availableStaff: 2,
    },
    {
      id: 'h-3',
      name: 'Provincial Legal Office',
      category: 'Legal Resources',
      description: 'Find local templates, cooperative governance blueprints, land filings assistance, and dispute structures templates.',
      availableStaff: 4,
    },
    {
      id: 'h-4',
      name: 'Primary Health Navigation',
      category: 'Health Navigation',
      description: 'Coordination center mapping regional emergency response units, generic drug reviews, and active clinical locations.',
      availableStaff: 5,
    },
    {
      id: 'h-5',
      name: 'Civic Community Support',
      category: 'Community Support',
      description: 'Resolve local conflict escalations, organize municipal volunteer restoration actions, and host public debates.',
      availableStaff: 3,
    },
  ];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim() || !selectedService) return;

    setLoading(true);

    setTimeout(() => {
      setAssistanceLog(prev => [
        `Case filed for ${selectedService.name}: "${ticketInput}" (Vetted case code: eCase-${Math.round(Math.random() * 9000 + 1000)})`,
        ...prev,
      ]);
      setTicketInput('');
      setLoading(false);

      // Reward repute on filing legitimate civic case
      onModifyProfile({
        impactScore: profile.impactScore + 5,
        reputationPoints: profile.reputationPoints + 20,
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Intro visual header */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <HeartHandshake className="h-6 w-6 text-indigo-400" />
          <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
            Virtual Help & Hybrid Support Centers
          </h2>
        </div>
        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
          Access specialized helpdesks designed for rapid social inclusion. Interact with on-chain human coordinators combined with instant AI classification bots.
        </p>
      </div>

      {/* Main splits layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Service Desks Directory list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider font-mono text-slate-400">
            Available Vetted Services Channels
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(srv => {
              const icons = {
                'Digital Literacy': BookOpen,
                'Career Counseling': Award,
                'Legal Resources': Scale,
                'Health Navigation': Activity,
                'Community Support': Users,
              };
              const Icon = icons[srv.category] || HeartHandshake;
              const isSelected = selectedService?.id === srv.id;

              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`glass-card glass-card-hover p-5 rounded-2xl cursor-pointer transition flex flex-col justify-between ${
                    isSelected ? 'border-indigo-500 bg-white/[0.06]' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="p-2 rounded-xl bg-[#0c0f16]/40 border border-white/5">
                        <Icon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-black/20 px-2 py-0.5 rounded text-indigo-300 border border-white/5">
                        {srv.availableStaff} Coordinators live
                      </span>
                    </div>

                    <h4 className="text-white font-bold text-sm mt-4">{srv.name}</h4>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 block mt-4 tracking-wider">
                    {isSelected ? '✓ ACTIVE INTAKE CHANNEL' : 'Select Service to Initiate Draft'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Intake ticketing Panel */}
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl">
            {selectedService ? (
              <div className="space-y-5">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-white text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" /> Intake: {selectedService.category}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Submit questions or case briefs for immediate response routing.</p>
                </div>

                <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">SECURE DETAIL BRIEF</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketInput}
                      onChange={e => setTicketInput(e.target.value)}
                      placeholder="e.g. My family is starting an agricultural compost collective next week. What local licensing models are required to claim eTopia green grants?"
                      className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none leading-relaxed"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full glass-button-primary disabled:opacity-50 text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? 'Filing cases on ledger...' : 'Deploy Legal Support Intake'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-405 leading-relaxed flex flex-col items-center justify-center space-y-2">
                <HeartHandshake className="h-8 w-8 text-slate-650 animate-pulse" />
                <p>Choose any Helpdesk channel block to begin filing tickets or checking local documentation templates.</p>
              </div>
            )}
          </div>

          {/* Past logs of case creations */}
          {assistanceLog.length > 0 && (
            <div className="glass-card p-5 rounded-2xl space-y-3 max-h-64 overflow-y-auto">
              <h4 className="text-white text-xs font-bold border-b border-white/5 pb-2 uppercase tracking-wide font-mono text-slate-400">My Active Intake Records</h4>
              <div className="space-y-2 font-mono text-[10px]">
                {assistanceLog.map((log, idx) => (
                  <div key={idx} className="glass-card-nested border-white/5 p-2 rounded text-indigo-300 leading-normal">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
