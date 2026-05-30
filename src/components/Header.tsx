import React from 'react';
import { UserRole, UserProfile } from '../types';
import { Shield, Sparkles, Award, Star, LogIn, Lock, Pencil, X, Plus, Camera, Check } from 'lucide-react';

const DEFAULT_ROLE_AVATARS: Record<UserRole, string> = {
  member: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  volunteer: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  innovator: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  organization: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200',
  mentor: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  investor: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
  community_admin: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  super_admin: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
};

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  profile: UserProfile;
  onModifyProfile: (updater: Partial<UserProfile>) => void;
}

export default function Header({ userRole, setUserRole, profile, onModifyProfile }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [authNotification, setAuthNotification] = React.useState<string | null>(null);

  // Sovereign Custom Roles maps
  const [customRoles, setCustomRoles] = React.useState<Record<UserRole, { label: string; desc: string; avatarUrl: string }>>(() => {
    const saved = localStorage.getItem('etopia_custom_roles_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      member: { label: 'Civic Member', desc: 'Participate, learn, receive career guidance.', avatarUrl: DEFAULT_ROLE_AVATARS.member },
      volunteer: { label: 'Skilled Volunteer', desc: 'Join global restoration / inclusion missions.', avatarUrl: DEFAULT_ROLE_AVATARS.volunteer },
      innovator: { label: 'Platform Innovator', desc: 'Propose startup concepts, manage incubator entries, write novel solutions.', avatarUrl: DEFAULT_ROLE_AVATARS.innovator },
      organization: { label: 'Sponsoring Org', desc: 'Post challenges, hire freelance, launch incubators.', avatarUrl: DEFAULT_ROLE_AVATARS.organization },
      mentor: { label: 'Expert Mentor', desc: 'Mentor ventures, review deliverables, coach.', avatarUrl: DEFAULT_ROLE_AVATARS.mentor },
      investor: { label: 'Impact Investor', desc: 'Invest in startups, sponsor ledger matches.', avatarUrl: DEFAULT_ROLE_AVATARS.investor },
      community_admin: { label: 'Community Manager', desc: 'Moderate local disputes, verify deeds.', avatarUrl: DEFAULT_ROLE_AVATARS.community_admin },
      super_admin: { label: 'Platform SuperAdmin', desc: 'Manage AI nodes, execute system triggers.', avatarUrl: DEFAULT_ROLE_AVATARS.super_admin },
    };
  });

  const saveCustomRoles = (updated: Record<UserRole, { label: string; desc: string; avatarUrl: string }>) => {
    setCustomRoles(updated);
    localStorage.setItem('etopia_custom_roles_v1', JSON.stringify(updated));
  };

  const [editingRole, setEditingRole] = React.useState<UserRole | null>(null);
  const [editRoleLabel, setEditRoleLabel] = React.useState('');
  const [editRoleDesc, setEditRoleDesc] = React.useState('');
  const [editRoleAvatar, setEditRoleAvatar] = React.useState('');

  // Profile Editor state
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [nameInput, setNameInput] = React.useState('');
  const [emailInput, setEmailInput] = React.useState('');
  const [bioInput, setBioInput] = React.useState('');
  const [avatarInput, setAvatarInput] = React.useState('');
  const [skillsList, setSkillsList] = React.useState<string[]>([]);
  const [newSkillText, setNewSkillText] = React.useState('');

  const openEditModal = () => {
    setNameInput(profile.name);
    setEmailInput(profile.email);
    setBioInput(profile.bio || '');
    setAvatarInput(profile.avatarUrl);
    setSkillsList(profile.skills || []);
    setEditModalOpen(true);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onModifyProfile({
      name: nameInput,
      email: emailInput,
      bio: bioInput,
      avatarUrl: avatarInput,
      skills: skillsList,
    });
    
    // Also save custom role details for active role!
    const updated = {
      ...customRoles,
      [userRole]: {
        ...customRoles[userRole],
        avatarUrl: avatarInput
      }
    };
    saveCustomRoles(updated);
    
    setEditModalOpen(false);
    
    // Dispatch helpful visual change alert
    setAuthNotification("Sovereign profile details updated & signed successfully inside local ledger block.");
    setTimeout(() => setAuthNotification(null), 3500);
  };

  const avatarPresets = [
    { name: 'Sovereign Leader', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { name: 'Digital Pioneer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Social Developer', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { name: 'Civic Volunteer', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' },
    { name: 'Resilience Planner', url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=200' },
    { name: 'Eco Expert', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  ];

  const roles: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'member', label: 'Civic Member', desc: 'Participate, learn, receive career guidance.', color: 'text-sky-400 bg-sky-400/10' },
    { role: 'volunteer', label: 'Skilled Volunteer', desc: 'Join global restoration / inclusion missions.', color: 'text-emerald-400 bg-emerald-400/10' },
    { role: 'innovator', label: 'Platform Innovator', desc: 'Propose startup concepts, manage incubator entries, write novel solutions.', color: 'text-cyan-400 bg-cyan-400/10' },
    { role: 'organization', label: 'Sponsoring Org', desc: 'Post challenges, hire freelance, launch incubators.', color: 'text-purple-400 bg-purple-400/10' },
    { role: 'mentor', label: 'Expert Mentor', desc: 'Mentor ventures, review deliverables, coach.', color: 'text-amber-400 bg-amber-400/10' },
    { role: 'investor', label: 'Impact Investor', desc: 'Invest in startups, sponsor ledger matches.', color: 'text-pink-400 bg-pink-400/10' },
    { role: 'community_admin', label: 'Community Manager', desc: 'Moderate local disputes, verify deeds.', color: 'text-indigo-400 bg-indigo-400/10' },
    { role: 'super_admin', label: 'Platform SuperAdmin', desc: 'Manage AI nodes, execute system triggers.', color: 'text-rose-400 bg-rose-400/10' },
  ];

  const rolesWithMetadata = roles.map(r => ({
    ...r,
    label: customRoles[r.role]?.label || r.label,
    desc: customRoles[r.role]?.desc || r.desc,
    avatarUrl: customRoles[r.role]?.avatarUrl || DEFAULT_ROLE_AVATARS[r.role],
  }));

  const triggerAuthSimulate = (method: string) => {
    setAuthNotification(`Simulating Secure SSO ${method} Login (MFA JWT issued & saved!)`);
    setTimeout(() => {
      setAuthNotification(null);
    }, 4000);
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    const roleAv = customRoles[role]?.avatarUrl || DEFAULT_ROLE_AVATARS[role];
    onModifyProfile({ role, avatarUrl: roleAv });
    setDropdownOpen(false);
  };

  const activeRoleObj = rolesWithMetadata.find(r => r.role === userRole) || rolesWithMetadata[0];

  return (
    <header id="app-header" className="glass-header py-4 px-6 relative z-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* User Identity Details wrapped in interactive click item */}
        <div 
          id="user-identity-trigger"
          onClick={openEditModal}
          className="flex items-center space-x-3 group cursor-pointer hover:bg-white/5 p-1 px-2.5 rounded-xl transition duration-200"
          title="Click to edit civic profile"
        >
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-11 h-11 rounded-full border-2 border-indigo-500/80 object-cover shadow-[0_0_12px_rgba(129,140,248,0.2)] group-hover:border-indigo-400 transition"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 rounded-full p-1 border border-white/10 opacity-0 group-hover:opacity-100 transition duration-200">
              <Pencil className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-semibold text-base leading-tight group-hover:text-indigo-300 transition flex items-center gap-1">
                {profile.name}
              </h1>
              <span className={`text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full ${activeRoleObj.color}`}>
                {activeRoleObj.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs text-slate-400">{profile.email}</p>
              <span className="text-[9px] text-indigo-400 font-mono opacity-0 group-hover:opacity-100 transition duration-200">• Click to customize info</span>
            </div>
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
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl p-3.5 z-50 border border-white/10">
                {editingRole ? (
                  /* Custom role sub-editor within dropdown */
                  <div className="space-y-4 animate-fade-in text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Pencil className="h-3 w-3 text-indigo-400" />
                        <span className="font-bold text-white uppercase text-[9px] tracking-wider font-mono truncate">
                          Edit: {editingRole.replace('_', ' ')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRole(null);
                        }}
                        className="text-slate-400 hover:text-white font-mono text-[9px] underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Custom Label */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Identity Name</label>
                        <input
                          type="text"
                          value={editRoleLabel}
                          onChange={(e) => setEditRoleLabel(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 text-white font-medium focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Custom Description */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Mission Description</label>
                        <textarea
                          rows={2}
                          value={editRoleDesc}
                          onChange={(e) => setEditRoleDesc(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 text-slate-300 leading-tight focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Custom Image Upload & URL input combo */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Avatar Image Source</label>
                        
                        {/* Interactive Upload Block */}
                        <div className="flex items-center gap-3 bg-black/35 p-2 rounded-xl border border-white/5">
                          <img
                            src={editRoleAvatar || DEFAULT_ROLE_AVATARS[editingRole]}
                            alt="Role Preview"
                            className="w-11 h-11 rounded-full object-cover border border-white/10 shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_ROLE_AVATARS[editingRole];
                            }}
                          />
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              id={`role-file-loader-${editingRole}`}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setEditRoleAvatar(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label
                              htmlFor={`role-file-loader-${editingRole}`}
                              className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 p-1 px-2 rounded-md text-[9px] font-bold font-mono cursor-pointer transition block text-center"
                            >
                              Upload File
                            </label>
                            <p className="text-[8px] text-slate-500 font-mono mt-1 text-center">Base64 file stream</p>
                          </div>
                        </div>

                        {/* Image URL text entry */}
                        <div className="space-y-1">
                          <p className="text-[8px] text-slate-500 font-mono">OR PASTE EXTERNAL URL</p>
                          <input
                            type="url"
                            value={editRoleAvatar.startsWith('data:') ? '' : editRoleAvatar}
                            onChange={(e) => setEditRoleAvatar(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-white font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRole(null);
                        }}
                        className="bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                      >
                        Discard
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Save changes to customRoles!
                          const updated = {
                            ...customRoles,
                            [editingRole]: {
                              label: editRoleLabel,
                              desc: editRoleDesc,
                              avatarUrl: editRoleAvatar || DEFAULT_ROLE_AVATARS[editingRole],
                            }
                          };
                          saveCustomRoles(updated);
                          
                          // If this edited role IS current active role, immediately modify original profile avatar!
                          if (userRole === editingRole) {
                            onModifyProfile({
                              avatarUrl: editRoleAvatar || DEFAULT_ROLE_AVATARS[editingRole],
                            });
                          }

                          setEditingRole(null);
                          setAuthNotification(`Role credentials for '${editRoleLabel}' updated and persisted.`);
                          setTimeout(() => setAuthNotification(null), 3000);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white transition cursor-pointer"
                      >
                        Keep Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard List with dynamic config and an edit pencil button */
                  <>
                    <div className="px-1.5 py-1.5 border-b border-white/5 mb-2">
                      <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#818cf8]">Select Role Permission</p>
                    </div>
                    <div className="space-y-1 max-h-80 overflow-y-auto pr-0.5">
                      {rolesWithMetadata.map(r => (
                        <div
                          key={r.role}
                          className={`group/item w-full rounded-xl transition-all flex items-center justify-between p-1 px-1.5 ${
                            userRole === r.role ? 'bg-white/10 border-l-2 border-indigo-500' : 'hover:bg-white/5'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleRoleChange(r.role)}
                            className="flex-1 text-left flex items-start gap-2.5 cursor-pointer min-w-0"
                          >
                            <img
                              src={r.avatarUrl}
                              alt={r.label}
                              className="w-7 h-7 rounded-full object-cover border border-white/10 flex-shrink-0 mt-0.5"
                            />
                            <div className="min-w-0 flex-1">
                              <p className={`text-[11px] font-semibold truncate ${userRole === r.role ? 'text-indigo-400' : 'text-white'}`}>
                                {r.label}
                              </p>
                              <p className="text-[9px] text-slate-400 leading-tight mt-0.5 truncate max-w-[170px]">{r.desc}</p>
                            </div>
                          </button>

                          {/* Edit Pencil icon */}
                          <button
                            type="button"
                            title="Edit Role Identity properties"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingRole(r.role);
                              setEditRoleLabel(r.label);
                              setEditRoleDesc(r.desc);
                              setEditRoleAvatar(r.avatarUrl);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-400 opacity-60 md:opacity-0 group-hover/item:opacity-100 transition duration-150 focus:outline-none cursor-pointer rounded-lg hover:bg-white/10 flex-shrink-0 ml-1"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
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

      {/* Sovereign Citizen Profile Customization Modal */}
      {editModalOpen && (
        <div id="profile-edit-modal-overlay" className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-xl glass-card rounded-2xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white text-md font-bold font-sans">Sovereign Citizen Profile</h3>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 mt-0.5">Identity Customization Terminal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition hover:bg-white/5 cursor-pointer focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Form */}
            <form onSubmit={handleSubmitProfile} className="space-y-5 text-xs">
              
              {/* Profile Avatar Selection */}
              <div className="space-y-2.5">
                <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">
                  Citizen Avatar Identity
                </label>
                
                {/* Visual Circle Preview with Preset pickers */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <div className="relative flex-shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="citizen-profile-file-loader"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAvatarInput(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="citizen-profile-file-loader"
                      title="Upload custom image from device"
                      className="cursor-pointer group/cam block"
                    >
                      <img
                        src={avatarInput || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                        alt="Preview"
                        className="w-16 h-16 rounded-full border-2 border-indigo-500 group-hover/cam:border-indigo-400 object-cover shadow-[0_0_12px_rgba(129,140,248,0.25)] transition duration-150"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-indigo-600 group-hover/cam:bg-indigo-500 rounded-full p-1.5 border border-[#1e293b] transition duration-150">
                        <Camera className="h-3 w-3 text-white" />
                      </div>
                    </label>
                  </div>
                  
                  <div className="w-full">
                    <p className="text-[10px] text-slate-400 uppercase font-mono mb-1.5">Preset High-Resolution Identities</p>
                    <div className="flex flex-wrap gap-2">
                      {avatarPresets.map((preset, idx) => {
                        const isSelected = avatarInput === preset.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatarInput(preset.url)}
                            title={preset.name}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition relative cursor-pointer ${
                              isSelected ? 'border-indigo-400 scale-105 shadow-[0_0_8px_rgba(129,140,248,0.4)]' : 'border-transparent hover:border-white/20'
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white stroke-[3px]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Custom URL & Device File Upload Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-mono">OR SPECIFY CUSTOM IMAGE URL</p>
                    <input
                      type="url"
                      value={avatarInput.startsWith('data:') ? '' : avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-black/30 border border-white/5 rounded-xl px-3 py-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-550"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-mono">OR LOAD LOCAL PHOTO FILE</p>
                    <input
                      type="file"
                      accept="image/*"
                      id="citizen-profile-file-loader-secondary"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAvatarInput(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="citizen-profile-file-loader-secondary"
                      className="flex items-center justify-center gap-1.5 w-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 rounded-xl px-3 py-2 text-[11px] font-bold font-mono transition cursor-pointer text-center h-[38px] mt-0.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Upload from Device
                    </label>
                  </div>
                </div>
              </div>

              {/* Grid for Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-[#0c1017] border border-white/5 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">
                    E-Mail Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="alex.rivera@etopia.org"
                    className="w-full bg-[#0c1017] border border-white/5 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Biography textarea */}
              <div className="space-y-1">
                <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">
                  Sovereign Citizen Bio
                </label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Describe your missions, social focus, or industry skills..."
                  className="w-full bg-[#0c1017] border border-white/5 rounded-xl px-3.5 py-2.5 text-white leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Dynamic Skills tags management */}
              <div className="space-y-2">
                <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">
                  Verified Skill Certifications ({skillsList.length})
                </label>
                
                {/* Inline Add mini form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    placeholder="Add certification (e.g. React, D3.js, Solar Grid Management)"
                    className="flex-1 bg-black/30 border border-white/5 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newSkillText.trim() && !skillsList.includes(newSkillText.trim())) {
                          setSkillsList(prev => [...prev, newSkillText.trim()]);
                          setNewSkillText('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSkillText.trim() && !skillsList.includes(newSkillText.trim())) {
                        setSkillsList(prev => [...prev, newSkillText.trim()]);
                        setNewSkillText('');
                      }
                    }}
                    className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 p-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center font-bold"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Displaying tag list */}
                {skillsList.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto bg-black/20 p-2.5 rounded-xl border border-white/5">
                    {skillsList.map((skill, idx) => (
                      <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 py-1 text-[10px] text-indigo-300 flex items-center gap-1.5 font-semibold font-mono">
                        {skill}
                        <button
                          type="button"
                          onClick={() => setSkillsList(prev => prev.filter((_, i) => i !== idx))}
                          className="hover:text-red-400 font-bold focus:outline-none text-[8px] cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 italic pb-0.5">No skill tokens attached to profile ledger block.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="glass-button-secondary py-2.5 px-4 rounded-xl font-bold cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="glass-button-primary py-2.5 px-5 rounded-xl font-bold cursor-pointer"
                >
                  Verify & Persist on-chain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
