import React from 'react';
import { FreelancerProfile, FreelanceJob, UserProfile } from '../types';
import {
  Briefcase,
  Star,
  ShieldCheck,
  Plus,
  DollarSign,
  Layers,
  FileCheck2,
  Users,
} from 'lucide-react';

interface ComeShineProps {
  profile: UserProfile;
  freelancers: FreelancerProfile[];
  jobs: FreelanceJob[];
  onAddJob: (job: FreelanceJob) => void;
  onModifyJob: (jobId: string, updater: Partial<FreelanceJob>) => void;
  onModifyProfile: (updater: Partial<UserProfile>) => void;
}

export default function ComeShine({
  profile,
  freelancers,
  jobs,
  onAddJob,
  onModifyJob,
  onModifyProfile,
}: ComeShineProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<'jobs' | 'talents' | 'post'>('jobs');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  
  // Post Job form state
  const [jobTitle, setJobTitle] = React.useState('');
  const [jobDesc, setJobDesc] = React.useState('');
  const [jobCat, setJobCat] = React.useState<FreelanceJob['category']>('AI');
  const [jobBudget, setJobBudget] = React.useState('');
  const [jobSkills, setJobSkills] = React.useState('');
  const [notification, setNotification] = React.useState<string | null>(null);

  const categories = [
    'All',
    'AI',
    'Software Development',
    'UX/UI',
    'Data Science',
    'Marketing',
    'Content Creation',
    'Translation',
    'Virtual Assistance',
  ];

  const filteredJobs = selectedCategory === 'All'
    ? jobs
    : jobs.filter(j => j.category === selectedCategory);

  const filteredFreelancers = selectedCategory === 'All'
    ? freelancers
    : freelancers.filter(f => f.skills.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase())) || selectedCategory === 'All');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc || !jobBudget) return;

    const newJob: FreelanceJob = {
      id: `job-${Date.now()}`,
      title: jobTitle,
      description: jobDesc,
      category: jobCat,
      budget: parseFloat(jobBudget),
      skillsRequired: jobSkills.split(',').map(s => s.trim()).filter(Boolean),
      postedBy: profile.name,
      status: 'open',
      proposalsCount: 0,
    };

    onAddJob(newJob);
    setJobTitle('');
    setJobDesc('');
    setJobBudget('');
    setJobSkills('');
    setNotification('Job Post success! Automated eTopia screening active.');
    setActiveSubTab('jobs');

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleApplySimulate = (jobId: string) => {
    // Simulate current user applying to this job
    onModifyJob(jobId, {
      proposalsCount: (jobs.find(j => j.id === jobId)?.proposalsCount || 0) + 1,
    });
    setNotification('Simulated proposal successfully filed directly on the ledger!');
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handlePayEscrow = (job: FreelanceJob) => {
    // Simulate paying out escrow to a locked developer
    onModifyJob(job.id, { status: 'completed' });
    onModifyProfile({
      impactScore: profile.impactScore + 50,
      reputationPoints: profile.reputationPoints + 100,
    });
    setNotification(`Simulated escrow paid! Freelancer paid $${job.budget} USD safely. Impact Score updated +50.`);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleMockStatusAdvance = (jobId: string, nextStatus: FreelanceJob['status']) => {
    onModifyJob(jobId, { status: nextStatus });
    setNotification(`Job status moved to: ${nextStatus.replace('_', ' ')}`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <Briefcase className="h-6 w-6 text-indigo-400" />
              <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
                ComeShine Talent Platform
              </h2>
            </div>
            <p className="text-slate-450 text-xs mt-1.5 leading-relaxed">
              Global decentralized talent marketplace connecting sovereign digital micro-workers to meaningful commercial and social gigs.
            </p>
          </div>

          {/* Sub menu filters */}
          <div className="flex items-center space-x-1.5 bg-black/20 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveSubTab('jobs')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'jobs' ? 'bg-indigo-500 text-white font-bold shadow-[0_0_12px_rgba(129,140,248,0.3)]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Browse Jobs
            </button>
            <button
              onClick={() => setActiveSubTab('talents')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'talents' ? 'bg-indigo-500 text-white font-bold shadow-[0_0_12px_rgba(129,140,248,0.3)]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Find Experts
            </button>
            <button
              onClick={() => setActiveSubTab('post')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'post' ? 'bg-indigo-500 text-white font-bold shadow-[0_0_12px_rgba(129,140,248,0.3)]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Post a Gig
            </button>
          </div>
        </div>

        {/* Global Notification */}
        {notification && (
          <div className="mt-4 bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="cursor-pointer hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* Categories Horizontal Scrolling */}
      {activeSubTab !== 'post' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40 shadow-[0_0_8px_rgba(129,140,248,0.2)]'
                  : 'bg-black/25 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Container tabs */}
      {activeSubTab === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gigs lists */}
          <div className="lg:col-span-2 space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="glass-card border-dashed p-8 text-center rounded-2xl text-slate-500 text-xs">
                No active job posts matching this category yet.
              </div>
            ) : (
              filteredJobs.map(job => (
                <div key={job.id} className="glass-card glass-card-hover p-5 rounded-2xl hover:border-white/10 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="bg-indigo-500/10 text-indigo-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-white/5">
                        {job.category}
                      </span>
                      <h3 className="text-white text-base font-bold mt-2 hover:text-indigo-400 transition cursor-pointer">
                        {job.title}
                      </h3>
                      <p className="text-slate-450 text-xs mt-1.5 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                    <span className="text-white font-mono font-bold text-sm bg-black/25 px-3 py-1.5 rounded-xl border border-white/5 whitespace-nowrap">
                      ${job.budget.toLocaleString()}
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.skillsRequired.map(skill => (
                      <span key={skill} className="bg-white/5 text-slate-350 font-mono text-[10px] px-2 py-0.5 rounded border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer status and operational buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-white/5 text-xs">
                    <div className="text-slate-400 flex items-center gap-3">
                      <span>Posted by <span className="text-slate-200 font-semibold">{job.postedBy}</span></span>
                      <span>•</span>
                      <span>{job.proposalsCount} proposals filed</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {job.postedBy === profile.name ? (
                        <>
                          {job.status === 'open' && (
                            <button
                              onClick={() => handleMockStatusAdvance(job.id, 'active')}
                              className="glass-button-secondary text-[11px] font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer animate-fade-in"
                            >
                              Assign Member
                            </button>
                          )}
                          {job.status === 'active' && (
                            <button
                              onClick={() => handleMockStatusAdvance(job.id, 'deliverable_submitted')}
                              className="glass-button-primary text-[11px] font-semibold px-2.5 py-1.5 rounded-lg text-white cursor-pointer"
                            >
                              Flag Deliverable
                            </button>
                          )}
                          {job.status === 'deliverable_submitted' && (
                            <button
                              onClick={() => handlePayEscrow(job)}
                              className="glass-button-primary text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 text-white cursor-pointer"
                            >
                              <FileCheck2 className="h-3 w-3" />
                              <span>Release Escrow Pay</span>
                            </button>
                          )}
                          <span className="text-[10px] uppercase font-mono font-bold bg-black/20 px-2 py-1 rounded text-slate-400 border border-white/5">
                            {job.status.replace('_', ' ')}
                          </span>
                        </>
                      ) : (
                        <button
                          onClick={() => handleApplySimulate(job.id)}
                          className="glass-button-primary text-white text-[11px] font-bold px-4 py-1.5 rounded-lg border border-white/5 transition-all cursor-pointer"
                        >
                          Submit Bid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick sidebar stats */}
          <div className="space-y-6">
            <div className="glass-card p-5 rounded-2xl">
              <h4 className="text-white text-xs uppercase font-mono font-bold tracking-wider text-slate-400 border-b border-white/5 pb-3">
                Decentralized Escrow Ledger
              </h4>
              <div className="space-y-3.5 mt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total volume secured</span>
                  <span className="text-white font-mono font-semibold">$124,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Funds in locked arbitration</span>
                  <span className="text-slate-200 font-mono">$8,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Automatic payouts executed</span>
                  <span className="text-indigo-400 font-mono font-semibold">1,410</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl text-xs leading-relaxed text-slate-400">
              <h4 className="text-white font-bold text-xs mb-3 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-indigo-400" /> ComeShine Guarantees
              </h4>
              All smart contract escrow matches require a 95% trust index to claim automated release logs. Super Admin moderates any grievance triggers.
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'talents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.map(fl => (
            <div key={fl.id} className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition">
              <div>
                <div className="flex items-start space-x-3">
                  <img
                    src={fl.avatar}
                    alt={fl.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-white text-sm font-bold">{fl.name}</h3>
                      {fl.verified && <ShieldCheck className="h-4 w-4 text-indigo-400" />}
                    </div>
                    <p className="text-slate-400 text-xs">{fl.title}</p>
                  </div>
                </div>

                {/* Rating / Completed */}
                <div className="flex items-center space-x-4 mt-3 text-xs">
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span className="font-semibold font-mono">{fl.rating}</span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-mono font-medium">{fl.completedJobsCount} gigs done</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-4">
                  {fl.skills.map(s => (
                    <span key={s} className="bg-white/5 text-slate-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-white/5">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Hourly Rate</p>
                  <p className="text-white font-mono font-bold text-sm">${fl.hourlyRate} <span className="text-[10px] text-slate-405">/ hr</span></p>
                </div>
                <button
                  onClick={() => {
                    setNotification(`Simulation: Message initiated directly to ${fl.name} in eTopia chat!`);
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="glass-button-secondary text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer"
                >
                  Direct Contract
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'post' && (
        <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto">
          <h3 className="text-white text-base font-bold border-b border-white/5 pb-3 flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-400" /> Post New Digital Contract
          </h3>
          <form onSubmit={handleCreateJob} className="space-y-4 mt-6 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">CONTRACT / JOB TITLE</label>
              <input
                type="text"
                required
                placeholder="e.g. Build an NLP classifier for regional grievances in District 1"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">MARKETPLACE CATEGORY</label>
                <select
                  value={jobCat}
                  onChange={e => setJobCat(e.target.value as FreelanceJob['category'])}
                  className="w-full glass-input rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="AI" className="bg-[#0c0f16] text-white">AI Engineering</option>
                  <option value="Software Development" className="bg-[#0c0f16] text-white">Software Development</option>
                  <option value="UX/UI" className="bg-[#0c0f16] text-white">UX/UI Accessibility</option>
                  <option value="Data Science" className="bg-[#0c0f16] text-white">Data Science</option>
                  <option value="Marketing" className="bg-[#0c0f16] text-white">Growth Marketing</option>
                  <option value="Content Creation" className="bg-[#0c0f16] text-white">Content Creation</option>
                  <option value="Translation" className="bg-[#0c0f16] text-white">Translation Services</option>
                  <option value="Virtual Assistance" className="bg-[#0c0f16] text-white">Virtual Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">SACRED SECURED BUDGET ($ USD)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2400"
                  value={jobBudget}
                  onChange={e => setJobBudget(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">REQUIRED TECHNICAL CAPABILITIES (Comma Separated)</label>
              <input
                type="text"
                placeholder="e.g. TensorFlow, NLP, Prompt engineering, Python"
                value={jobSkills}
                onChange={e => setJobSkills(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">GIG / CONTRACT DESCRIPTION</label>
              <textarea
                required
                rows={5}
                placeholder="Give exact technical objectives, deliverables, and expectations. Highlight how this supports social impact if applicable."
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full glass-button-primary font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
            >
              Post to ComeShine Ledger Node
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
