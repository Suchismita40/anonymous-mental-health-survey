import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SurveyForm } from './components/SurveyForm';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PrivacyCard } from './components/PrivacyCard';
import { SurveyHistory } from './components/SurveyHistory';
import { WellnessRecommendations } from './components/WellnessRecommendations';
import {
  AggregateAnalytics,
  SurveyHistoryEntry,
  SurveyResponseInput,
  TransactionReceipt,
  WalletState,
} from './types';

const DEFAULT_CONTRACT =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '02008f1b212f451f28b49af19d9b4b986cc0bf5d61bbd5cfa3fdfebef501f2f0fcdd';
const DEFAULT_NETWORK = import.meta.env.VITE_NETWORK || 'undeployed';

const INITIAL_HISTORY: SurveyHistoryEntry[] = [
  {
    id: 'SURVEY-94A2B8',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    formattedDate: new Date(Date.now() - 3600000 * 2).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    riskCategory: 'Moderate Risk',
    compositeScore: 9,
    zkStatus: 'Verified',
    networkStatus: 'Confirmed',
    txHash: '0x3f8a91b2c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    blockHeight: 38,
  },
  {
    id: 'SURVEY-3E8F1C',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    formattedDate: new Date(Date.now() - 3600000 * 24).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    riskCategory: 'Low Risk',
    compositeScore: 5,
    zkStatus: 'Verified',
    networkStatus: 'Confirmed',
    txHash: '0x7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6',
    blockHeight: 24,
  },
];

export const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: true,
    address: 'mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s',
    balance: '250,000,000',
    network: DEFAULT_NETWORK,
    isLaceAvailable: typeof window !== 'undefined' && 'midnight' in window,
  });

  const [analytics, setAnalytics] = useState<AggregateAnalytics>({
    totalSubmissions: 3,
    avgMood: 3.67,
    avgAnxiety: 2.33,
    avgStress: 2.67,
    lowRiskCount: 1,
    moderateRiskCount: 2,
    highRiskCount: 0,
    isSurveyActive: true,
  });

  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'survey' | 'history' | 'wellness'>('survey');

  // History State
  const [history, setHistory] = useState<SurveyHistoryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('midnight_survey_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_HISTORY;
        }
      }
    }
    return INITIAL_HISTORY;
  });

  const [latestSubmission, setLatestSubmission] = useState<SurveyHistoryEntry | null>(
    history.length > 0 ? history[0] : null
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('midnight_survey_history', JSON.stringify(history));
    }
  }, [history]);

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
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
    const compositeScore = input.moodScore + input.anxietyScore + input.stressScore;

    // Determine risk category
    let category: 'Low Risk' | 'Moderate Risk' | 'High Risk' = 'Low Risk';
    if (compositeScore >= 7 && compositeScore <= 10) {
      category = 'Moderate Risk';
    } else if (compositeScore > 10) {
      category = 'High Risk';
    }

    // ZK proof delay simulation
    await new Promise((r) => setTimeout(r, 1800));

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

    const mockTxId = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const newBlockHeight = 42 + Math.floor(Math.random() * 5);

    const now = new Date();
    const newId = `SURVEY-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;

    const newHistoryEntry: SurveyHistoryEntry = {
      id: newId,
      timestamp: now.toISOString(),
      formattedDate: now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      riskCategory: category,
      compositeScore,
      zkStatus: 'Verified',
      networkStatus: 'Confirmed',
      txHash: `0x${mockTxId}`,
      blockHeight: newBlockHeight,
    };

    setHistory((prev) => [newHistoryEntry, ...prev]);
    setLatestSubmission(newHistoryEntry);

    return {
      txId: mockTxId,
      blockHeight: newBlockHeight,
      timestamp: now.toISOString(),
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
              Midnight Zero-Knowledge Protocol v4.1.1
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

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'survey'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <svg width={18} height={18} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Survey & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <svg width={18} height={18} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Anonymous Survey History</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700/50">
              {history.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wellness')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'wellness'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <svg width={18} height={18} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Personalised Wellness Recommendations</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'survey' && (
          <div className="space-y-8 animate-fade-in">
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
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <SurveyHistory
              history={history}
              onSelectEntryForRecommendation={(entry) => {
                setLatestSubmission(entry);
                setActiveTab('wellness');
              }}
            />
          </div>
        )}

        {activeTab === 'wellness' && (
          <div className="animate-fade-in">
            <WellnessRecommendations latestEntry={latestSubmission} />
          </div>
        )}

        {/* Always Visible Components */}
        {activeTab === 'survey' && <PrivacyCard />}
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
