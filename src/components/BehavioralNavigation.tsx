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
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
              Behavioral Navigation Engine & Trust Score
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Sovereign digital citizenship metric. Monitors positive civic action, ethical platform participation, mutual recognition, and public helpfulness ledger on-chain.
          </p>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center space-x-3.5">
          <Award className="h-7 w-7 text-emerald-400" />
          <div>
            <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 leading-none">My Citizenship Score</p>
            <p className="font-mono text-white text-md font-bold mt-1">{profile.trustScore}% <span className="text-[10px] text-emerald-400 font-semibold">Extreme Trust</span></p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Grid divisions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Positive Deeds feed list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider font-mono text-slate-400">
            Civilian Honor ledger (Verified Deeds)
          </h3>

          <div className="space-y-3">
            {deeds.map(d => (
              <div key={d.id} className="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl flex items-start justify-between gap-4 hover:border-slate-700 transition">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 mt-0.5">
                    <Heart className="h-4.5 w-4.5 fill-emerald-400/20" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">
                      {d.person} <span className="text-xs text-slate-500 font-medium normal-case font-mono">{d.date}</span>
                    </p>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{d.deed}</p>
                    <span className="bg-slate-950 font-mono text-[9px] text-slate-400 px-2 py-0.5 rounded border border-slate-850 mt-3.5 inline-block font-semibold">
                      {d.category}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-850 text-right">
                  <p className="text-xs font-mono font-bold text-emerald-400">+{d.pts}</p>
                  <p className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-500">REPUTE</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit/Register new deed form */}
        <div className="bg-slate-900 border border-slate-800 p-5.5 rounded-2xl h-fit">
          <h3 className="text-white text-sm font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-emerald-400" /> Log Civil Recognition
          </h3>
          
          <form onSubmit={handleRegisterDeed} className="space-y-4 mt-5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">RECIPIENT FULL NAME</label>
              <input
                type="text"
                required
                value={inputPerson}
                onChange={e => setInputPerson(e.target.value)}
                placeholder="e.g. Kenji Sato"
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">CIVIC REPUTATION SECTOR</label>
              <select
                value={inputCat}
                onChange={e => setInputCat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Social Inclusion">Social Inclusion & Translation</option>
                <option value="Digital Literacy">Digital Literacy & Support</option>
                <option value="Resource Exchange">Resource Exchange & Tools</option>
                <option value="Climate Action">Climate Action & Heat Mitigation</option>
                <option value="Advocacy">Governance & Proposal Drafting</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">DEED ACTIONS DESCRIPTION</label>
              <textarea
                required
                rows={4}
                value={inputDeed}
                onChange={e => setInputDeed(e.target.value)}
                placeholder="Describe their acts simply and honestly. e.g. Accompanied 8 blind citizens to register their security IDs."
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition text-xs"
            >
              Verify Deed on Ledger Node
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
