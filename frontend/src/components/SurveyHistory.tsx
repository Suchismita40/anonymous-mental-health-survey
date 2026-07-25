import React, { useState } from 'react';
import { SurveyHistoryEntry } from '../types';

interface SurveyHistoryProps {
  history: SurveyHistoryEntry[];
  onSelectEntryForRecommendation?: (entry: SurveyHistoryEntry) => void;
}

export const SurveyHistory: React.FC<SurveyHistoryProps> = ({
  history,
  onSelectEntryForRecommendation,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<SurveyHistoryEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter history entries
  const filteredHistory = history.filter((entry) => {
    const matchesCategory =
      filterCategory === 'All' || entry.riskCategory === filterCategory;
    const matchesSearch =
      entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.formattedDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.txHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadProof = (entry: SurveyHistoryEntry) => {
    const proofReceipt = {
      title: 'Midnight Protocol Zero-Knowledge Survey Receipt',
      protocol: 'Midnight Compact ZK Smart Contract v4.1.1',
      surveyId: entry.id,
      timestamp: entry.timestamp,
      formattedDate: entry.formattedDate,
      privacyGuarantee:
        'Individual answers, mood/anxiety/stress scores, and wallet identities are strictly confidential and unrecorded.',
      verification: {
        compositeScore: entry.compositeScore,
        riskCategory: entry.riskCategory,
        zkProofStatus: entry.zkStatus,
        onChainConfirmation: entry.networkStatus,
        blockHeight: entry.blockHeight,
        transactionHash: entry.txHash,
        circuitVerifierKey: '0x8f3a9b1c0e7d4a2b6c8e0f1a3b5c7d9e1f3a5b7c',
      },
    };

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(proofReceipt, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `midnight_zk_proof_${entry.id.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 space-y-6 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <svg width={22} height={22} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Anonymous Survey History</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Session receipts logged locally in witness memory. No personal data, answers, or wallet identities are ever stored.
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs font-semibold text-purple-300">
          <svg width={14} height={14} className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>{history.length} Local Session{history.length === 1 ? '' : 's'} Recorded</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Risk Category Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
          {['All', 'Low Risk', 'Moderate Risk', 'High Risk'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search Survey ID or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30"
          />
          <svg width={16} height={16} className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Toast Notification */}
      {copiedId && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <svg width={16} height={16} className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Copied Survey ID <strong>{copiedId}</strong> to clipboard!</span>
        </div>
      )}

      {/* History List / Cards */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 space-y-3">
          <div className="inline-flex p-3 rounded-full bg-slate-900 text-slate-500">
            <svg width={28} height={28} className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-sm font-semibold text-slate-300">No Anonymous Sessions Found</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || filterCategory !== 'All'
              ? 'No survey entries match your current search or filter criteria.'
              : 'Complete a private survey above to automatically log your anonymous ZK proof receipt.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((entry) => {
            let badgeBg = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
            if (entry.riskCategory === 'Moderate Risk') {
              badgeBg = 'bg-amber-950/80 text-amber-300 border-amber-700/50';
            } else if (entry.riskCategory === 'High Risk') {
              badgeBg = 'bg-rose-950/80 text-rose-300 border-rose-700/50';
            }

            return (
              <div
                key={entry.id}
                className="glass-panel rounded-xl p-5 border border-slate-800/90 hover:border-purple-500/40 bg-slate-900/50 hover:bg-slate-900/80 transition-all space-y-4 group"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/50">
                      {entry.id}
                    </span>
                    <span className="text-xs text-slate-400">{entry.formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
                      {entry.riskCategory}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/40">
                      Score: {entry.compositeScore}/15
                    </span>
                  </div>
                </div>

                {/* Status Badges & Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <svg width={16} height={16} className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">ZK Proof Status</div>
                      <div className="font-medium text-emerald-400">{entry.zkStatus}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <svg width={16} height={16} className="w-4 h-4 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Ledger Height</div>
                      <div className="font-mono text-purple-300">#{entry.blockHeight}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <svg width={16} height={16} className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <div className="overflow-hidden">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Transaction Hash</div>
                      <div className="font-mono text-blue-300 truncate">{entry.txHash.slice(0, 14)}...</div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/40">
                  <div className="flex items-center gap-2">
                    {/* View Summary */}
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/50 rounded-lg transition-all flex items-center gap-1.5"
                    >
                      <svg width={14} height={14} className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Summary</span>
                    </button>

                    {/* Download Proof */}
                    <button
                      onClick={() => handleDownloadProof(entry)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all flex items-center gap-1.5"
                    >
                      <svg width={14} height={14} className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download Proof</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {onSelectEntryForRecommendation && (
                      <button
                        onClick={() => onSelectEntryForRecommendation(entry)}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 rounded-lg transition-all flex items-center gap-1"
                      >
                        <span>View Wellness Advice</span>
                        <svg width={14} height={14} className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}

                    {/* Copy Survey ID */}
                    <button
                      onClick={() => handleCopyId(entry.id)}
                      className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all flex items-center gap-1"
                      title="Copy Survey ID"
                    >
                      <svg width={14} height={14} className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy ID</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Summary Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-800 space-y-5 bg-slate-900 shadow-2xl relative">
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
            >
              <svg width={20} height={20} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <svg width={24} height={24} className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Survey Proof Summary</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedEntry.id}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Submission Date & Time</span>
                <span className="text-slate-200 font-medium">{selectedEntry.formattedDate}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Computed Risk Category</span>
                <span className="font-semibold text-purple-300">{selectedEntry.riskCategory}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Composite Risk Score</span>
                <span className="font-bold text-white text-sm">{selectedEntry.compositeScore} / 15</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">ZK Verification Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <svg width={14} height={14} className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {selectedEntry.zkStatus}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Midnight Ledger Height</span>
                <span className="font-mono text-purple-300">#{selectedEntry.blockHeight}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="text-slate-400">Transaction Hash</div>
                <div className="font-mono text-[11px] text-blue-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                  {selectedEntry.txHash}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200 text-[11px] leading-relaxed">
                🔒 <strong>Privacy Assurance:</strong> Individual score choices (Mood, Anxiety, Stress) and wallet credentials are not saved in this log or disclosed to the public ledger.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleDownloadProof(selectedEntry)}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5"
              >
                <svg width={14} height={14} className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Proof Receipt</span>
              </button>
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
