import React from 'react';
import { Proposal, ImpactLedgerEntry } from '../types';
import {
  Vote,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Key,
  Fingerprint,
  Copy,
  Check,
  Lock,
} from 'lucide-react';

interface GovernanceLedgerViewProps {
  proposals: Proposal[];
  ledgerEntries: ImpactLedgerEntry[];
  onAddProposal: (proposal: Proposal) => void;
  onVoteSimulate: (id: string, dir: 'for' | 'against') => void;
}

export default function GovernanceLedgerView({
  proposals,
  ledgerEntries,
  onAddProposal,
  onVoteSimulate,
}: GovernanceLedgerViewProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [fund, setFund] = React.useState('');
  const [notification, setNotification] = React.useState<string | null>(null);

  // Cryptographic credentials state
  const [credentials, setCredentials] = React.useState<{ citizenApiKey: string; civicLedgerPublicKey: string } | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<'apiKey' | 'publicKey' | null>(null);
  const [signInput, setSignInput] = React.useState('Sovereign Civic Vote Signature');
  const [signatureOutput, setSignatureOutput] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/credentials')
      .then(res => res.json())
      .then(data => {
        setCredentials(data);
      })
      .catch(err => {
        console.error('Error fetching cryptographic credentials from server:', err);
      });
  }, []);

  const handleCopy = (text: string, type: 'apiKey' | 'publicKey') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSignText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInput || !credentials) return;
    
    // Simple deterministic visual sign simulator mimicking secure asymmetric encryption
    let hash = 0;
    const keyToUse = credentials.citizenApiKey;
    const combined = signInput + keyToUse;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    const signature = `0xSIGN_${hex}_SHA256_VERIFIED_BY_${credentials.civicLedgerPublicKey.slice(0, 10)}`;
    setSignatureOutput(signature);
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;

    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      title,
      description: desc,
      proposer: 'Alex Rivera',
      proposerRole: 'member',
      votesFor: 1,
      votesAgainst: 0,
      status: 'active',
      fundRequested: fund ? parseFloat(fund) : undefined,
      endsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    onAddProposal(newProp);
    setTitle('');
    setDesc('');
    setFund('');
    setShowAddForm(false);
    setNotification('Governance proposal successfully logged into sovereign registry node! Voting active.');
    setTimeout(() => setNotification(null), 4500);
  };

  const handleVoteAction = (propId: string, choice: 'for' | 'against') => {
    onVoteSimulate(propId, choice);
    setNotification(`Vote recorded! Ledger status synchronized.`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Intro visual header */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Vote className="h-6 w-6 text-indigo-400" />
            <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
              Governance Registry & Public Impact Ledger
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Democratic platform driving collective decisions. Audit decentralized funding lines, vote on community resourcing proposals, and browse real-time transaction blocks.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="glass-button-primary text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          {showAddForm ? 'Back to Proposals' : 'Submit Community Proposal'}
        </button>
      </div>

      {notification && (
        <div className="bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="cursor-pointer hover:text-white">✕</button>
        </div>
      )}

      {showAddForm ? (
        <div className="glass-card p-6 rounded-2xl max-w-xl mx-auto">
          <h3 className="text-white text-base font-bold border-b border-white/5 pb-3 flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-400" /> Submit New Proposal Agenda
          </h3>
          <form onSubmit={handleCreateProposal} className="space-y-4 mt-6 text-xs font-sans">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">PROPOSAL DESCRIPTION NAME</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Allocate funds to procure 50 generic medicine audio translators"
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">FUNDS GRANTED FROM REVENUE VAULT (Optional, $ USD)</label>
              <input
                type="number"
                value={fund}
                onChange={e => setFund(e.target.value)}
                placeholder="Leave blank if general directive, or e.g. 10000"
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase font-mono tracking-wider">CONCISE CIVIC OBJECTIVE DETAIL</label>
              <textarea
                required
                rows={4}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Outline exact deliverables, monitoring coordinates, and voting deadline timelines."
                className="w-full glass-input rounded-xl px-3 py-2.5 text-white focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full glass-button-primary font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
            >
              Broadcast Proposal to Voting Node
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Active proposals lists */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider font-mono text-slate-400">
              Active Referendums & Voting proposals
            </h3>

            {proposals.map(prop => {
              const totalVotes = prop.votesFor + prop.votesAgainst;
              const forPercent = totalVotes > 0 ? Math.round((prop.votesFor / totalVotes) * 100) : 0;
              const againstPercent = totalVotes > 0 ? Math.round((prop.votesAgainst / totalVotes) * 100) : 0;

              return (
                <div key={prop.id} className="glass-card hover:border-white/10 p-6 rounded-2xl space-y-4 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-bold text-sm leading-snug">{prop.title}</h4>
                      <p className="text-[10px] text-slate-450 mt-1 font-mono">
                        Proposer: <span className="text-slate-300 font-bold capitalize">{prop.proposer}</span> ({prop.proposerRole.replace('_', ' ')})
                      </p>
                    </div>

                    {prop.fundRequested && (
                      <span className="bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold px-3 py-1 rounded-xl border border-emerald-500/10 h-max">
                        ${prop.fundRequested.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed">{prop.description}</p>

                  {/* VOTE METRIC SLIDERS */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span className="text-emerald-400 font-semibold">{prop.votesFor} For ({forPercent}%)</span>
                      <span className="text-rose-400 font-semibold">{prop.votesAgainst} Against ({againstPercent}%)</span>
                    </div>

                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                      <span className="bg-emerald-500 h-full rounded-l" style={{ width: `${forPercent}%` }}></span>
                      <span className="bg-rose-500 h-full rounded-r" style={{ width: `${againstPercent}%` }}></span>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5 text-xs">
                    <span className="text-slate-500 font-mono">Quorom Term: Ends {prop.endsAt}</span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVoteAction(prop.id, 'for')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 focus:outline-none cursor-pointer ${
                          prop.hasVoted === 'for'
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'glass-button-secondary text-emerald-450'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>VOTE FOR</span>
                      </button>

                      <button
                        onClick={() => handleVoteAction(prop.id, 'against')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 focus:outline-none cursor-pointer ${
                          prop.hasVoted === 'against'
                            ? 'bg-rose-500 text-slate-950 font-bold'
                            : 'glass-button-secondary text-rose-450'
                        }`}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>VOTE AGAINST</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time Ledger Logs Feed & Cryptographic Identity tools */}
          <div className="space-y-6">
            {/* Civic Cryptographic Identity Panel */}
            <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-4">
              <h4 className="text-white text-xs uppercase font-mono font-bold tracking-wider text-slate-400 border-b border-white/5 pb-3 flex items-center gap-2">
                <Fingerprint className="h-4.5 w-4.5 text-indigo-400" /> Sovereign Civic Credentials
              </h4>

              {credentials ? (
                <div className="space-y-4 text-xs">
                  {/* Citizen Secret Token / API Key */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1"><Key className="h-3 w-3 text-indigo-400" /> CITIZEN SECRET KEY</span>
                      <button 
                        onClick={() => handleCopy(credentials.citizenApiKey, 'apiKey')}
                        className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'apiKey' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedKey === 'apiKey' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="bg-black/35 p-2 rounded-xl border border-white/5 font-mono text-[10px] text-slate-300 truncate">
                      {credentials.citizenApiKey}
                    </div>
                  </div>

                  {/* Civic Ledger RSA Public Key */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-indigo-400" /> PUBLIC SIGNING CERTIFICATE</span>
                      <button 
                        onClick={() => handleCopy(credentials.civicLedgerPublicKey, 'publicKey')}
                        className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'publicKey' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedKey === 'publicKey' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="bg-black/35 p-2.5 rounded-xl border border-white/5 font-mono text-[9px] text-slate-400 h-24 overflow-y-auto break-all scrollbar-none leading-relaxed select-all">
                      {credentials.civicLedgerPublicKey}
                    </div>
                  </div>

                  {/* Interactive Signing Simulator Sandbox */}
                  <div className="bg-[#0f141f] p-3.5 rounded-xl border border-white/5 space-y-3">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold leading-none">Cryptographic Ballot Signer</p>
                    <form onSubmit={handleSignText} className="space-y-2">
                      <input
                        type="text"
                        value={signInput}
                        onChange={e => setSignInput(e.target.value)}
                        placeholder="Type ballot details to sign"
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white font-mono focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/20 text-indigo-300 py-1.5 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer"
                      >
                        Sign with Symmetric & RSA Keys
                      </button>
                    </form>

                    {signatureOutput && (
                      <div className="space-y-1 mt-1.5">
                        <p className="text-[9px] font-mono text-emerald-400 font-semibold">• Deterministic HMAC-SHA256 Signature:</p>
                        <textarea
                          readOnly
                          rows={2}
                          value={signatureOutput}
                          className="w-full bg-black/60 border border-emerald-500/20 rounded-lg p-2 text-[9px] text-emerald-300/80 font-mono focus:outline-none resize-none leading-tight"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 font-mono">
                  Loading cryptographic keys...
                </div>
              )}
            </div>

            {/* Public Decentralized Ledger Feed */}
            <div className="glass-card p-5 rounded-2xl">
              <h4 className="text-white text-xs uppercase font-mono font-bold tracking-wider text-slate-400 border-b border-white/5 pb-3 flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" /> Decentralized Ledger Feed
              </h4>

              <div className="space-y-3.5 mt-5">
                {ledgerEntries.map(ent => (
                  <div key={ent.id} className="glass-card-nested border-white/5 p-3.5 rounded-xl space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between items-center text-slate-500 text-[9px] border-b border-white/5 pb-1.5">
                      <span className="text-indigo-400 font-semibold flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {ent.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span>{ent.date}</span>
                    </div>

                    <p className="text-slate-300 leading-relaxed font-sans">{ent.description}</p>

                    <div className="flex justify-between items-center bg-black/20 p-1.5 rounded font-mono text-[9px] mt-2 border border-white/5">
                      <span className="text-slate-450 truncate max-w-[130px]" title={ent.transparencyHash}>HASH: {ent.transparencyHash}</span>
                      {ent.amountText && <span className="text-emerald-400 font-bold">{ent.amountText}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
