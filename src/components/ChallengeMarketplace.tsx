import React from 'react';
import { Challenge, UserProfile } from '../types';
import {
  Globe,
  Plus,
  Users,
  Target,
  Sparkles,
  Heart,
  TrendingUp,
} from 'lucide-react';

interface ChallengeMarketplaceProps {
  profile: UserProfile;
  challenges: Challenge[];
  onAddChallenge: (challenge: Challenge) => void;
  onModifyChallenge: (challengeId: string, updater: Partial<Challenge>) => void;
  onModifyProfile: (updater: Partial<UserProfile>) => void;
}

export default function ChallengeMarketplace({
  profile,
  challenges,
  onAddChallenge,
  onModifyChallenge,
  onModifyProfile,
}: ChallengeMarketplaceProps) {
  const [showForm, setShowForm] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [category, setCategory] = React.useState('Digital Inclusion');
  const [sdgNum, setSdgNum] = React.useState(9);
  const [fundingGoal, setFundingGoal] = React.useState('');
  const [volunteers, setVolunteers] = React.useState('');
  const [notification, setNotification] = React.useState<string | null>(null);

  const workflowStages: Challenge['status'][] = [
    'challenge',
    'community_formulating',
    'experts_evaluating',
    'volunteers_joining',
    'funding',
    'implementation',
    'impact_measured',
  ];

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !fundingGoal || !volunteers) return;

    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      title,
      description: desc,
      category,
      sdg: sdgNum,
      postedBy: profile.name,
      status: 'challenge',
      volunteersNeeded: parseInt(volunteers),
      volunteersJoined: 0,
      fundingGoal: parseFloat(fundingGoal),
      fundingRaised: 0,
      impactMetrics: 'Baseline audits pending formulation.',
    };

    onAddChallenge(newChallenge);
    setTitle('');
    setDesc('');
    setFundingGoal('');
    setVolunteers('');
    setShowForm(false);
    setNotification('Global Challenge listed! Awaiting community formulating and expert vetting.');

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleVolunteerSimulate = (challenge: Challenge) => {
    const isJoined = (challenge.volunteersJoined >= challenge.volunteersNeeded);
    if (isJoined) {
      setNotification('Volunteer pool for this milestone is already fully staffed!');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    onModifyChallenge(challenge.id, {
      volunteersJoined: challenge.volunteersJoined + 1,
      status: challenge.volunteersJoined + 1 >= challenge.volunteersNeeded ? 'funding' : challenge.status,
    });

    onModifyProfile({
      impactScore: profile.impactScore + 20,
      reputationPoints: profile.reputationPoints + 60,
    });

    setNotification('Successfully registered as a skilled volunteer! Impact index updated +20.');
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleFundSimulate = (challenge: Challenge) => {
    const amount = 500;
    const raised = Math.min(challenge.fundingRaised + amount, challenge.fundingGoal);
    const newStatus = (raised >= challenge.fundingGoal && challenge.status === 'funding')
      ? 'implementation'
      : challenge.status;

    onModifyChallenge(challenge.id, {
      fundingRaised: raised,
      status: newStatus as Challenge['status'],
    });

    onModifyProfile({
      impactScore: profile.impactScore + 30,
      reputationPoints: profile.reputationPoints + 150,
    });

    setNotification(`Successfully contributed $${amount} micro-funding! Awarded +150 XP.`);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleStatusAdvance = (challenge: Challenge) => {
    const currentIndex = workflowStages.indexOf(challenge.status);
    if (currentIndex >= 0 && currentIndex < workflowStages.length - 1) {
      const nextStatus = workflowStages[currentIndex + 1];
      onModifyChallenge(challenge.id, { status: nextStatus });
      setNotification(`Challenge status advanced to: ${nextStatus.replace('_', ' ')}`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro info box */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-indigo-400" />
            <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
              Global Challenge Marketplace & SDG Registry
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Browse public challenges, track expert vetting, register for skilled micro-labor, back initiatives financially, and record measured social outputs back into the ledger.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="glass-button-primary text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          {showForm ? 'Back to Challenges' : 'Post Community Challenge'}
        </button>
      </div>

      {notification && (
        <div className="bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 p-3.5 rounded-xl text-xs font-mono font-semibold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="cursor-pointer hover:text-white ml-2">✕</button>
        </div>
      )}

      {showForm ? (
        <div className="glass-card p-6 rounded-2xl max-w-xl mx-auto border border-white/5">
          <h3 className="text-white text-base font-bold border-b border-white/5 pb-3 flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-400" /> Create Global Challenge Card
          </h3>
          <form onSubmit={handleCreateChallenge} className="space-y-4 mt-6 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">Challenge Title / Target Issue</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Clean Portable Rainwater Harvesters in District 4"
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">Challenge Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Digital Inclusion" className="bg-[#0c0f16] text-white">Digital Inclusion</option>
                  <option value="Climate Change" className="bg-[#0c0f16] text-white">Climate Change & Heat</option>
                  <option value="Poverty Mitigation" className="bg-[#0c0f16] text-white">Poverty Mitigation</option>
                  <option value="Health Navigation" className="bg-[#0c0f16] text-white">Health Navigation</option>
                  <option value="Quality Education" className="bg-[#0c0f16] text-white">Quality Education</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">Primary Concern UN SDG</label>
                <select
                  value={sdgNum}
                  onChange={e => setSdgNum(parseInt(e.target.value))}
                  className="w-full glass-input rounded-xl p-2.5 text-white focus:outline-none font-mono"
                >
                  <option value="1" className="bg-[#0c0f16] text-white">SDG 1: No Poverty</option>
                  <option value="3" className="bg-[#0c0f16] text-white">SDG 3: Good Health</option>
                  <option value="4" className="bg-[#0c0f16] text-white">SDG 4: Quality Education</option>
                  <option value="9" className="bg-[#0c0f16] text-white">SDG 9: Industry & Innovation</option>
                  <option value="13" className="bg-[#0c0f16] text-white">SDG 13: Climate Action</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">Funding Capacity Required ($ USD)</label>
                <input
                  type="number"
                  required
                  value={fundingGoal}
                  onChange={e => setFundingGoal(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full glass-input rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">Volunteers Needed Deeds Pool</label>
                <input
                  type="number"
                  required
                  value={volunteers}
                  onChange={e => setVolunteers(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full glass-input rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">Detailed Analysis & Baseline Description</label>
              <textarea
                required
                rows={4}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Give exact parameters of what is needed. Detail how the workflow is resolved and which metrics determine success."
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full glass-button-primary font-bold py-3.5 rounded-xl transition text-xs cursor-pointer"
            >
              Post Challenge to Global Registry node
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map(chan => {
              const fundingPercent = Math.round((chan.fundingRaised / chan.fundingGoal) * 100);
              const isVolMatched = chan.volunteersJoined >= chan.volunteersNeeded;
              const isFundingMatched = chan.fundingRaised >= chan.fundingGoal;

              return (
                <div key={chan.id} className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between space-y-5">
                  <div>
                    {/* Upper heading badges */}
                    <div className="flex justify-between items-center whitespace-nowrap">
                      <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-400/20 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        SDG {chan.sdg} Target
                      </span>
                      <span className="text-slate-405 font-mono text-[10px]">
                        By: <span className="text-white font-semibold">{chan.postedBy}</span>
                      </span>
                    </div>

                    <h3 className="text-white text-base font-bold mt-3 hover:text-indigo-400 transition cursor-pointer">
                      {chan.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      {chan.description}
                    </p>
                  </div>

                  {/* Workflow state progress indicators - Module 5 */}
                  <div className="glass-card-nested border-white/5 p-4 rounded-xl space-y-2">
                    <p className="text-[10px] font-mono font-bold text-slate-550 uppercase tracking-widest">Active Civic Workflow Pipeline</p>
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[9px] font-mono font-semibold uppercase whitespace-nowrap">
                      {workflowStages.map((st, idx) => {
                        const isPast = workflowStages.indexOf(chan.status) >= idx;
                        const isCurrent = chan.status === st;
                        return (
                          <div key={st} className="flex items-center gap-1">
                            {idx > 0 && <span className="text-slate-700">→</span>}
                            <span className={`px-1.5 py-0.5 rounded transition ${
                              isCurrent 
                                ? 'bg-indigo-500 text-white font-bold shadow-[0_0_8px_#818cf8]' 
                                : isPast 
                                  ? 'bg-white/5 border border-white/5 text-slate-300' 
                                  : 'text-slate-600'
                            }`}>
                              {st === 'volunteers_joining' ? 'Volunteers' : st === 'community_formulating' ? 'Community' : st === 'experts_evaluating' ? 'Experts' : st === 'impact_measured' ? 'Impact Done' : st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Funding & Volunteer details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card-nested border-white/5 p-3 rounded-xl flex items-center space-x-3">
                      <Users className="h-5 w-5 text-indigo-400" />
                      <div>
                        <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 leading-none">Volunteers</p>
                        <p className="font-mono text-white text-xs mt-1.5 font-bold">{chan.volunteersJoined} / {chan.volunteersNeeded} Vetted</p>
                      </div>
                    </div>

                    <div className="glass-card-nested border-white/5 p-3 rounded-xl flex items-center space-x-3">
                      <Target className="h-5 w-5 text-indigo-450" />
                      <div>
                        <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 leading-none">Micro backing</p>
                        <p className="font-mono text-white text-xs mt-1.5 font-bold">{fundingPercent}% Sourced</p>
                      </div>
                    </div>
                  </div>

                  {/* Action triggers */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                    <span className="text-xs text-slate-400 font-mono">Status: <span className="text-white font-extrabold uppercase">{chan.status.replace('_', ' ')}</span></span>

                    <div className="flex items-center space-x-2">
                      {/* Only admins can advance stages directly */}
                      {(profile.role === 'super_admin' || profile.role === 'community_admin') && (
                        <button
                          onClick={() => handleStatusAdvance(chan)}
                          className="glass-button-secondary px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase cursor-pointer"
                        >
                          Step →
                        </button>
                      )}
                      
                      {!isVolMatched && (
                        <button
                          onClick={() => handleVolunteerSimulate(chan)}
                          className="glass-button-primary text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Heart className="h-3 w-3 fill-indigo-100/20" />
                          <span>Volunteer</span>
                        </button>
                      )}

                      {!isFundingMatched && (
                        <button
                          onClick={() => handleFundSimulate(chan)}
                          className="glass-button-secondary text-indigo-300 font-bold px-3.5 py-1.5 rounded-lg text-xs cursor-pointer"
                        >
                          Send $500
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
