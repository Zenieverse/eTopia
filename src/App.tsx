import React from 'react';
import {
  UserProfile,
  FreelanceJob,
  FreelancerProfile,
  ComActProject,
  Startup,
  Challenge,
  ResourceExchangeItem,
  Proposal,
  ImpactLedgerEntry,
  ChatMessage,
  UserRole,
} from './types';

import {
  INITIAL_PROFILE,
  INITIAL_FREELANCERS,
  INITIAL_JOBS,
  INITIAL_PROJECTS,
  INITIAL_STARTUPS,
  INITIAL_CHALLENGES,
  INITIAL_RESOURCE_ITEMS,
  INITIAL_PROPOSALS,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_COURSES,
} from './services/mockData';

// UI Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HubDashboard from './components/HubDashboard';
import IDecide from './components/IDecide';
import ChallengeMarketplace from './components/ChallengeMarketplace';
import ResourceEx from './components/ResourceEx';
import HelpSupport from './components/HelpSupport';
import BehavioralNavigation from './components/BehavioralNavigation';
import ComeShine from './components/ComeShine';
import ComAct from './components/ComAct';
import Incubator from './components/Incubator';
import SkillsAcademy from './components/SkillsAcademy';
import ImpactDash from './components/ImpactDash';
import GovernanceLedgerView from './components/GovernanceLedgerView';
import CopilotPanel from './components/CopilotPanel';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<string>('hub');
  
  // App state
  const [profile, setProfile] = React.useState<UserProfile>(INITIAL_PROFILE);
  const [userRole, setUserRole] = React.useState<UserRole>(INITIAL_PROFILE.role);
  const [jobs, setJobs] = React.useState<FreelanceJob[]>(INITIAL_JOBS);
  const [freelancers, setFreelancers] = React.useState<FreelancerProfile[]>(INITIAL_FREELANCERS);
  const [projects, setProjects] = React.useState<ComActProject[]>(INITIAL_PROJECTS);
  const [startups, setStartups] = React.useState<Startup[]>(INITIAL_STARTUPS);
  const [challenges, setChallenges] = React.useState<Challenge[]>(INITIAL_CHALLENGES);
  const [resources, setResources] = React.useState<ResourceExchangeItem[]>(INITIAL_RESOURCE_ITEMS);
  const [proposals, setProposals] = React.useState<Proposal[]>(INITIAL_PROPOSALS);
  const [ledgerEntries, setLedgerEntries] = React.useState<ImpactLedgerEntry[]>(INITIAL_LEDGER_ENTRIES);

  // Common modifier callbacks
  const handleModifyProfile = (updater: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updater }));
  };

  const handleAddJob = (job: FreelanceJob) => {
    setJobs(prev => [job, ...prev]);

    // Append job log on ledger
    const newEntry: ImpactLedgerEntry = {
      id: `led-${Date.now()}`,
      type: 'job_created',
      title: 'Digital Contract Broadcast',
      description: `New freelance contract titled "${job.title}" logged in ComeShine index.`,
      amountText: `$${job.budget} escrow`,
      date: new Date().toISOString().split('T')[0],
      transparencyHash: `0x${Math.round(Math.random() * 1000000000).toString(16)}`,
    };
    setLedgerEntries(prev => [newEntry, ...prev]);
  };

  const handleModifyJob = (jobId: string, updater: Partial<FreelanceJob>) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, ...updater };
      }
      return j;
    }));
  };

  const handleAddProject = (proj: ComActProject) => {
    setProjects(prev => [proj, ...prev]);

    // Ledger update
    const newEntry: ImpactLedgerEntry = {
      id: `led-${Date.now()}`,
      type: 'project_completed',
      title: 'Enterprise ComAct Project launch',
      description: `Vetted task team deployment started for project: "${proj.title}".`,
      amountText: `$${proj.budget} resource budget`,
      date: new Date().toISOString().split('T')[0],
      transparencyHash: `0x${Math.round(Math.random() * 1000000000).toString(16)}`,
    };
    setLedgerEntries(prev => [newEntry, ...prev]);
  };

  const handleModifyProject = (id: string, updater: Partial<ComActProject>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updater };
      }
      return p;
    }));
  };

  const handleAddStartup = (sup: Startup) => {
    setStartups(prev => [sup, ...prev]);

    // Ledger update
    const newEntry: ImpactLedgerEntry = {
      id: `led-${Date.now()}`,
      type: 'donation_utilized',
      title: 'Venture Pitch Comp Registration',
      description: `Startup enterprise "${sup.name}" registered inside active incubator with $${sup.fundingGoal} funding target.`,
      amountText: `$0 raised`,
      date: new Date().toISOString().split('T')[0],
      transparencyHash: `0x${Math.round(Math.random() * 1000000000).toString(16)}`,
    };
    setLedgerEntries(prev => [newEntry, ...prev]);
  };

  const handleModifyStartup = (id: string, updater: Partial<Startup>) => {
    setStartups(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, ...updater };
      }
      return s;
    }));
  };

  const handleAddChallenge = (chan: Challenge) => {
    setChallenges(prev => [chan, ...prev]);

    const newLed: ImpactLedgerEntry = {
      id: `led-${Date.now()}`,
      type: 'volunteer_hours_recorded',
      title: 'SDG Challenge formulation Logged',
      description: `Public challenge posted targeting UN SDG ${chan.sdg}: "${chan.title}".`,
      amountText: `${chan.volunteersNeeded} Volunteers Needed`,
      date: new Date().toISOString().split('T')[0],
      transparencyHash: `0x${Math.round(Math.random() * 1000000000).toString(16)}`,
    };
    setLedgerEntries(prev => [newLed, ...prev]);
  };

  const handleModifyChallenge = (id: string, updater: Partial<Challenge>) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, ...updater };
      }
      return c;
    }));
  };

  const handleAddResource = (item: ResourceExchangeItem) => {
    setResources(prev => [item, ...prev]);
  };

  const handleModifyResource = (id: string, updater: Partial<ResourceExchangeItem>) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        const item = { ...r, ...updater };
        if (updater.status === 'matched') {
          // Log match on blockchain simulation
          const freshLedEntry: ImpactLedgerEntry = {
            id: `led-${Date.now()}`,
            type: 'donation_utilized',
            title: `Asset Mapped: ${r.title}`,
            description: `Exchange matched: "${r.title}" has been successfully assigned to candidate project: "${item.recipientProject}".`,
            amountText: `$${r.valueAmount} value`,
            date: new Date().toISOString().split('T')[0],
            transparencyHash: `0x${Math.round(Math.random() * 1000000000).toString(16)}`,
          };
          setLedgerEntries(prev => [freshLedEntry, ...prev]);
        }
        return item;
      }
      return r;
    }));
  };

  const handleAddProposal = (prop: Proposal) => {
    setProposals(prev => [prop, ...prev]);

    const newLed: ImpactLedgerEntry = {
      id: `led-${Date.now()}`,
      type: 'education_certified',
      title: 'Civic governance proposal Active',
      description: `New municipal resolution drafted by Alex Rivera: "${prop.title}".`,
      amountText: 'VOTING IN OPERATION',
      date: new Date().toISOString().split('T')[0],
      transparencyHash: `0x${Math.round(Math.random() * 1000000000).toString(16)}`,
    };
    setLedgerEntries(prev => [newLed, ...prev]);
  };

  const handleVoteSimulate = (id: string, dir: 'for' | 'against') => {
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        // Toggle or increment
        const subFor = p.hasVoted === 'for' ? -1 : 0;
        const subAgainst = p.hasVoted === 'against' ? -1 : 0;

        let dFor = 0;
        let dAgainst = 0;
        if (dir === 'for') {
          dFor = p.hasVoted === 'for' ? -1 : 1;
        } else {
          dAgainst = p.hasVoted === 'against' ? -1 : 1;
        }

        const nextChoice = p.hasVoted === dir ? undefined : dir;

        return {
          ...p,
          votesFor: p.votesFor + dFor + subFor,
          votesAgainst: p.votesAgainst + dAgainst + subAgainst,
          hasVoted: nextChoice,
        };
      }
      return p;
    }));
  };

  // Central server-side Gemini gateway call
  const triggerAIContext = async (
    agent: string,
    prompt: string,
    history: ChatMessage[] = []
  ): Promise<string> => {
    try {
      const response = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          agentType: agent,
          chatHistory: history,
        }),
      });

      if (!response.ok) {
        throw new Error('Copilot response non-200 feedback');
      }

      const raw = await response.json();
      return raw.text || 'Operational matching details compiled.';
    } catch (e) {
      console.error('Gateway dispatch failed:', e);
      throw e;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen frosted-bg overflow-hidden text-slate-100 font-sans antialiased">
      {/* Sidebar navigation context */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

      {/* Main viewport frame */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Global identity and quick status toggler header */}
        <Header
          userRole={userRole}
          setUserRole={setUserRole}
          profile={profile}
          onModifyProfile={handleModifyProfile}
        />

        {/* Dynamic active tabs workspace view container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full transition-all duration-300">
          
          {activeTab === 'hub' && (
            <HubDashboard
              profile={profile}
              challenges={challenges}
              projects={projects}
              setActiveTab={setActiveTab}
              triggerAIContext={triggerAIContext}
            />
          )}

          {activeTab === 'idecide' && (
            <IDecide
              profile={profile}
              triggerAIContext={triggerAIContext}
            />
          )}

          {activeTab === 'challenges' && (
            <ChallengeMarketplace
              profile={profile}
              challenges={challenges}
              onAddChallenge={handleAddChallenge}
              onModifyChallenge={handleModifyChallenge}
              onModifyProfile={handleModifyProfile}
            />
          )}

          {activeTab === 'exchange' && (
            <ResourceEx
              profile={profile}
              resources={resources}
              onAddResource={handleAddResource}
              onModifyResource={handleModifyResource}
              onModifyProfile={handleModifyProfile}
            />
          )}

          {activeTab === 'help' && (
            <HelpSupport
              profile={profile}
              onModifyProfile={handleModifyProfile}
            />
          )}

          {activeTab === 'behavioral' && (
            <BehavioralNavigation
              profile={profile}
              onModifyProfile={handleModifyProfile}
            />
          )}

          {activeTab === 'marketplace' && (
            <ComeShine
              profile={profile}
              freelancers={freelancers}
              jobs={jobs}
              onAddJob={handleAddJob}
              onModifyJob={handleModifyJob}
              onModifyProfile={handleModifyProfile}
            />
          )}

          {activeTab === 'project' && (
            <ComAct
              profile={profile}
              projects={projects}
              onAddProject={handleAddProject}
              onModifyProject={handleModifyProject}
              onModifyProfile={handleModifyProfile}
            />
          )}

          {activeTab === 'incubator' && (
            <Incubator
              profile={profile}
              startups={startups}
              onAddStartup={handleAddStartup}
              onModifyStartup={handleModifyStartup}
              triggerAIContext={triggerAIContext}
            />
          )}

          {activeTab === 'academy' && (
            <SkillsAcademy
              profile={profile}
              courses={INITIAL_COURSES}
              onModifyProfile={handleModifyProfile}
              triggerAIContext={triggerAIContext}
            />
          )}

          {activeTab === 'impact' && (
            <ImpactDash
              profile={profile}
            />
          )}

          {activeTab === 'governance' && (
            <GovernanceLedgerView
              proposals={proposals}
              ledgerEntries={ledgerEntries}
              onAddProposal={handleAddProposal}
              onVoteSimulate={handleVoteSimulate}
            />
          )}

        </div>
      </main>

      {/* Floating Multi-Agent Copilot Chat drawer - Module 7 */}
      <CopilotPanel profile={profile} triggerAIContext={triggerAIContext} />
    </div>
  );
}
