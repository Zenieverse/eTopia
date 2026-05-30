import React from 'react';
import { UserProfile } from '../types';
import {
  TrendingUp,
  Award,
  Globe,
  Plus,
} from 'lucide-react';

interface ImpactDashProps {
  profile: UserProfile;
}

export default function ImpactDash({ profile }: ImpactDashProps) {
  // Let's draw highly interactive, custom, beautiful SVG charts that look extremely professional!
  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
              Impact Measurement Engine & UN SDGs Alignment
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Real-time, audited statistics auditing the macro-economic, social, and environmental progress of eTopia's digital society.
          </p>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 px-4 py-2.5 rounded-2xl">
          <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 leading-none">MUNICIPAL IMPACT LEVEL</p>
          <p className="font-mono text-white text-md font-bold mt-1">Grade AAA <span className="text-[10px] text-emerald-400 font-semibold">• High-Efficacy</span></p>
        </div>
      </div>

      {/* Metric details cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Economic */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <p className="text-xs uppercase font-mono font-bold text-emerald-400">1. Economic Impact</p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-bold text-white font-mono">$1.2M</span>
            <span className="text-xs text-slate-500">gross income</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1 bg-slate-950/20 p-3 rounded-xl border border-slate-850">
            <li>• 142 Jobs Created on ComeShine</li>
            <li>• Average Hourly Wage: $34.50 USD</li>
            <li>• $124,500 secured in escrow contracts</li>
          </ul>
        </div>

        {/* Social */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <p className="text-xs uppercase font-mono font-bold text-sky-400">2. Social Impact</p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-bold text-white font-mono">15.4K</span>
            <span className="text-xs text-slate-500">hours recorded</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1 bg-slate-950/20 p-3 rounded-xl border border-slate-850">
            <li>• 3,450 Skilled community volunteers</li>
            <li>• 2,500 Youth internet links deployed</li>
            <li>• 12 Regional microlearning lectures certified</li>
          </ul>
        </div>

        {/* Environmental */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <p className="text-xs uppercase font-mono font-bold text-amber-400">3. Ecological Impact</p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-bold text-white font-mono">42.1T</span>
            <span className="text-xs text-slate-500">CO² saved</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1 bg-slate-950/20 p-3 rounded-xl border border-slate-850">
            <li>• SoliGrid matches active in 16 centers</li>
            <li>• 12 informal rooftop gardens treated</li>
            <li>• 2 Circular supply routing networks sync</li>
          </ul>
        </div>

      </div>

      {/* Beautiful Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Custom Pure-SVG Bar Chart for Quarterly Economic volume */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-white text-sm font-semibold border-b border-slate-800 pb-3 uppercase tracking-wider font-mono text-slate-400">
            Quarterly Volume Sourced ($ USD)
          </h3>
          
          <div className="mt-6 flex justify-between items-end h-48 px-4 relative">
            {/* Guide grid lines */}
            <div className="absolute inset-x-0 top-0 border-t border-slate-850/60 text-[9px] text-slate-500 font-mono pt-1">120K</div>
            <div className="absolute inset-x-0 top-1/3 border-t border-slate-850/60 text-[9px] text-slate-500 font-mono pt-1">80K</div>
            <div className="absolute inset-x-0 top-2/3 border-t border-slate-850/60 text-[9px] text-slate-500 font-mono pt-1">40K</div>

            {/* Custom Bar 1 */}
            <div className="flex flex-col items-center space-y-2 z-10 w-12">
              <div className="bg-emerald-500/20 border border-emerald-500 w-full rounded-t-lg transition hover:bg-emerald-500/30" style={{ height: '35%' }}></div>
              <span className="text-[10px] text-slate-400 font-mono">Q1 2025</span>
            </div>

            {/* Custom Bar 2 */}
            <div className="flex flex-col items-center space-y-2 z-10 w-12">
              <div className="bg-emerald-500/20 border border-emerald-500 w-full rounded-t-lg transition hover:bg-emerald-500/30" style={{ height: '55%' }}></div>
              <span className="text-[10px] text-slate-400 font-mono">Q2 2025</span>
            </div>

            {/* Custom Bar 3 */}
            <div className="flex flex-col items-center space-y-2 z-10 w-12">
              <div className="bg-emerald-500/20 border border-emerald-500 w-full rounded-t-lg transition hover:bg-emerald-500/30" style={{ height: '70%' }}></div>
              <span className="text-[10px] text-slate-400 font-mono">Q3 2025</span>
            </div>

            {/* Custom Bar 4 */}
            <div className="flex flex-col items-center space-y-2 z-10 w-12">
              <div className="bg-emerald-500 w-full rounded-t-lg shadow-emerald-500/10 shadow-lg" style={{ height: '90%' }}></div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Q4 2025</span>
            </div>
          </div>
        </div>

        {/* Custom Pure-SVG Line Chart representing Social volunteering hours */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-white text-sm font-semibold border-b border-slate-800 pb-3 uppercase tracking-wider font-mono text-slate-400">
            Cumulative Volunteer Hours Audits
          </h3>

          <div className="mt-6 h-48 relative">
            <svg viewBox="0 0 400 150" className="w-full h-36">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" strokeDasharray="4 4" />

              {/* Area gradient */}
              <defs>
                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M 10 140 Q 100 110, 200 80 T 390 20 L 390 140 Z"
                fill="url(#area-grad)"
              />

              {/* Smooth trend line */}
              <path
                d="M 10 140 Q 100 110, 200 80 T 390 20"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Dots on nodes */}
              <circle cx="10" cy="140" r="4.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="150" cy="100" r="4.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="280" cy="55" r="4.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="390" cy="20" r="4.5" fill="#38bdf8" />
            </svg>

            <div className="flex justify-between text-[10px] text-slate-405 font-mono px-1">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sustainable Development Goals visual targets */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-white text-sm font-semibold border-b border-slate-800 pb-3 flex items-center gap-1.5">
          <Globe className="h-4.5 w-4.5 text-emerald-400" /> Vetted UN SDG Progress Records
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          
          <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
              SDG 1
            </div>
            <h4 className="text-white font-bold text-xs mt-2">No Poverty</h4>
            <div className="w-full bg-slate-850 h-1 rounded-full overflow-hidden">
              <span className="bg-emerald-500 h-full rounded-full block" style={{ width: '65%' }}></span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">65% Vetted Progress</span>
          </div>

          <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center font-mono font-bold text-sky-400 text-sm">
              SDG 4
            </div>
            <h4 className="text-white font-bold text-xs mt-2">Quality Education</h4>
            <div className="w-full bg-slate-850 h-1 rounded-full overflow-hidden">
              <span className="bg-sky-400 h-full rounded-full block" style={{ width: '45%' }}></span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">45% Vetted Progress</span>
          </div>

          <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center font-mono font-bold text-amber-400 text-sm">
              SDG 9
            </div>
            <h4 className="text-white font-bold text-xs mt-2">Industry & Infrastr</h4>
            <div className="w-full bg-slate-850 h-1 rounded-full overflow-hidden">
              <span className="bg-amber-400 h-full rounded-full block" style={{ width: '80%' }}></span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">80% Vetted Progress</span>
          </div>

          <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/25 flex items-center justify-center font-mono font-bold text-pink-400 text-sm">
              SDG 13
            </div>
            <h4 className="text-white font-bold text-xs mt-2">Climate Action</h4>
            <div className="w-full bg-slate-850 h-1 rounded-full overflow-hidden">
              <span className="bg-pink-400 h-full rounded-full block" style={{ width: '55%' }}></span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">55% Vetted Progress</span>
          </div>

        </div>
      </div>
    </div>
  );
}
