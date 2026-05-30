import React from 'react';
import { UserProfile } from '../types';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Plus,
} from 'lucide-react';

interface BehavioralNavigationProps {
  profile: UserProfile;
  onModifyProfile: (updater: Partial<UserProfile>) => void;
}

export default function BehavioralNavigation({ profile, onModifyProfile }: BehavioralNavigationProps) {
  const [deeds, setDeeds] = React.useState([
    { id: '1', person: 'Amina El-Amin', deed: 'Translated rural wellness pamphlets into 3 regional oral dialects.', category: 'Social Inclusion', pts: 85, date: 'Right Now' },
    { id: '2', person: 'Siddharth Mehta', deed: 'Held a free 4-week weekend workshop on secure LLM prompting safety schemas.', category: 'Digital Literacy', pts: 120, date: '1 hour ago' },
    { id: '3', person: 'Marcus Vance', deed: 'Donated 5 refurbished tablets with solar charging panels to local schools.', category: 'Resource Exchange', pts: 150, date: 'Yesterday' },
  ]);

  const [inputPerson, setInputPerson] = React.useState('');
  const [inputDeed, setInputDeed] = React.useState('');
  const [inputCat, setInputCat] = React.useState('Social Inclusion');
  const [notification, setNotification] = React.useState<string | null>(null);

  const handleRegisterDeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPerson || !inputDeed) return;

    const ptsReward = Math.round(Math.random() * 50 + 50);
    const newDeed = {
      id: `deed-${Date.now()}`,
      person: inputPerson,
      deed: inputDeed,
      category: inputCat,
      pts: ptsReward,
      date: 'Just Now',
    };

    setDeeds([newDeed, ...deeds]);
    setInputPerson('');
    setInputDeed('');
    
    // Reward current reporter a smaller tip for active civic auditing
    onModifyProfile({
      impactScore: profile.impactScore + 10,
      reputationPoints: profile.reputationPoints + 30,
      trustScore: Math.min(profile.trustScore + 1, 100),
    });

    setNotification(`Positive civic deed verified on ledger! Dispensed +${ptsReward} Reputation points to ${inputPerson}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="h-6 w-6 text-indigo-400" />
            <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
              Behavioral Navigation Engine & Trust Score
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Sovereign digital citizenship metric. Monitors positive civic action, ethical platform participation, mutual recognition, and public helpfulness ledger on-chain.
          </p>
        </div>

        <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl flex items-center space-x-3.5">
          <Award className="h-7 w-7 text-indigo-400" />
          <div>
            <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 leading-none">My Citizenship Score</p>
            <p className="font-mono text-white text-md font-bold mt-1">{profile.trustScore}% <span className="text-[10px] text-indigo-400 font-semibold">Extreme Trust</span></p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="cursor-pointer hover:text-white">✕</button>
        </div>
      )}

      {/* Grid divisions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Positive Deeds feed list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-white text-xs uppercase font-mono font-bold tracking-wider text-slate-450">
            Civilian Honor ledger (Verified Deeds)
          </h3>

          <div className="space-y-3">
            {deeds.map(d => (
              <div key={d.id} className="glass-card glass-card-hover p-4.5 rounded-2xl flex items-start justify-between gap-4 transition hover:border-white/10">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 mt-0.5">
                    <Heart className="h-4.5 w-4.5 fill-indigo-400/20" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm leading-none">{d.person}</p>
                      <span className="text-[10px] text-slate-500 font-medium font-mono inline-block">{d.date}</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">{d.deed}</p>
                    <span className="bg-white/5 font-mono text-[9px] text-slate-400 px-2 py-0.5 rounded border border-white/5 mt-3.5 inline-block font-semibold">
                      {d.category}
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-right flex-shrink-0">
                  <p className="text-xs font-mono font-bold text-indigo-400">+{d.pts}</p>
                  <p className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-500">REPUTE</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit/Register new deed form */}
        <div className="glass-card p-5.5 rounded-2xl h-fit border border-white/5">
          <h3 className="text-white text-sm font-bold border-b border-white/5 pb-3 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-indigo-400" /> Log Civil Recognition
          </h3>
          
          <form onSubmit={handleRegisterDeed} className="space-y-4 mt-5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">RECIPIENT FULL NAME</label>
              <input
                type="text"
                required
                value={inputPerson}
                onChange={e => setInputPerson(e.target.value)}
                placeholder="e.g. Kenji Sato"
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">CIVIC REPUTATION SECTOR</label>
              <select
                value={inputCat}
                onChange={e => setInputCat(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-white focus:outline-none"
              >
                <option value="Social Inclusion" className="bg-[#0c0f16] text-white">Social Inclusion & Translation</option>
                <option value="Digital Literacy" className="bg-[#0c0f16] text-white">Digital Literacy & Support</option>
                <option value="Resource Exchange" className="bg-[#0c0f16] text-white">Resource Exchange & Tools</option>
                <option value="Climate Action" className="bg-[#0c0f16] text-white">Climate Action & Heat Mitigation</option>
                <option value="Advocacy" className="bg-[#0c0f16] text-white">Governance & Proposal Drafting</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">DEED ACTIONS DESCRIPTION</label>
              <textarea
                required
                rows={4}
                value={inputDeed}
                onChange={e => setInputDeed(e.target.value)}
                placeholder="Describe their acts simply and honestly. e.g. Accompanied 8 blind citizens to register their security IDs."
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full glass-button-primary font-bold py-3.5 rounded-xl transition text-xs cursor-pointer"
            >
              Verify Deed on Ledger Node
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
