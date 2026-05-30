import React from 'react';
import { UserProfile, Challenge, ComActProject } from '../types';
import {
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Heart,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface HubDashboardProps {
  profile: UserProfile;
  challenges: Challenge[];
  projects: ComActProject[];
  setActiveTab: (tab: string) => void;
  triggerAIContext: (instructions: string, prompt: string) => Promise<string>;
}

export default function HubDashboard({
  profile,
  challenges,
  projects,
  setActiveTab,
  triggerAIContext,
}: HubDashboardProps) {
  const [aiInsights, setAiInsights] = React.useState<string>(
    'Welcome back! Based on your expertise in TypeScript and Climate Advocacy, the eTopia Copilot suggests joining the "Eradicating Urban Digital Deserts" volunteer pool or reviewing current Startup drafts in the incubator.'
  );
  const [loadingInsights, setLoadingInsights] = React.useState(false);

  // Filter items in active involvement
  const myProjects = projects.filter(p => p.joinedTeamMembers.includes(profile.name));
  const activeChallengesCount = challenges.filter(c => c.status === 'volunteers_joining').length;

  const fetchAIInsights = async () => {
    setLoadingInsights(true);
    try {
      const prompt = `User profile has skills: ${profile.skills.join(', ')}. Bio: ${profile.bio}. Impact score: ${profile.impactScore}.
Generate a paragraph of personalized daily recommendations and encouraging social impact tips tailored to who they are. Do not greet, just output 3-4 professional recommendations.`;
      const response = await triggerAIContext('opportunity', prompt);
      setAiInsights(response);
    } catch (e) {
      setAiInsights('Error fetching custom AI Insights. Please check your GEMINI_API_KEY.');
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">
            Greetings, {profile.name}!
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            "We do not inherit the earth from our ancestors, we borrow it from our children." Welcome to your Digital Civilization.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-400/25 px-3 py-1.5 rounded-xl animate-pulse">
          <Zap className="h-4 w-4 text-indigo-400 fill-indigo-400" />
          <span className="text-indigo-300 font-mono text-xs font-bold">12 Consecutive Streaks</span>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase font-mono">My Impact Rank</span>
            <span className="bg-indigo-500/15 text-indigo-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">TOP 5%</span>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">{profile.impactScore}</span>
            <span className="text-xs text-slate-500">units</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-indigo-400" />
            <span>Increased +12% this cycle</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase font-mono">Reputation Points</span>
            <Award className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">{profile.reputationPoints}</span>
            <span className="text-xs text-slate-500">XP</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>Next rank: <span className="text-amber-400 font-semibold text-amber-300">Civic Knight</span> (1,500 XP)</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase font-mono">Active Projects</span>
            <Clock className="h-4.5 w-4.5 text-sky-400" />
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">{myProjects.length}</span>
            <span className="text-xs text-slate-500">teams joined</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span className="truncate block max-w-full">
              {myProjects.map(p => p.title.substring(0, 16) + '...').join(', ') || 'No active teams'}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase font-mono">My Global Alliance</span>
            <Heart className="h-4.5 w-4.5 text-pink-500" />
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">{activeChallengesCount}</span>
            <span className="text-xs text-slate-500">missions open</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>UN SDG Aligned</span>
            <span className="bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">4 Goals</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout splits Daily Insight & SDG Alignment / Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Insights - Modules 2 & 7 */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-semibold text-white tracking-tight">AI Copilot Daily Insights</span>
              </div>
              <button
                onClick={fetchAIInsights}
                disabled={loadingInsights}
                className="text-slate-350 hover:text-indigo-400 flex items-center space-x-1 text-xs focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${loadingInsights ? 'animate-spin text-indigo-400' : ''}`} />
                <span>{loadingInsights ? 'AI Orchestrating...' : 'Regenerate'}</span>
              </button>
            </div>

            <div className="mt-4 text-xs md:text-sm text-slate-300 leading-relaxed font-sans glass-card-nested p-4 rounded-xl border border-white/5">
              {aiInsights}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
            <span>Powered by eTopia Multi-Agent Layer</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#818cf8]"></span> Online
            </span>
          </div>
        </div>

        {/* SDG / Goals tracker & Actions */}
        <div className="space-y-6">
          
          {/* SDG Alignment card */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-indigo-300 text-sm font-semibold border-b border-white/5 pb-3 uppercase tracking-wider font-mono">
              SDG Impact Map
            </h3>
            
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>SDG 9: Industry & Innovation</span>
                  <span className="text-indigo-300 font-bold font-mono">45%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>SDG 13: Climate Action</span>
                  <span className="text-sky-300 font-bold font-mono">35%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>SDG 4: Quality Education</span>
                  <span className="text-amber-300 font-bold font-mono">20%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('impact')}
              className="w-full mt-5 text-center glass-button-secondary text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>View Full SDG Audit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Action steps */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-indigo-300 text-sm font-semibold border-b border-white/5 pb-3 uppercase tracking-wider">
          Recommended Civil Actions
        </h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="glass-card-nested p-4.5 rounded-xl border border-white/5 relative hover:border-indigo-500/20 hover:scale-[1.01] transition-all group">
            <CheckCircle2 className="h-5 w-5 text-indigo-400 absolute top-4 right-4" />
            <h4 className="text-white text-sm font-bold group-hover:text-indigo-400 transition">Complete Climate Literacy</h4>
            <p className="text-slate-450 text-xs mt-1 leading-relaxed">
              Earn your "Green Citizen" epic badge by completing Chapter 4 of Circular Economics.
            </p>
            <button
              onClick={() => setActiveTab('academy')}
              className="mt-3 text-xs text-slate-300 hover:text-indigo-300 font-semibold flex items-center space-x-1 focus:outline-none cursor-pointer"
            >
              <span>Go to Academy</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="glass-card-nested p-4.5 rounded-xl border border-white/5 relative hover:border-indigo-500/20 hover:scale-[1.01] transition-all group">
            <CheckCircle2 className="h-5 w-5 text-slate-700 absolute top-4 right-4" />
            <h4 className="text-white text-sm font-bold group-hover:text-indigo-400 transition">Vote on ScribeRx Resourcing</h4>
            <p className="text-slate-450 text-xs mt-1 leading-relaxed">
              Help determine whether 30% of local resources is allocated to regional transcription models.
            </p>
            <button
              onClick={() => setActiveTab('governance')}
              className="mt-3 text-xs text-slate-350 hover:text-indigo-300 font-semibold flex items-center space-x-1 focus:outline-none cursor-pointer"
            >
              <span>Cast Proposal Vote</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="glass-card-nested p-4.5 rounded-xl border border-white/5 relative hover:border-indigo-500/20 hover:scale-[1.01] transition-all group">
            <CheckCircle2 className="h-5 w-5 text-slate-700 absolute top-4 right-4" />
            <h4 className="text-white text-sm font-bold group-hover:text-indigo-400 transition">Register as Mentor / Freelancer</h4>
            <p className="text-slate-450 text-xs mt-1 leading-relaxed">
              Activate your Freelancer Profile to unlock paid outsourcing contracts in ComAct.
            </p>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="mt-3 text-xs text-slate-350 hover:text-indigo-300 font-semibold flex items-center space-x-1 focus:outline-none cursor-pointer"
            >
              <span>Profile Setup</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
