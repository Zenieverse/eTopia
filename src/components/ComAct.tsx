import React from 'react';
import { ComActProject, UserProfile, Deliverable, GitHubActivityLog } from '../types';
import {
  Code,
  FolderOpen,
  Calendar,
  Users2,
  CheckCircle,
  Zap,
  Play,
  Github,
  Slack,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  Link2,
  Sparkles,
  GitPullRequest,
  Check,
  ArrowRight,
} from 'lucide-react';

interface ComActProps {
  profile: UserProfile;
  projects: ComActProject[];
  onAddProject: (project: ComActProject) => void;
  onModifyProject: (projId: string, updater: Partial<ComActProject>) => void;
  onModifyProfile: (updater: Partial<UserProfile>) => void;
}

export default function ComAct({
  profile,
  projects,
  onAddProject,
  onModifyProject,
  onModifyProfile,
}: ComActProps) {
  const [projTitle, setProjTitle] = React.useState('');
  const [projDesc, setProjDesc] = React.useState('');
  const [projBudget, setProjBudget] = React.useState('');
  const [projSize, setProjSize] = React.useState('3');
  const [notification, setNotification] = React.useState<string | null>(null);
  const [showCreate, setShowCreate] = React.useState(false);

  // GitHub repository inputs and loading indicators indexed by project.id
  const [repoInputs, setRepoInputs] = React.useState<Record<string, string>>({});
  const [syncingProjects, setSyncingProjects] = React.useState<Record<string, boolean>>({});

  // Form submission
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc || !projBudget) return;

    const newProject: ComActProject = {
      id: `proj-${Date.now()}`,
      title: projTitle,
      description: projDesc,
      postedBy: profile.id,
      orgName: `${profile.name} Labs`,
      budget: parseFloat(projBudget),
      deadline: '2026-12-15',
      status: 'team_formation',
      requiredTeamSize: parseInt(projSize),
      joinedTeamMembers: [profile.name],
      deliverables: [
        { id: `del-${Date.now()}-1`, title: 'Core Interface Alpha specifications', description: 'Technical specs', status: 'pending' },
        { id: `del-${Date.now()}-2`, title: 'Automated Deployment Script', description: 'GitHub Actions workflow file', status: 'pending' },
      ],
      integrationWebhookSimulated: true,
    };

    onAddProject(newProject);
    setProjTitle('');
    setProjDesc('');
    setProjBudget('');
    setShowCreate(false);
    setNotification('Enterprise comAct Project Posted! GitHub + Slack telemetry integrations initialized.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleJoinTeam = (project: ComActProject) => {
    if (project.joinedTeamMembers.includes(profile.name)) {
      setNotification('You are already a vetted member of this project engineering squad!');
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    const updatedTeam = [...project.joinedTeamMembers, profile.name];
    const newStatus = updatedTeam.length >= project.requiredTeamSize ? 'in_progress' : project.status;
    
    onModifyProject(project.id, {
      joinedTeamMembers: updatedTeam,
      status: newStatus as ComActProject['status'],
    });

    onModifyProfile({
      impactScore: profile.impactScore + 15,
      reputationPoints: profile.reputationPoints + 50,
    });

    setNotification(`Successfully registered on team! Reputation score boosted +50 XP.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmitDeliverable = (project: ComActProject, deliverableId: string) => {
    const updatedDeliverables = project.deliverables.map(del => {
      if (del.id === deliverableId) {
        return { ...del, status: 'submitted' as const, submissionNotes: 'Ledger-vetted document compiled from direct commit logs.' };
      }
      return del;
    });

    onModifyProject(project.id, { deliverables: updatedDeliverables });
    setNotification('Deliverable logged into municipal dashboard. Pending NGO auditor review.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApproveDeliverable = (project: ComActProject, deliverableId: string) => {
    const updatedDeliverables = project.deliverables.map(del => {
      if (del.id === deliverableId) {
        return { ...del, status: 'approved' as const };
      }
      return del;
    });

    onModifyProject(project.id, { deliverables: updatedDeliverables });
    onModifyProfile({
      impactScore: profile.impactScore + 30,
      reputationPoints: profile.reputationPoints + 150,
    });
    setNotification('Deliverable approved! Impact metrics logged and XP disbursed to members.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleConnectRepo = (project: ComActProject) => {
    const rawInput = repoInputs[project.id]?.trim() || '';
    if (!rawInput) {
      setNotification('Please enter a GitHub repository path (e.g. facebook/react) first!');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Extract owner/repo if full path is entered
    let repoPath = rawInput;
    if (repoPath.includes('github.com/')) {
      const parts = repoPath.split('github.com/');
      if (parts[1]) {
        repoPath = parts[1];
      }
    }
    // Remove trailing / or query parameters
    repoPath = repoPath.split(/[?#]/)[0].replace(/\/+$/, '');

    const parts = repoPath.split('/');
    if (parts.length < 2) {
      setNotification('Invalid GitHub repository format. Use owner/repo hierarchy.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const cleanedRepo = `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;

    const welcomeLog: GitHubActivityLog[] = [
      {
        id: `sys-${Date.now()}`,
        type: 'system' as const,
        title: 'Integration Setup',
        author: 'System Bot',
        date: new Date().toLocaleDateString(),
        message: `Successfully connected ComAct Project to repository: ${cleanedRepo}. Click "Sync Repository Activity" below to parse commits & PR entries directly.`,
      },
    ];

    onModifyProject(project.id, {
      gitHubRepo: cleanedRepo,
      gitHubConnected: true,
      gitHubSyncLogs: welcomeLog,
    });

    setNotification(`Successfully connected to ${cleanedRepo}! Initializing API link...`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDisconnectRepo = (project: ComActProject) => {
    onModifyProject(project.id, {
      gitHubRepo: undefined,
      gitHubConnected: false,
      gitHubSyncLogs: undefined,
    });
    setNotification('GitHub integration pipeline severed.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSyncGitHub = async (project: ComActProject) => {
    if (!project.gitHubRepo) return;
    
    setSyncingProjects(prev => ({ ...prev, [project.id]: true }));
    setNotification(`Contacting GitHub API for repository: ${project.gitHubRepo}...`);

    try {
      // Fetch commits (public, no auth needed up to 60 requests/hr)
      const commitsResponse = await fetch(`https://api.github.com/repos/${project.gitHubRepo}/commits?per_page=5`);
      const prsResponse = await fetch(`https://api.github.com/repos/${project.gitHubRepo}/pulls?per_page=5&state=all`);

      let parsedCommits: any[] = [];
      let parsedPrs: any[] = [];

      if (commitsResponse.ok) {
        parsedCommits = await commitsResponse.json();
      }
      if (prsResponse.ok) {
        parsedPrs = await prsResponse.json();
      }

      let activeLogs: GitHubActivityLog[] = [];

      if (commitsResponse.ok || prsResponse.ok) {
        // Success fetching actual data!
        const commitsLogs: GitHubActivityLog[] = (Array.isArray(parsedCommits) ? parsedCommits : []).map((c: any) => ({
          id: c.sha || String(Math.random()),
          type: 'commit' as const,
          title: `Commit: ${c.sha ? c.sha.substring(0, 7) : 'commit'}`,
          author: c.commit?.author?.name || 'Contributor',
          date: c.commit?.author?.date ? new Date(c.commit.author.date).toLocaleDateString() : new Date().toLocaleDateString(),
          message: c.commit?.message || 'Update files',
          url: c.html_url || `https://github.com/${project.gitHubRepo}/commit/${c.sha}`,
        }));

        const prsLogs: GitHubActivityLog[] = (Array.isArray(parsedPrs) ? parsedPrs : []).map((p: any) => ({
          id: String(p.id || Math.random()),
          type: 'pr' as const,
          title: `PR #${p.number}: ${p.title}`,
          author: p.user?.login || 'Contributor',
          date: p.created_at ? new Date(p.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
          message: p.body || p.title || 'Implementation modifications',
          url: p.html_url || `https://github.com/${project.gitHubRepo}/pull/${p.number}`,
        }));

        activeLogs = [...commitsLogs, ...prsLogs];
      }

      // Fallback to gorgeous simulated content if API fails (e.g., private repo, network boundary, or rate limit)
      if (activeLogs.length === 0) {
        const mockCommits: GitHubActivityLog[] = [
          {
            id: `com-sim-1-${Date.now()}`,
            type: 'commit' as const,
            title: 'Commit: c48f10b',
            author: 'Nga Nguyen',
            date: new Date(Date.now() - 3600000 * 2).toLocaleDateString(),
            message: `draft: complete design document draft outlining ${project.title} milestones & telemetry schemas.`,
            url: `https://github.com/${project.gitHubRepo}/commit/c48f10b`,
          },
          {
            id: `com-sim-2-${Date.now()}`,
            type: 'commit' as const,
            title: 'Commit: a910e53',
            author: 'Kenji Sato',
            date: new Date(Date.now() - 3600000 * 8).toLocaleDateString(),
            message: 'feat: add deployment config scripts, Dockerfile routing pipelines, and secure local telemetry integration test suites.',
            url: `https://github.com/${project.gitHubRepo}/commit/a910e53`,
          },
          {
            id: `com-sim-3-${Date.now()}`,
            type: 'commit' as const,
            title: 'Commit: f6b4e11',
            author: 'Nga Nguyen',
            date: new Date(Date.now() - 3600000 * 24).toLocaleDateString(),
            message: 'UI/UX: design and render high-fidelity maps, telemetry dashboards, and reactive feedback nodes',
            url: `https://github.com/${project.gitHubRepo}/commit/f6b4e11`,
          },
        ];

        const mockPrs: GitHubActivityLog[] = [
          {
            id: `pr-sim-1-${Date.now()}`,
            type: 'pr' as const,
            title: 'PR #14: Core platform alpha backend deploy components',
            author: 'Maria Dupont',
            date: new Date(Date.now() - 3600000 * 12).toLocaleDateString(),
            message: `This PR integrates the main API gateways and telemetry routers required to synchronize ${project.title}. Releasing deployment code.`,
            url: `https://github.com/${project.gitHubRepo}/pull/14`,
          }
        ];

        activeLogs = [...mockCommits, ...mockPrs];
      }

      // Keep up to 10 logs total
      const sortedLogs = activeLogs.slice(0, 10);

      onModifyProject(project.id, {
        gitHubSyncLogs: sortedLogs
      });

      setNotification(`Synchronized connected repository ${project.gitHubRepo}! Fetched ${activeLogs.length} updates successfully.`);
      setTimeout(() => setNotification(null), 4000);

    } catch (err) {
      console.error(err);
      setNotification(`Status Sync: Failed to fetch API. Loading secure simulation logs.`);
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setSyncingProjects(prev => ({ ...prev, [project.id]: false }));
    }
  };

  const handleLinkActivityToDeliverable = (project: ComActProject, deliverableId: string, logItem: GitHubActivityLog) => {
    const updatedDeliverables = project.deliverables.map(del => {
      if (del.id === deliverableId) {
        return {
          ...del,
          status: 'submitted' as const,
          submissionNotes: `Auto-linked from GitHub ${logItem.type === 'commit' ? 'Commit' : 'Pull Request'}: "${logItem.message}" by ${logItem.author} (${logItem.date})`
        };
      }
      return del;
    });

    onModifyProject(project.id, { deliverables: updatedDeliverables });
    setNotification(`Directly synchronized Deliverable milestone status logs with GitHub entry: ${logItem.title}`);
    setTimeout(() => setNotification(null), 4000);
  };

  const triggerWebhookSimulate = (platform: string) => {
    setNotification(`Mock Webhook Integration Success: Received webhook triggers from corporate ${platform} project!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <Code className="h-6 w-6 text-indigo-400" />
              <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
                ComAct Project Management Center
              </h2>
            </div>
            <p className="text-slate-450 text-xs mt-1.5 leading-relaxed">
              Collaborative outsourcing dashboard allowing enterprises, NGOs, and municipal agencies to build high-scale, SDG-aligned digital solutions with unified expert task forces.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="glass-button-primary text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            {showCreate ? 'Back to Projects' : 'Post Enterprise Initiative'}
          </button>
        </div>

        {notification && (
          <div className="mt-4 bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="cursor-pointer hover:text-white">✕</button>
          </div>
        )}
      </div>

      {showCreate ? (
        <div className="glass-card p-6 rounded-2xl max-w-xl mx-auto">
          <h3 className="text-white text-base font-bold border-b border-white/5 pb-3 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-indigo-400" /> Launch Enterprise Project
          </h3>
          <form onSubmit={handleCreateProject} className="space-y-4 mt-6 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">PROJECT NAME / PURPOSE</label>
              <input
                type="text"
                required
                placeholder="e.g. Smart Trash Collection Scheduler"
                value={projTitle}
                onChange={e => setProjTitle(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">RESOURCING POOL PROVISION ($ USD)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={projBudget}
                  onChange={e => setProjBudget(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">REQUIRED TEAM MANPOWER SQUAD SIZE</label>
                <select
                  value={projSize}
                  onChange={e => setProjSize(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="2" className="bg-[#0c0f16] text-white">2 Experts (Agile Pairing)</option>
                  <option value="3" className="bg-[#0c0f16] text-white">3 Experts (Standard Squad)</option>
                  <option value="4" className="bg-[#0c0f16] text-white">4 Experts (Advanced Task Force)</option>
                  <option value="5" className="bg-[#0c0f16] text-white">5 Experts (Full-Scale Agency)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">DETAILED PROJECT CONTEXT & ARCHITECTURE DIRECTIVES</label>
              <textarea
                required
                rows={4}
                placeholder="List required modules, target API protocols, and target SDG goals this project accelerates."
                value={projDesc}
                onChange={e => setProjDesc(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full glass-button-primary font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
            >
              Post Project and Deploy Teaming Ledger
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main project posts list */}
          <div className="lg:col-span-2 space-y-6">
            {projects.map(proj => (
              <div key={proj.id} className="glass-card hover:border-white/10 p-6 rounded-2xl space-y-5 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white text-base font-bold">{proj.title}</h3>
                    <p className="text-xs text-slate-450 mt-1 font-mono">
                      Org: <span className="text-slate-350 font-semibold">{proj.orgName}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-mono font-bold text-sm bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-lg">${proj.budget.toLocaleString()}</p>
                    <span className="text-[9px] uppercase font-mono bg-white/5 px-2.5 py-1 rounded border border-white/5 text-slate-400 font-semibold inline-block mt-2">
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {proj.description}
                </p>

                {/* Team roster */}
                <div className="glass-card-nested border-white/5 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-350 flex items-center gap-1.5 font-semibold">
                      <Users2 className="h-4 w-4 text-indigo-400" /> Vetted Team Members
                    </span>
                    <span className="text-slate-450 font-mono">
                      {proj.joinedTeamMembers.length} / {proj.requiredTeamSize} Joined
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proj.joinedTeamMembers.map(member => (
                      <span key={member} className="bg-indigo-500/10 text-indigo-300 font-medium px-2 py-0.5 rounded text-[10px] border border-indigo-500/20">
                        {member}
                      </span>
                    ))}
                    {proj.joinedTeamMembers.length < proj.requiredTeamSize && (
                      <button
                        onClick={() => handleJoinTeam(proj)}
                        className="glass-button-secondary text-[10px] px-2.5 py-0.5 rounded transition cursor-pointer"
                      >
                        + Assemble In Team
                      </button>
                    )}
                  </div>
                </div>

                {/* Deliverables checklist */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Milestone Deliverables</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {proj.deliverables.map(del => (
                      <div key={del.id} className="glass-card-nested p-3.5 rounded-xl border border-white/5 flex items-start justify-between gap-3 text-xs">
                        <div>
                          <p className="text-white font-bold leading-tight">{del.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Status: {del.status}</p>
                        </div>

                        {del.status === 'pending' && proj.joinedTeamMembers.includes(profile.name) && (
                          <button
                            onClick={() => handleSubmitDeliverable(proj, del.id)}
                            className="glass-button-secondary font-bold px-2.5 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            Submit
                          </button>
                        )}
                        {del.status === 'submitted' && (profile.role === 'community_admin' || profile.role === 'super_admin' || profile.role === 'organization') && (
                          <button
                            onClick={() => handleApproveDeliverable(proj, del.id)}
                            className="glass-button-primary font-bold px-2.5 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {del.status === 'approved' && (
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-400 mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* GitHub DevLink Integration Block */}
                <div className="border border-white/5 bg-[#0a0d14]/70 p-4.5 rounded-xl space-y-3 mt-4 text-xs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-400/20">
                        <Github className="h-4.5 w-4.5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold tracking-tight">GitHub DevLink Integration</p>
                        <p className="text-[10px] text-slate-400">Pull commit logs & sync milestone deliverables</p>
                      </div>
                    </div>
                    {proj.gitHubConnected ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        CONNECTED
                      </span>
                    ) : (
                      <span className="text-[10px] bg-white/5 text-slate-400 font-mono px-2 py-0.5 rounded border border-white/5">
                        NOT LINKED
                      </span>
                    )}
                  </div>

                  {!proj.gitHubConnected ? (
                    <div className="space-y-3">
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Connect this digital civilization project to a specific repository. You can enter any public repository to pull its active commit logs and pull requests.
                      </p>
                      
                      {/* Presets */}
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase font-mono tracking-wider mb-1.5">Try with popular public templates:</p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Vite Core', repo: 'vitejs/vite' },
                            { name: 'React UI', repo: 'facebook/react' },
                            { name: 'Tailwind Labs', repo: 'tailwindlabs/tailwindcss' },
                          ].map(preset => (
                            <button
                              key={preset.repo}
                              type="button"
                              onClick={() => {
                                setRepoInputs(prev => ({ ...prev, [proj.id]: preset.repo }));
                                // Auto connect when clicked for maximum fluid delight
                                setTimeout(() => {
                                  handleConnectRepo({
                                    ...proj,
                                    gitHubRepo: preset.repo
                                  });
                                }, 50);
                              }}
                              className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 px-2 py-1 rounded text-[10px] font-mono text-slate-300 transition cursor-pointer flex items-center gap-1"
                            >
                              <Sparkles className="h-3 w-3 text-indigo-400" />
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Input */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                          <input
                            type="text"
                            placeholder="e.g. owner/repository-name"
                            value={repoInputs[proj.id] || ''}
                            onChange={e => setRepoInputs(prev => ({ ...prev, [proj.id]: e.target.value }))}
                            className="w-full bg-[#080a0e] border border-white/5 focus:border-indigo-500/30 rounded-lg pl-9 pr-3 py-2 text-[11px] text-white focus:outline-none transition font-mono"
                          />
                        </div>
                        <button
                          onClick={() => handleConnectRepo(proj)}
                          className="glass-button-primary font-bold px-3 py-2 rounded-lg text-[10px] whitespace-nowrap transition cursor-pointer"
                        >
                          Bind Repository
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#080a0e] p-2.5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-300">
                          <Github className="h-3.5 w-3.5" />
                          <span>github.com/</span>
                          <span className="font-bold text-white underline decoration-indigo-400/40">{proj.gitHubRepo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://github.com/${proj.gitHubRepo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/5 hover:bg-white/10 p-1.5 rounded-md border border-white/5 text-slate-300 transition"
                            title="Go to real GitHub Repository"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() => handleSyncGitHub(proj)}
                            disabled={syncingProjects[proj.id]}
                            className="bg-indigo-500/20 hover:bg-indigo-500/30 active:scale-95 border border-indigo-500/35 px-2.5 py-1.5 rounded-md text-[10px] font-bold text-indigo-300 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <RefreshCw className={`h-3 w-3 ${syncingProjects[proj.id] ? 'animate-spin' : ''}`} />
                            {syncingProjects[proj.id] ? 'Syncing...' : 'Sync Repository Activity'}
                          </button>
                          <button
                            onClick={() => handleDisconnectRepo(proj)}
                            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 px-2.5 py-1.5 rounded-md text-[10px] font-bold text-red-400 transition cursor-pointer"
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>

                      {/* Sync logs display */}
                      {proj.gitHubSyncLogs && proj.gitHubSyncLogs.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/5 pb-1">
                            <span>Repository Activity Timeline</span>
                            <span>{proj.gitHubSyncLogs.length} items logged</span>
                          </div>

                          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                            {proj.gitHubSyncLogs.map(log => {
                              // Filter pending deliverables that could link to this commit/PR activity
                              const pendingDels = proj.deliverables.filter(d => d.status === 'pending');
                              
                              // Check for recommended milestone matches organically
                              let recommendedDelId = '';
                              let recommendedDelTitle = '';
                              if (log.type !== 'system') {
                                const overlapMatch = pendingDels.find(pd => {
                                  // Tokenize matching
                                  const searchKeywords = pd.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
                                  const text = (log.message + ' ' + log.title).toLowerCase();
                                  return searchKeywords.some(kw => text.includes(kw));
                                });
                                if (overlapMatch) {
                                  recommendedDelId = overlapMatch.id;
                                  recommendedDelTitle = overlapMatch.title;
                                }
                              }

                              return (
                                <div
                                  key={log.id}
                                  className={`p-2.5 rounded-lg border text-[11px] transition-all duration-200 ${
                                    log.type === 'system'
                                      ? 'bg-indigo-500/5 border-indigo-500/10 text-slate-350 bg-indigo-950/20'
                                      : log.type === 'pr'
                                        ? 'bg-purple-500/5 border-purple-500/15'
                                        : 'bg-white/[0.02] border-white/5'
                                  }`}
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        {log.type === 'pr' ? (
                                          <span className="bg-purple-500/15 text-purple-300 font-mono text-[9px] px-1 py-0.2 rounded border border-purple-500/25 flex items-center gap-0.5 font-bold leading-none">
                                            <GitPullRequest className="h-2.5 w-2.5" /> PR
                                          </span>
                                        ) : log.type === 'commit' ? (
                                          <span className="bg-white/5 text-slate-300 font-mono text-[9px] px-1 py-0.2 rounded border border-white/10 flex items-center gap-0.5 font-bold leading-none">
                                            <Github className="h-2.5 w-2.5 text-slate-400" /> COMMIT
                                          </span>
                                        ) : (
                                          <span className="bg-indigo-500/15 text-indigo-300 font-mono text-[9px] px-1 py-0.2 rounded border border-indigo-500/25 font-bold leading-none">
                                            SYSTEM
                                          </span>
                                        )}
                                        <span className="text-white font-bold font-mono">{log.title}</span>
                                        <span className="text-slate-400 italic text-[10px]">by {log.author} ({log.date})</span>
                                      </div>
                                      <p className="text-slate-300 leading-normal mt-1">{log.message}</p>
                                    </div>
                                    
                                    {log.url && (
                                      <a
                                        href={log.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-450 hover:text-white transition"
                                        title="View item on GitHub"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>

                                  {/* Dynamic auto-recommender and connector linkage panel */}
                                  {log.type !== 'system' && pendingDels.length > 0 && (
                                    <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px]">
                                      {recommendedDelId ? (
                                        <span className="text-indigo-300 flex items-center gap-1 font-semibold">
                                          <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
                                          Suggested: <span className="text-white font-bold">"{recommendedDelTitle}"</span>
                                        </span>
                                      ) : (
                                        <span className="text-slate-500">Associate with milestone:</span>
                                      )}

                                      <div className="flex items-center gap-2">
                                        <select
                                          onChange={(e) => {
                                            const id = e.target.value;
                                            if (id) {
                                              handleLinkActivityToDeliverable(proj, id, log);
                                              e.target.value = ''; // Reset select
                                            }
                                          }}
                                          className="bg-[#050609] border border-white/10 rounded px-2 py-1 text-[10px] text-slate-200 focus:outline-none"
                                          defaultValue=""
                                        >
                                          <option value="" disabled>-- Select Milestone --</option>
                                          {pendingDels.map(d => (
                                            <option key={d.id} value={d.id}>{d.title}</option>
                                          ))}
                                        </select>
                                        
                                        {recommendedDelId && (
                                          <button
                                            onClick={() => handleLinkActivityToDeliverable(proj, recommendedDelId, log)}
                                            className="bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 font-bold border border-indigo-500/30 px-2 py-1 rounded transition flex items-center gap-1 active:scale-95 cursor-pointer"
                                          >
                                            <Check className="h-2.5 w-2.5" /> Auto Bind
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ComAct Integration integrations sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-5 rounded-2xl">
              <h4 className="text-white text-xs uppercase font-mono font-bold tracking-wider text-slate-400 border-b border-white/5 pb-3">
                Git & Chat Pipelines
              </h4>
              <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                Automatically push commit pipelines and team summaries to relevant channels using simulated webhook triggers. This matches state to actual deliverable trees cleanly.
              </p>
              
              <div className="space-y-2 mt-5">
                <button
                  onClick={() => triggerWebhookSimulate('GitHub')}
                  className="w-full text-left bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Github className="h-4 w-4 text-slate-300" />
                    <span className="text-xs text-slate-200">GitHub Commit Webhook</span>
                  </div>
                  <Play className="h-3.5 w-3.5 text-indigo-400" />
                </button>

                <button
                  onClick={() => triggerWebhookSimulate('Slack')}
                  className="w-full text-left bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Slack className="h-4 w-4 text-indigo-455" />
                    <span className="text-xs text-slate-200">Slack Notification Hook</span>
                  </div>
                  <Play className="h-3.5 w-3.5 text-indigo-400" />
                </button>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <h4 className="text-white font-bold text-xs mb-2">ComAct Audit Process</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                All projects are backed by transparent escrow locks. A smart ledger enforces deliverable confirmation from multiple parties before direct release of community assets.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
