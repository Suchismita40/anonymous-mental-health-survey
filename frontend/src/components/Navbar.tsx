import React from 'react';
import { WalletState } from '../types';

interface NavbarProps {
  wallet: WalletState;
  contractAddress: string;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  contractAddress,
  onConnectWallet,
  onDisconnectWallet,
}) => {
  const truncatedAddress = wallet.address
    ? `${wallet.address.slice(0, 12)}...${wallet.address.slice(-6)}`
    : '';

  const truncatedContract = contractAddress
    ? `${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}`
    : 'Not Set';

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold gradient-text tracking-tight">Anonymous Mental Health Survey</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 font-medium">
                Midnight ZK
              </span>
            </div>
            <p className="text-xs text-slate-400">Zero-Knowledge Privacy-Preserving Health Analytics</p>
          </div>
        </div>

        {/* Right: Network & Wallet Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Network Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Network:</span>
            <span className="font-semibold text-purple-300 capitalize">{wallet.network}</span>
          </div>

          {/* Contract Address Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
            <span>Contract:</span>
            <span className="font-mono text-xs text-slate-300" title={contractAddress}>
              {truncatedContract}
            </span>
          </div>

          {/* Wallet Button */}
          {wallet.isConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs font-mono text-purple-300">{truncatedAddress}</span>
                <span className="text-[10px] text-slate-400">{wallet.balance} tNIGHT</span>
              </div>
              <button
                onClick={onDisconnectWallet}
                className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-800/50 border border-slate-700/60 rounded-lg transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-lg shadow-purple-600/20 border border-purple-400/20 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Connect Lace Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
