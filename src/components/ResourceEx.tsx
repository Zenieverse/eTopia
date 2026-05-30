import React from 'react';
import { ResourceExchangeItem, UserProfile } from '../types';
import {
  Shuffle,
  Plus,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';

interface ResourceExProps {
  profile: UserProfile;
  resources: ResourceExchangeItem[];
  onAddResource: (item: ResourceExchangeItem) => void;
  onModifyResource: (id: string, updater: Partial<ResourceExchangeItem>) => void;
  onModifyProfile: (updater: Partial<UserProfile>) => void;
}

export default function ResourceEx({
  profile,
  resources,
  onAddResource,
  onModifyResource,
  onModifyProfile,
}: ResourceExProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [type, setType] = React.useState<ResourceExchangeItem['type']>('donation');
  const [val, setVal] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('All');
  const [notification, setNotification] = React.useState<string | null>(null);

  const matchedList = resources.filter(r => r.status === 'matched');
  const availableList = resources.filter(r => r.status === 'available');

  const filteredAvailable = filterType === 'All'
    ? availableList
    : availableList.filter(r => r.type === filterType);

  const handleLogResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !val) return;

    const newItem: ResourceExchangeItem = {
      id: `res-${Date.now()}`,
      type,
      title,
      description: desc,
      provider: profile.name,
      valueAmount: parseFloat(val),
      status: 'available',
    };

    onAddResource(newItem);
    setTitle('');
    setDesc('');
    setVal('');
    setShowAddForm(false);
    setNotification('Resource listed! eTopia automated match algorithm scanning for candidate needs.');
    
    // Reward for active provisioning
    onModifyProfile({
      impactScore: profile.impactScore + 20,
      reputationPoints: profile.reputationPoints + 50,
    });

    setTimeout(() => setNotification(null), 4000);
  };

  const handleMatchSimulate = (item: ResourceExchangeItem) => {
    const defaultRecipients = [
      'Eradicating Urban Digital Deserts',
      'Combating Extreme Climate Heat Waves',
      'District Digital Inclusion Portal Development',
    ];
    const pickedRecipient = defaultRecipients[Math.floor(Math.random() * defaultRecipients.length)];

    onModifyResource(item.id, {
      status: 'matched',
      recipientProject: pickedRecipient,
      matchedDate: new Date().toISOString().split('T')[0],
    });

    onModifyProfile({
      impactScore: profile.impactScore + 40,
      reputationPoints: profile.reputationPoints + 120,
    });

    setNotification(`Decentralized Match engine success! Matched ${item.title} to project: "${pickedRecipient}". Impact Score updated.`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Shuffle className="h-6 w-6 text-indigo-400" />
            <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
              Sovereign Resource Exchange Platform
            </h2>
          </div>
          <p className="text-slate-450 text-xs mt-1.5 leading-relaxed">
            Automated matchmaking registry linking sponsorships, Individual donations, venture capital investments, NGO grants, and skilled volunteer pools directly to registered civic needs.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="glass-button-primary text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          {showAddForm ? 'Back to Registry' : 'Offer / Deposit Resource'}
        </button>
      </div>

      {notification && (
        <div className="bg-indigo-500/10 border border-indigo-400/25 text-indigo-350 p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="cursor-pointer hover:text-white">✕</button>
        </div>
      )}

      {showAddForm ? (
        <div className="glass-card p-6 rounded-2xl max-w-xl mx-auto">
          <h3 className="text-white text-base font-bold border-b border-white/5 pb-3 flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-400" /> Provision Asset Pool
          </h3>
          <form onSubmit={handleLogResource} className="space-y-4 mt-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">ASSET CLASSIFICATION TYPE</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as ResourceExchangeItem['type'])}
                  className="w-full glass-input rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="donation" className="bg-[#0c0f16] text-white">Micro Donation (Individual)</option>
                  <option value="sponsorship" className="bg-[#0c0f16] text-white">Sponsorship (Corporate)</option>
                  <option value="grant" className="bg-[#0c0f16] text-white">Direct Grant (Govt/NGO)</option>
                  <option value="investment" className="bg-[#0c0f16] text-white">Impact Venture Investment</option>
                  <option value="volunteer" className="bg-[#0c0f16] text-white">Skilled Volunteer Hours Pool</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">AUDITED FARE VALUE BLOCK ($ USD)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">ASSET SUITE TITLE</label>
              <input
                type="text"
                required
                placeholder="e.g. 10 Refurbished Laptops with Solid battery backup modules"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">COMPREHENSIVE ELIGIBILITY SPECIFICATION</label>
              <textarea
                required
                rows={4}
                placeholder="Describe exact parameters, logistics routes, or vetting certifications required for candidates to claim this asset."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full glass-button-primary font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
            >
              Broadcast Resource to Exchange nodes
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Active and Available registries */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider font-mono text-slate-400">
                Available Resources Registry Pool ({filteredAvailable.length})
              </h3>

              {/* Filtering mechanism */}
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="glass-input text-xs rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none"
              >
                <option value="All" className="bg-[#0c0f16]">All types</option>
                <option value="donation" className="bg-[#0c0f16]">Donations</option>
                <option value="sponsorship" className="bg-[#0c0f16]">Sponsorships</option>
                <option value="grant" className="bg-[#0c0f16]">Grants</option>
                <option value="investment" className="bg-[#0c0f16]">Investments</option>
                <option value="volunteer" className="bg-[#0c0f16]">Volunteers</option>
              </select>
            </div>

            {filteredAvailable.length === 0 ? (
              <div className="glass-card border-dashed p-8 text-center rounded-2xl text-slate-500 text-xs">
                No pool matching this asset class is currently awaiting matcher execution.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAvailable.map(item => (
                  <div key={item.id} className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-indigo-500/10 text-indigo-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-white/5">
                          {item.type}
                        </span>
                        
                        <span className="text-white font-mono text-xs font-bold bg-black/20 border border-white/5 py-0.5 px-2.5 rounded-lg">
                          Value: ${item.valueAmount?.toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-white font-bold text-sm mt-3">{item.title}</h4>
                      <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Holder: <span className="text-slate-200 font-semibold">{item.provider}</span></span>
                      
                      <button
                        onClick={() => handleMatchSimulate(item)}
                        className="glass-button-primary text-xs font-bold px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <span>Match Asset</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Successful matched items ledger */}
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card p-5 rounded-2xl">
              <h4 className="text-white text-xs uppercase font-mono font-bold tracking-wider text-slate-400 border-b border-white/5 pb-3 flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400 fill-indigo-400/20" /> Matches Ledger Feed
              </h4>

              <div className="space-y-4 mt-5 text-[11px] leading-relaxed">
                {matchedList.length === 0 ? (
                  <p className="text-slate-500 text-center py-6">No matching actions recorded this cycle yet.</p>
                ) : (
                  matchedList.map(mat => (
                    <div key={mat.id} className="glass-card-nested border-white/5 p-3.5 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-slate-400 font-mono text-[9px]">
                        <span>COOP MATCH: Verified SECURE</span>
                        <span>{mat.matchedDate}</span>
                      </div>

                      <p className="text-slate-250 mt-1 leading-tight">
                        Matched <span className="font-bold text-white">"{mat.title}"</span> provided by <span className="text-indigo-300 font-bold">{mat.provider}</span>
                      </p>

                      <div className="bg-emerald-500/15 text-emerald-400 p-2 rounded border border-emerald-500/20 font-bold tracking-tight">
                        Destination: {mat.recipientProject}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl text-xs text-slate-450 leading-relaxed">
              <h4 className="text-white font-bold text-xs mb-2">Automated Matcher Algorithms</h4>
              eTopia matches trust-weighted grants to local initiatives based on SDG progress coordinates automatically to optimize distribution efficacy.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
