import React from 'react';
import { ComActProject, UserProfile, Deliverable } from '../types';
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
