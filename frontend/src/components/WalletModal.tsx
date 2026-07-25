import React from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLace: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSelectLace }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-800 shadow-2xl relative space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-slate-100">Connect Midnight Wallet</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              onSelectLace();
              onClose();
            }}
            className="w-full p-4 rounded-xl glass-panel-interactive border border-purple-500/30 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm text-slate-100 group-hover:text-purple-300">Lace Wallet (Midnight)</div>
                <div className="text-xs text-slate-400">Browser extension wallet for Midnight dApps</div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Ready
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
