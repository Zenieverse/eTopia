import React from 'react';
import { UserRole, UserProfile } from '../types';
import { Shield, Sparkles, Award, Star, LogIn, Lock } from 'lucide-react';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  profile: UserProfile;
  onModifyProfile: (updater: Partial<UserProfile>) => void;
}

export default function Header({ userRole, setUserRole, profile, onModifyProfile }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [authNotification, setAuthNotification] = React.useState<string | null>(null);

  const roles: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'member', label: 'Civic Member', desc: 'Participate, learn, receive career guidance.', color: 'text-sky-400 bg-sky-400/10' },
    { role: 'volunteer', label: 'Skilled Volunteer', desc: 'Join global restoration / inclusion missions.', color: 'text-emerald-400 bg-emerald-400/10' },
    { role: 'organization', label: 'Sponsoring Org', desc: 'Post challenges, hire freelance, launch incubators.', color: 'text-purple-400 bg-purple-400/10' },
    { role: 'mentor', label: 'Expert Mentor', desc: 'Mentor ventures, review deliverables, coach.', color: 'text-amber-400 bg-amber-400/10' },
    { role: 'investor', label: 'Impact Investor', desc: 'Invest in startups, sponsor ledger matches.', color: 'text-pink-400 bg-pink-400/10' },
    { role: 'community_admin', label: 'Community Manager', desc: 'Moderate local disputes, verify deeds.', color: 'text-indigo-400 bg-indigo-400/10' },
    { role: 'super_admin', label: 'Platform SuperAdmin', desc: 'Manage AI nodes, execute system triggers.', color: 'text-rose-400 bg-rose-400/10' },
  ];

  const triggerAuthSimulate = (method: string) => {
    setAuthNotification(`Simulating Secure SSO ${method} Login (MFA JWT issued & saved!)`);
    setTimeout(() => {
      setAuthNotification(null);
    }, 4000);
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    onModifyProfile({ role });
    setDropdownOpen(false);
  };

  const activeRoleObj = roles.find(r => r.role === userRole) || roles[0];

  return (
    <header id="app-header" className="glass-header py-4 px-6 relative z-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* User Identity Details */}
        <div className="flex items-center space-x-3">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-11 h-11 rounded-full border-2 border-indigo-500/80 object-cover shadow-[0_0_12px_rgba(129,140,248,0.2)]"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-semibold text-base leading-tight">{profile.name}</h1>
              <span className={`text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full ${activeRoleObj.color}`}>
                {activeRoleObj.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{profile.email}</p>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Impact Score */}
          <div className="glass-card-nested px-3.5 py-2 rounded-xl flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-[#818cf8]" />
            <div>
              <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 leading-none">Impact Index</p>
              <p className="font-semibold text-white mt-0.5 font-mono">{profile.impactScore} <span className="text-[10px] text-[#818cf8]">(+24)</span></p>
            </div>
          </div>

          {/* Reputation Points */}
          <div className="glass-card-nested px-3.5 py-2 rounded-xl flex items-center space-x-2">
            <Award className="h-4 w-4 text-amber-400" />
            <div>
              <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 leading-none">Reputation Points</p>
              <p className="font-semibold text-white mt-0.5 font-mono">{profile.reputationPoints} <span className="text-[10px] text-amber-400">XP</span></p>
            </div>
          </div>

          {/* Behavioral Trust Score */}
          <div className="glass-card-nested px-3.5 py-2 rounded-xl flex items-center space-x-2">
            <Star className="h-4 w-4 text-sky-400 fill-sky-400/20" />
            <div>
              <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 leading-none">Reputation Score</p>
              <p className="font-semibold text-white mt-0.5 font-mono">{profile.trustScore}% <span className="text-[10px] text-sky-400">Trust</span></p>
            </div>
          </div>

          {/* Role Switching Trigger */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="glass-button-primary text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 focus:outline-none cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Switch Identity View</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 glass-card rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-2">
                  <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#818cf8]">Select Role Permission</p>
                </div>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {roles.map(r => (
                    <button
                      key={r.role}
                      onClick={() => handleRoleChange(r.role)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-start gap-2.5 ${
                        userRole === r.role ? 'bg-white/10 border-l-2 border-indigo-500' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="mt-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${r.color.split(' ')[1]}`}></div>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${userRole === r.role ? 'text-indigo-400' : 'text-white'}`}>
                          {r.label}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Identity Security Controls & SSO Simulators */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Lock className="h-3.5 w-3.5 text-[#818cf8]" />
          <span className="font-mono text-[10px]">AUTH DOMAIN: eTopia JWT MFA Gate</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-500 font-medium">Simulate SSO:</span>
          {['Google', 'Microsoft', 'LinkedIn', 'OTP Login'].map(provider => (
            <button
              key={provider}
              onClick={() => triggerAuthSimulate(provider)}
              className="glass-button-secondary text-[10px] font-semibold font-mono px-2.5 py-1 rounded-lg transition cursor-pointer"
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Floating auth status banner */}
      {authNotification && (
        <div className="absolute top-full left-6 right-6 mt-2 bg-indigo-500/15 border border-indigo-400/50 text-indigo-300 text-xs py-2.5 px-4 rounded-xl flex items-center justify-between shadow-xl backdrop-blur-lg z-40 animate-fade-in">
          <div className="flex items-center space-x-2">
            <LogIn className="h-4 w-4 animate-bounce text-indigo-400" />
            <span className="font-semibold">{authNotification}</span>
          </div>
          <button onClick={() => setAuthNotification(null)} className="hover:text-indigo-200">✕</button>
        </div>
      )}
    </header>
  );
}
