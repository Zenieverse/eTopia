export type UserRole =
  | 'super_admin'
  | 'community_admin'
  | 'member'
  | 'mentor'
  | 'investor'
  | 'volunteer'
  | 'organization'
  | 'innovator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  impactScore: number;
  reputationPoints: number;
  trustScore: number; // For Behavioral Navigation (0-100)
  xp: number;
  badges: Badge[];
  bio: string;
  avatarUrl: string;
  skills: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// ComeShine Marketplace
export interface FreelancerProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  skills: string[];
  hourlyRate: number;
  verified: boolean;
  rating: number;
  completedJobsCount: number;
  portfolio: PortfolioItem[];
  reputationPoints: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

export interface FreelanceJob {
  id: string;
  title: string;
  description: string;
  category: 'AI' | 'Software Development' | 'UX/UI' | 'Data Science' | 'Marketing' | 'Content Creation' | 'Translation' | 'Virtual Assistance';
  budget: number;
  skillsRequired: string[];
  postedBy: string;
  status: 'open' | 'active' | 'deliverable_submitted' | 'completed';
  proposalsCount: number;
  assignedTo?: string; // Freelancer ID
}

// ComAct Project Center
export interface ComActProject {
  id: string;
  title: string;
  description: string;
  postedBy: string;
  orgName: string;
  budget: number;
  deadline: string;
  status: 'planning' | 'team_formation' | 'in_progress' | 'completed';
  requiredTeamSize: number;
  joinedTeamMembers: string[]; // User names or IDs
  deliverables: Deliverable[];
  integrationWebhookSimulated: boolean;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'submitted' | 'approved';
  submissionNotes?: string;
}

// Startup Incubator
export interface Startup {
  id: string;
  name: string;
  oneLiner: string;
  description: string;
  founders: string[];
  sector: string;
  stage: 'idea' | 'pre-seed' | 'seed' | 'series-a';
  startupScore: number; // Simulated AI Evaluation (0-100)
  fundingGoal: number;
  raisedAmount: number;
  pitchCompetitionParticipant: boolean;
  needsMentorship: boolean;
}

// Help Centers
export interface ServiceHelpDesk {
  id: string;
  name: string;
  category: 'Digital Literacy' | 'Career Counseling' | 'Legal Resources' | 'Health Navigation' | 'Community Support';
  description: string;
  availableStaff: number;
}

// Global Challenge Marketplace
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string; // Poverty, Climate Change, Education, etc.
  sdg: number; // e.g., 1 for No Poverty, 13 for Climate Action
  postedBy: string;
  status: 'challenge' | 'community_formulating' | 'experts_evaluating' | 'volunteers_joining' | 'funding' | 'implementation' | 'impact_measured';
  volunteersNeeded: number;
  volunteersJoined: number;
  fundingGoal: number;
  fundingRaised: number;
  impactMetrics?: string;
}

// Resource Exchange
export interface ResourceExchangeItem {
  id: string;
  type: 'sponsorship' | 'donation' | 'investment' | 'volunteer' | 'grant';
  title: string;
  description: string;
  provider: string; // Organization/User offering
  recipientProject?: string; // Null if general pool, otherwise matched project name
  valueAmount?: number; // Donation limit or Sponsorship count
  matchedDate?: string;
  status: 'available' | 'matched';
}

// Learning Academy
export interface Course {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  xpWorth: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolledCount: number;
  chapters: string[];
  badgeGiven: string; // Badge ID
}

// Governance Ledger & Proposal
export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  proposerRole: UserRole;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed' | 'defeated';
  fundRequested?: number;
  endsAt: string;
  hasVoted?: 'for' | 'against';
}

export interface ImpactLedgerEntry {
  id: string;
  type: 'donation_utilized' | 'volunteer_hours_recorded' | 'job_created' | 'education_certified' | 'project_completed';
  title: string;
  description: string;
  amountText?: string;
  date: string;
  transparencyHash: string; // Simulated ledger block hash
}

// AI Copilot layers
export type AgentType =
  | 'opportunity'
  | 'mentor'
  | 'funding'
  | 'community'
  | 'impact'
  | 'governance'
  | 'idecide';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  agentType?: AgentType;
}
