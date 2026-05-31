import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Code,
  Rocket,
  Globe,
  Shuffle,
  GraduationCap,
  TrendingUp,
  Vote,
  MessageSquareCode,
  HeartHandshake,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
}

export default function Sidebar({ activeTab, setActiveTab, userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'hub', label: 'eTopia Hub', icon: LayoutDashboard, category: 'Core' },
    { id: 'idecide', label: 'I-Decide AI', icon: MessageSquareCode, category: 'Social Track', badge: 'AI' },
    { id: 'challenges', label: 'Global Challenges', icon: Globe, category: 'Social Track' },
    { id: 'exchange', label: 'Resource Exchange', icon: Shuffle, category: 'Social Track' },
    { id: 'help', label: 'Help Centers', icon: HeartHandshake, category: 'Social Track' },
    { id: 'behavioral', label: 'Behavioral Ledger', icon: ShieldCheck, category: 'Social Track' },
    { id: 'marketplace', label: 'ComeShine Talent', icon: Briefcase, category: 'Commercial' },
    { id: 'project', label: 'ComAct Projects', icon: Code, category: 'Commercial' },
    { id: 'incubator', label: 'Startup Incubator', icon: Rocket, category: 'Commercial' },
    { id: 'academy', label: 'Skills Academy', icon: GraduationCap, category: 'Ecosystem' },
    { id: 'impact', label: 'Impact Analytics', icon: TrendingUp, category: 'Ecosystem' },
    { id: 'governance', label: 'Governance Ledger', icon: Vote, category: 'Ecosystem' },
  ];

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden glass-header border-b border-white/5 h-16 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 p-1.5 rounded-lg font-bold tracking-tight shadow-[0_0_12px_rgba(129,140,248,0.2)]">eT</div>
          <span className="font-bold text-lg text-white font-sans tracking-wide">eTopia</span>
          <span className="text-[10px] text-indigo-300 font-sans font-medium px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 ml-1.5 whitespace-nowrap">For All & By All</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-white focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 transform md:translate-x-0 md:static md:w-68 glass-sidebar flex flex-col h-full ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding */}
        <div className="hidden md:flex items-center space-x-3 px-6 h-18 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-indigo-400 text-base shadow-[0_0_12px_rgba(129,140,248,0.15)]">
            eT
          </div>
          <div>
            <div className="font-bold text-white text-md tracking-wider flex items-center gap-1.5 flex-wrap">
              <span className="text-glass-indigo">eTopia</span>
              <span className="text-[10px] text-indigo-400 font-sans font-medium px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 leading-none whitespace-nowrap">For All & By All</span>
              <Sparkles className="h-3 w-3 text-indigo-400 fill-indigo-400" />
            </div>
            <div className="text-[10px] text-slate-400 tracking-wide uppercase font-mono font-bold leading-none mt-1">
              Digital Civ Platform
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {categories.map(category => (
            <div key={category} className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#818cf8]/70 px-3">
                {category}
              </span>
              <div className="space-y-0.5 mt-1">
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`sidebar-item-${item.id}`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${
                          isActive
                            ? 'bg-white/10 text-white border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md font-semibold'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="bg-indigo-500/20 text-indigo-300 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        {/* Current Role Guard */}
        <div className="p-4 bg-white/[0.02] border-t border-white/5">
          <div className="flex items-center space-x-3 px-2 py-1.5 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></div>
            <div>
              <p className="text-[11px] font-bold uppercase font-mono tracking-widest text-indigo-400/70 leading-none">
                Active System View
              </p>
              <p className="text-xs font-semibold text-slate-300 mt-1 capitalize">
                {userRole.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-20 md:hidden"
        ></div>
      )}
    </>
  );
}
