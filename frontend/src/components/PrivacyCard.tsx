import React from 'react';

export const PrivacyCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
        <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/50 text-purple-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Midnight Privacy Model</h2>
          <p className="text-xs text-slate-400">Zero-Knowledge cryptographic guarantees for participant confidentiality.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* What Observers Learn */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>What Observers Learn (Public)</span>
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
            <li>Total count of survey responses (`totalSubmissions`).</li>
            <li>Cumulative sums of scores for average calculation.</li>
            <li>Category distribution tallies (Low, Moderate, High).</li>
            <li>Current survey status (Open / Closed).</li>
          </ul>
        </div>

        {/* What Observers Cannot Learn */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.682-.743c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            <span>What Remains 100% Private</span>
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
            <li>Individual rating scores (Mood, Anxiety, Stress).</li>
            <li>Participant identity / wallet mapping.</li>
            <li>Individual composite scores.</li>
            <li>Local private witness data.</li>
          </ul>
        </div>

        {/* Deliberate Disclosures */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Deliberate ZK Disclosures</span>
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
            <li>Validity assertion (all ratings must be 1..5).</li>
            <li>Aggregate sum incrementation.</li>
            <li>Risk category bin incrementation (+1 to low/mod/high).</li>
            <li>`disclose()` used strictly for circuit result commitment.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
