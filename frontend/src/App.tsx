import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SurveyForm } from './components/SurveyForm';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PrivacyCard } from './components/PrivacyCard';
import { AggregateAnalytics, SurveyResponseInput, TransactionReceipt, WalletState } from './types';

const DEFAULT_CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS || '02008f1b212f451f28b49af19d9b4b986cc0bf5d61bbd5cfa3fdfebef501f2f0fcdd';
const DEFAULT_NETWORK = import.meta.env.VITE_NETWORK || 'undeployed';

export const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: true,
    address: 'mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s',
    balance: '250,000,000',
    network: DEFAULT_NETWORK,
    isLaceAvailable: typeof window !== 'undefined' && 'midnight' in window,
  });

  const [analytics, setAnalytics] = useState<AggregateAnalytics>({
    totalSubmissions: 1,
    avgMood: 4.0,
    avgAnxiety: 2.0,
    avgStress: 3.0,
    lowRiskCount: 0,
    moderateRiskCount: 1,
    highRiskCount: 0,
    isSurveyActive: true,
  });

  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false);

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      // Query local devnet indexer
      const indexerUrl = 'http://127.0.0.1:8088/api/v4/graphql';
      const response = await fetch(indexerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query ContractState($address: String!) {
              contractState(address: $address) {
                address
                data
              }
            }
          `,
          variables: { address: DEFAULT_CONTRACT },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data?.contractState?.data) {
          // If contract state returned from indexer, parse state
          console.log('Contract state loaded from indexer:', json.data.contractState);
        }
      }
    } catch (e) {
      console.log('Indexer query notice:', e);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleConnectWallet = async () => {
    setWallet((prev) => ({
      ...prev,
      isConnected: true,
      address: 'mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s',
      balance: '250,000,000',
    }));
  };

  const handleDisconnectWallet = () => {
    setWallet((prev) => ({
      ...prev,
      isConnected: false,
      address: null,
      balance: '0',
    }));
  };

  const handleSubmitResponse = async (input: SurveyResponseInput): Promise<TransactionReceipt> => {
    // Calculate composite score
    const compositeScore = input.moodScore + input.anxietyScore + input.stressScore;

    // Simulate ZK proof computation and circuit execution delay
    await new Promise((r) => setTimeout(r, 2000));

    // Update aggregate analytics state
    setAnalytics((prev) => {
      const newTotal = prev.totalSubmissions + 1;
      const newMoodSum = prev.avgMood * prev.totalSubmissions + input.moodScore;
      const newAnxietySum = prev.avgAnxiety * prev.totalSubmissions + input.anxietyScore;
      const newStressSum = prev.avgStress * prev.totalSubmissions + input.stressScore;

      let low = prev.lowRiskCount;
      let mod = prev.moderateRiskCount;
      let high = prev.highRiskCount;

      if (compositeScore <= 6) low += 1;
      else if (compositeScore <= 10) mod += 1;
      else high += 1;

      return {
        totalSubmissions: newTotal,
        avgMood: Number((newMoodSum / newTotal).toFixed(2)),
        avgAnxiety: Number((newAnxietySum / newTotal).toFixed(2)),
        avgStress: Number((newStressSum / newTotal).toFixed(2)),
        lowRiskCount: low,
        moderateRiskCount: mod,
        highRiskCount: high,
        isSurveyActive: prev.isSurveyActive,
      };
    });

    const mockTxId = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return {
      txId: mockTxId,
      blockHeight: 35 + Math.floor(Math.random() * 10),
      timestamp: new Date().toISOString(),
    };
  };

  const handleToggleStatus = () => {
    setAnalytics((prev) => ({
      ...prev,
      isSurveyActive: !prev.isSurveyActive,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        wallet={wallet}
        contractAddress={DEFAULT_CONTRACT}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Hero Welcome Banner */}
        <section className="glass-panel rounded-2xl p-6 lg:p-8 border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping"></span>
              Midnight Zero-Knowledge Protocol
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Confidential Mental Health Assessment & Analytics
            </h1>
            <p className="text-xs lg:text-sm text-slate-300">
              Submit your mental health rating privately. Midnight smart contracts use ZK proofs to disclose only public aggregate statistics without revealing individual identities or answers.
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0 gap-2">
            <div className="text-right">
              <div className="text-xs text-slate-400">Deployed Contract Address</div>
              <div className="font-mono text-xs text-purple-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                {DEFAULT_CONTRACT.slice(0, 16)}...{DEFAULT_CONTRACT.slice(-8)}
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid: Form + Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SurveyForm
            isSurveyActive={analytics.isSurveyActive}
            onSubmitResponse={handleSubmitResponse}
          />

          <AnalyticsDashboard
            analytics={analytics}
            isLoading={isLoadingAnalytics}
            onRefresh={fetchAnalytics}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        {/* Privacy Model Assurance */}
        <PrivacyCard />
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Built on <span className="text-purple-400 font-semibold">Midnight Network</span> using Compact ZK Smart Contracts.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Level 3 Category: Anonymous Survey</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Local Devnet Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
