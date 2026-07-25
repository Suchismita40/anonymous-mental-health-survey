import React, { useState } from 'react';
import { SurveyResponseInput, TransactionReceipt } from '../types';

interface SurveyFormProps {
  isSurveyActive: boolean;
  onSubmitResponse: (input: SurveyResponseInput) => Promise<TransactionReceipt>;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ isSurveyActive, onSubmitResponse }) => {
  const [mood, setMood] = useState<number>(3);
  const [anxiety, setAnxiety] = useState<number>(2);
  const [stress, setStress] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittingStep, setSubmittingStep] = useState<string>('');
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const compositeScore = mood + anxiety + stress;

  let riskCategory = 'Low Risk';
  let riskBadgeColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
  if (compositeScore >= 7 && compositeScore <= 10) {
    riskCategory = 'Moderate Risk';
    riskBadgeColor = 'bg-amber-950/80 text-amber-300 border-amber-700/50';
  } else if (compositeScore > 10) {
    riskCategory = 'High Risk';
    riskBadgeColor = 'bg-rose-950/80 text-rose-300 border-rose-700/50';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setReceipt(null);
    setIsSubmitting(true);

    try {
      setSubmittingStep('Constructing local ZK witness & private state...');
      await new Promise((r) => setTimeout(r, 600));

      setSubmittingStep('Generating Zero-Knowledge proof with proof-server...');
      const result = await onSubmitResponse({ moodScore: mood, anxietyScore: anxiety, stressScore: stress });

      setReceipt(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit response');
    } finally {
      setIsSubmitting(false);
      setSubmittingStep('');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 relative overflow-hidden border border-slate-800">
      {/* Background Decorative Glow */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Submit Survey Response</h2>
          <p className="text-xs text-slate-400 mt-1">
            Your scores remain private. Zero-Knowledge proofs update aggregate public counts on-chain.
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${riskBadgeColor}`}>
          Computed Category: {riskCategory} ({compositeScore}/15)
        </div>
      </div>

      {!isSurveyActive && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>The survey is currently closed by administration. Submissions are temporarily paused.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating 1: Mood */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <label className="font-semibold text-slate-200">1. Mood Rating</label>
            <span className="text-xs font-medium text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-800/40">
              Score: {mood} / 5
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setMood(val)}
                className={`py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                  mood === val
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {val} {val === 1 ? '(Poor)' : val === 5 ? '(Great)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Rating 2: Anxiety */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <label className="font-semibold text-slate-200">2. Anxiety Level</label>
            <span className="text-xs font-medium text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/40">
              Score: {anxiety} / 5
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setAnxiety(val)}
                className={`py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                  anxiety === val
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {val} {val === 1 ? '(Minimal)' : val === 5 ? '(Severe)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Rating 3: Stress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <label className="font-semibold text-slate-200">3. Stress Level</label>
            <span className="text-xs font-medium text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/40">
              Score: {stress} / 5
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setStress(val)}
                className={`py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                  stress === val
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {val} {val === 1 ? '(Minimal)' : val === 5 ? '(High)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-200/90 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <span className="font-semibold text-purple-300">Privacy Guarantee:</span> Your scores ({mood}, {anxiety}, {stress}) are executed inside a local Compact ZK circuit. The blockchain only receives a cryptographic proof that updates aggregate statistics.
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isSurveyActive || isSubmitting}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            !isSurveyActive
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : isSubmitting
              ? 'bg-purple-900/60 border border-purple-500/40 text-purple-300 cursor-wait'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-purple-600/25 hover:shadow-purple-600/40'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin text-purple-300" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{submittingStep || 'Generating ZK Proof & Submitting...'}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Submit Anonymous Response</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-3">
          <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Receipt Banner */}
      {receipt && (
        <div className="mt-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Response Proven & Committed On-Chain!</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-400">Tx Hash: </span>
              <span className="font-mono text-[11px] text-emerald-300">{receipt.txId.slice(0, 16)}...</span>
            </div>
            <div>
              <span className="text-slate-400">Block Height: </span>
              <span className="font-mono text-emerald-300">#{receipt.blockHeight}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
