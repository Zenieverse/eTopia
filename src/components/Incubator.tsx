import React from 'react';
import { Startup, UserProfile } from '../types';
import {
  Rocket,
  Plus,
  Compass,
  LineChart,
  UserCheck,
  Star,
  Cpu,
  Bookmark,
} from 'lucide-react';

interface IncubatorProps {
  profile: UserProfile;
  startups: Startup[];
  onAddStartup: (startup: Startup) => void;
  onModifyStartup: (startupId: string, updater: Partial<Startup>) => void;
  triggerAIContext: (instructions: string, prompt: string) => Promise<string>;
}

export default function Incubator({
  profile,
  startups,
  onAddStartup,
  onModifyStartup,
  triggerAIContext,
}: IncubatorProps) {
  const [showPitchForm, setShowPitchForm] = React.useState(false);
  const [startupName, setStartupName] = React.useState('');
  const [startupOneLiner, setStartupOneLiner] = React.useState('');
  const [startupDesc, setStartupDesc] = React.useState('');
  const [startupSector, setStartupSector] = React.useState('CleanTech');
  const [startupGoal, setStartupGoal] = React.useState('');
  const [selectedStartupId, setSelectedStartupId] = React.useState<string | null>(null);
  
  // AI scoring states
  const [evaluatingId, setEvaluatingId] = React.useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  const selectedStartup = startups.find(s => s.id === selectedStartupId);

  const handleSubmitPitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupName || !startupOneLiner || !startupDesc || !startupGoal) return;

    const newStartup: Startup = {
      id: `sup-${Date.now()}`,
      name: startupName,
      oneLiner: startupOneLiner,
      description: startupDesc,
      founders: [profile.name],
      sector: startupSector,
      stage: 'idea',
      startupScore: 70, // Basic score until evaluated
      fundingGoal: parseFloat(startupGoal),
      raisedAmount: 0,
      pitchCompetitionParticipant: true,
      needsMentorship: true,
    };

    onAddStartup(newStartup);
    setSelectedStartupId(newStartup.id);
    setStartupName('');
    setStartupOneLiner('');
    setStartupDesc('');
    setStartupGoal('');
    setShowPitchForm(false);
    setNotification('Startup pitched successfully! Requesting automatic incubator screening.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEvaluateStartup = async (startup: Startup) => {
    setEvaluatingId(startup.id);
    setAiAnalysis(null);
    try {
      const prompt = `Perform an executive venture capitalist audit on the following startup pitch:
Name: ${startup.name}
Sector: ${startup.sector}
One-Liner: ${startup.oneLiner}
Description: ${startup.description}
Stage: ${startup.stage}
Goal: $${startup.fundingGoal}

Evaluate across: 1) Market Viability, 2) SDG Social Impact Alignment, 3) Technology scalability.
Give critical recommendations. Finish by outputting a final score from 0 to 100 in format "SCORE: [number]" (make sure this is exactly on a single line at the end, e.g. SCORE: 92).`;

      const response = await triggerAIContext('mentor', prompt);
      setAiAnalysis(response);

      // Extract SCORE: [number]
      const scoreMatch = response.match(/SCORE:\s*(\d+)/i);
      if (scoreMatch && scoreMatch[1]) {
        const foundScore = parseInt(scoreMatch[1]);
        onModifyStartup(startup.id, { startupScore: foundScore });
      } else {
        // Fallback default upgrade
        onModifyStartup(startup.id, { startupScore: Math.min(startup.startupScore + 8, 98) });
      }

      setNotification(`Incubator scoring finished! Startup Score updated.`);
    } catch (e) {
      setAiAnalysis('Venture screening failed. Ensure GEMINI_API_KEY is configured in backend secrets.');
    } finally {
      setEvaluatingId(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleFundSimulate = (startup: Startup) => {
    const increment = Math.round(startup.fundingGoal * 0.1);
    onModifyStartup(startup.id, {
      raisedAmount: Math.min(startup.raisedAmount + increment, startup.fundingGoal),
    });
    setNotification(`Mock Investment executed! Sourced $${increment.toLocaleString()} USD safely.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Rocket className="h-6 w-6 text-emerald-400" />
              <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
                Startup Incubator & Accelerator
              </h2>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Onboard your social enterprise, run AI-Powered pitch reviews, join mentorship pools, and match directly to global impact investors.
            </p>
          </div>
          <button
            onClick={() => setShowPitchForm(!showPitchForm)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            {showPitchForm ? 'Back to Incubator' : 'Submit My Venture Pitch'}
          </button>
        </div>

        {notification && (
          <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)}>✕</button>
          </div>
        )}
      </div>

      {showPitchForm ? (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl mx-auto">
          <h3 className="text-white text-base font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-400" /> Submit New Pitch Proposal
          </h3>
          <form onSubmit={handleSubmitPitch} className="space-y-4 mt-6 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">VENTURE LEGAL NAME</label>
              <input
                type="text"
                required
                placeholder="e.g. ScribeRx Health Translation"
                value={startupName}
                onChange={e => setStartupName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">SECTOR CLASSIFICATION</label>
                <select
                  value={startupSector}
                  onChange={e => setStartupSector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="CleanTech">CleanTech & Energy</option>
                  <option value="MedTech">MedTech / Healthcare</option>
                  <option value="EdTech">EdTech / Education</option>
                  <option value="CivicTech">CivicTech / Advocacy</option>
                  <option value="Circular Economy">Circular Economy</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ACCELERATOR FUNDING GOAL ($ USD)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 80000"
                  value={startupGoal}
                  onChange={e => setStartupGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">ONE LINER ELEVATOR DESCRIPTION</label>
              <input
                type="text"
                required
                placeholder="e.g. De-centralized battery grids matching regional energy abundance to island isolated homes."
                value={startupOneLiner}
                onChange={e => setStartupOneLiner(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">DETAILED PROBLEM RESOLUTION STATEMENT</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your founders, active technology stack, early prototypes, and exact target communities you empower."
                value={startupDesc}
                onChange={e => setStartupDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl transition text-sm"
            >
              Onboard Venture to Incubator Ledger
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pitch cards list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider font-mono text-slate-400">
              Active Accelerator Cohorts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {startups.map(startup => {
                const percentRaised = Math.round((startup.raisedAmount / startup.fundingGoal) * 100);
                const isSelected = selectedStartupId === startup.id;
                return (
                  <div
                    key={startup.id}
                    onClick={() => setSelectedStartupId(startup.id)}
                    className={`bg-slate-900 border p-5 rounded-2xl cursor-pointer transition flex flex-col justify-between ${
                      isSelected ? 'border-emerald-500 bg-slate-850/60' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-emerald-500/10 text-emerald-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                          {startup.sector}
                        </span>
                        
                        {/* Startup Score Badge */}
                        <div className="flex items-center space-x-1 bg-slate-950/40 px-2 py-1 rounded border border-slate-800 text-[10px]">
                          <Cpu className="h-3 w-3 text-emerald-400" />
                          <span className="font-semibold text-slate-200 font-mono">Index: {startup.startupScore}</span>
                        </div>
                      </div>

                      <h4 className="text-white font-bold text-sm mt-3">{startup.name}</h4>
                      <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
                        {startup.oneLiner}
                      </p>
                    </div>

                    <div className="mt-5 space-y-3.5">
                      {/* Funding Progress */}
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>Secured: ${startup.raisedAmount.toLocaleString()}</span>
                          <span>{percentRaised}% of ${startup.fundingGoal.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <span
                            className="bg-emerald-500 h-full rounded-full block transition-all"
                            style={{ width: `${percentRaised}%` }}
                          ></span>
                        </div>
                      </div>

                      {/* Mentorship Status indicators */}
                      <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-850">
                        <span>Founders: {startup.founders[0]}</span>
                        <span className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${startup.needsMentorship ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                          {startup.needsMentorship ? 'Needs Mentor' : 'Matched'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active startup details panel / AI Evaluator */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              {selectedStartup ? (
                <div className="space-y-5">
                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                    <h3 className="text-white text-base font-bold">{selectedStartup.name}</h3>
                    <button
                      onClick={() => setSelectedStartupId(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedStartup.description}
                  </p>

                  {/* Operational Controls for Orgs/Investors/Mentors */}
                  <div className="space-y-2 pt-3 border-t border-slate-850">
                    <button
                      onClick={() => handleEvaluateStartup(selectedStartup)}
                      disabled={evaluatingId === selectedStartup.id}
                      className="w-full bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold py-2.5 rounded-xl transition text-xs border border-emerald-500/20 flex items-center justify-center space-x-1.5 focus:outline-none"
                    >
                      <Cpu className="h-4 w-4" />
                      <span>{evaluatingId === selectedStartup.id ? 'Venture screening model running...' : 'Run Venture Screening Copilot'}</span>
                    </button>

                    <button
                      onClick={() => handleFundSimulate(selectedStartup)}
                      className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold py-2.5 rounded-xl transition text-xs border border-slate-800"
                    >
                      Invest 10% Match Funds
                    </button>
                  </div>

                  {/* AI Evaluation analysis Display Box */}
                  {aiAnalysis && (
                    <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl text-xs space-y-2 leading-relaxed text-slate-300 max-h-60 overflow-y-auto">
                      <p className="text-[10px] uppercase font-mono font-bold text-slate-500">VC Audit Report Output:</p>
                      <div className="whitespace-pre-line font-sans">{aiAnalysis}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-400 text-center py-12 text-xs flex flex-col items-center justify-center space-y-2 leading-relaxed">
                  <Compass className="h-10 w-10 text-slate-600 animate-spin" />
                  <p>Select any Startup card to run AI evaluations, request mentorship paths, or simulation fund matches.</p>
                </div>
              )}
            </div>

            {/* Quick Mentors summary */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <h4 className="text-white text-xs uppercase font-mono font-bold tracking-wider text-slate-400 border-b border-slate-800 pb-3">
                Incubator Mentor Directory
              </h4>
              <div className="space-y-3.5 mt-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">Dr. Sarah Jenkins</p>
                    <p className="text-[10px] text-slate-500">Edge NLP Modality Ethicist</p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 font-mono py-0.5 px-2 rounded-full text-[9px] font-semibold">Active</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">Marcus Vance</p>
                    <p className="text-[10px] text-slate-500">Founder SoliGrid, cleanTech VC</p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 font-mono py-0.5 px-2 rounded-full text-[9px] font-semibold">Active</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
