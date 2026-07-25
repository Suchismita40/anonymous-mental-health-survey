import React from 'react';
import { AggregateAnalytics } from '../types';

interface AnalyticsDashboardProps {
  analytics: AggregateAnalytics;
  isLoading: boolean;
  onRefresh: () => void;
  onToggleStatus?: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  isLoading,
  onRefresh,
  onToggleStatus,
}) => {
  const total = analytics.totalSubmissions;
  const lowPct = total > 0 ? ((analytics.lowRiskCount / total) * 100).toFixed(1) : '0.0';
  const modPct = total > 0 ? ((analytics.moderateRiskCount / total) * 100).toFixed(1) : '0.0';
  const highPct = total > 0 ? ((analytics.highRiskCount / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">Public Ledger Analytics</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                analytics.isSurveyActive
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                  : 'bg-rose-950/80 text-rose-300 border-rose-700/50'
              }`}
            >
              {analytics.isSurveyActive ? '🟢 OPEN' : '🔴 CLOSED'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time aggregate data queried directly from the Midnight GraphQL Indexer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onToggleStatus && (
            <button
              onClick={onToggleStatus}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
            >
              Toggle Survey {analytics.isSurveyActive ? 'Close' : 'Open'}
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-purple-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
            title="Refresh Analytics"
          >
            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Submissions Card */}
        <div className="glass-panel p-4 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-slate-900">
          <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Total Submissions</span>
          <div className="text-3xl font-extrabold text-white mt-1">{analytics.totalSubmissions}</div>
          <span className="text-[10px] text-purple-400/80">Anonymous ZK proofs</span>
        </div>

        {/* Avg Mood Card */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Avg Mood Rating</span>
          <div className="text-2xl font-bold text-purple-300 mt-1">{analytics.avgMood} <span className="text-xs text-slate-500 font-normal">/ 5.0</span></div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${(analytics.avgMood / 5) * 100}%` }}></div>
          </div>
        </div>

        {/* Avg Anxiety Card */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Avg Anxiety Level</span>
          <div className="text-2xl font-bold text-blue-300 mt-1">{analytics.avgAnxiety} <span className="text-xs text-slate-500 font-normal">/ 5.0</span></div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${(analytics.avgAnxiety / 5) * 100}%` }}></div>
          </div>
        </div>

        {/* Avg Stress Card */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Avg Stress Level</span>
          <div className="text-2xl font-bold text-indigo-300 mt-1">{analytics.avgStress} <span className="text-xs text-slate-500 font-normal">/ 5.0</span></div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${(analytics.avgStress / 5) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Risk Category Breakdown Progress Bars */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-slate-200">Risk Category Distribution</h3>

        {/* Low Risk Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-emerald-400">Low Risk (Score 3 - 6)</span>
            <span className="text-slate-300 font-mono">{analytics.lowRiskCount} ({lowPct}%)</span>
          </div>
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full transition-all duration-500" style={{ width: `${lowPct}%` }}></div>
          </div>
        </div>

        {/* Moderate Risk Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-amber-400">Moderate Risk (Score 7 - 10)</span>
            <span className="text-slate-300 font-mono">{analytics.moderateRiskCount} ({modPct}%)</span>
          </div>
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full transition-all duration-500" style={{ width: `${modPct}%` }}></div>
          </div>
        </div>

        {/* High Risk Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-rose-400">High Risk (Score 11 - 15)</span>
            <span className="text-slate-300 font-mono">{analytics.highRiskCount} ({highPct}%)</span>
          </div>
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-rose-600 to-pink-500 h-full transition-all duration-500" style={{ width: `${highPct}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
