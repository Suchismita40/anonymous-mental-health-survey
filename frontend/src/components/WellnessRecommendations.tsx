import React, { useState, useEffect } from 'react';
import { SurveyHistoryEntry } from '../types';

interface WellnessRecommendationsProps {
  latestEntry?: SurveyHistoryEntry | null;
}

type RiskLevel = 'Low Risk' | 'Moderate Risk' | 'High Risk';

export const WellnessRecommendations: React.FC<WellnessRecommendationsProps> = ({
  latestEntry,
}) => {
  const defaultCategory: RiskLevel = latestEntry?.riskCategory || 'Moderate Risk';
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>(defaultCategory);

  // Breathing Exercise Widget State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathingTimer, setBreathingTimer] = useState<number>(4);

  useEffect(() => {
    if (latestEntry?.riskCategory) {
      setSelectedRisk(latestEntry.riskCategory);
    }
  }, [latestEntry]);

  // 4-7-8 Breathing Timer Loop
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phase
          if (breathingPhase === 'Inhale') {
            setBreathingPhase('Hold');
            return 7;
          } else if (breathingPhase === 'Hold') {
            setBreathingPhase('Exhale');
            return 8;
          } else {
            setBreathingPhase('Inhale');
            return 4;
          }
        });
      }, 1000);
    } else {
      setBreathingPhase('Inhale');
      setBreathingTimer(4);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  const [copiedHelpline, setCopiedHelpline] = useState<boolean>(false);
  const handleCopyHelpline = () => {
    navigator.clipboard.writeText('988 Suicide & Crisis Lifeline: Call or text 988 (Available 24/7)');
    setCopiedHelpline(true);
    setTimeout(() => setCopiedHelpline(false), 2500);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 space-y-6 relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <svg width={24} height={24} className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Personalised Wellness Recommendations</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Actionable wellness insights generated locally based exclusively on your ZK-proven risk index score.
            </p>
          </div>
        </div>

        {latestEntry && (
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-800/40 text-xs text-purple-300 flex items-center gap-2">
            <span>Latest Session Score:</span>
            <span className="font-bold text-white">{latestEntry.compositeScore}/15</span>
          </div>
        )}
      </div>

      {/* Mandatory Privacy Disclaimer */}
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs text-purple-200 flex items-start gap-3 shadow-inner">
        <svg width={20} height={20} className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <span className="font-bold text-purple-300">Privacy Safeguard:</span> This recommendation is generated solely from the anonymous survey score. No personal responses or identifying information are stored or revealed.
        </div>
      </div>

      {/* Risk Category Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Select Risk Profile to View Tailored Guidance:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['Low Risk', 'Moderate Risk', 'High Risk'] as RiskLevel[]).map((level) => {
            let activeStyle = 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30';
            if (level === 'Low Risk') activeStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30';
            if (level === 'Moderate Risk') activeStyle = 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30';
            if (level === 'High Risk') activeStyle = 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30';

            return (
              <button
                key={level}
                onClick={() => setSelectedRisk(level)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  selectedRisk === level
                    ? activeStyle
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{level}</span>
                {latestEntry?.riskCategory === level && (
                  <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-full">Your Result</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Specific Content */}
      {selectedRisk === 'Low Risk' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-emerald-300">Composite Score Range: 3 to 6 (Optimal Well-being)</span>
            </div>
            <span className="text-emerald-400 font-medium">Low Risk Level</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
                <svg width={20} height={20} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-white">Maintain Healthy Sleep Habits</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aim for 7–9 hours of restful sleep every night. Maintain a consistent sleep schedule and limit screen exposure 30 minutes before bedtime.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
                <svg width={20} height={20} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-white">Continue Regular Exercise</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Engage in 30 minutes of moderate aerobic movement or outdoor walks daily. Regular physical activity sustains endorphin levels and physical vitality.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
                <svg width={20} height={20} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-white">Practice Daily Mindfulness</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spend 5–10 minutes on gratitude reflection or quiet meditation each morning to preserve emotional resilience and mental clarity.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedRisk === 'Moderate Risk' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-bold text-amber-300">Composite Score Range: 7 to 10 (Elevated Stress / Anxiety)</span>
            </div>
            <span className="text-amber-400 font-medium">Moderate Risk Level</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interactive Breathing Tool Card */}
            <div className="glass-panel p-5 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-slate-900 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <svg width={18} height={18} className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Interactive 4-7-8 Guided Breathing</span>
                </h4>
                <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                  Calm Nervous System
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Inhale through your nose for 4s, hold for 7s, and exhale slowly for 8s to quickly reduce physiological anxiety.
              </p>

              {/* Breathing Circle Widget */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <div
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-1000 ${
                    !isBreathingActive
                      ? 'border-slate-700 bg-slate-900 text-slate-400'
                      : breathingPhase === 'Inhale'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-110 shadow-lg shadow-amber-500/20'
                      : breathingPhase === 'Hold'
                      ? 'border-purple-400 bg-purple-500/20 text-purple-300 scale-100'
                      : 'border-emerald-400 bg-emerald-500/20 text-emerald-300 scale-90'
                  }`}
                >
                  <span className="text-xs font-semibold">{isBreathingActive ? breathingPhase : 'Ready'}</span>
                  <span className="text-lg font-bold">{isBreathingActive ? `${breathingTimer}s` : '4-7-8'}</span>
                </div>

                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isBreathingActive
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900'
                      : 'bg-amber-600 text-white hover:bg-amber-500 shadow-md shadow-amber-600/30'
                  }`}
                >
                  {isBreathingActive ? 'Stop Exercise' : 'Start Breathing Exercise'}
                </button>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-3">
              <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🧘 Meditation & Muscle Relaxation</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Try 10-minute guided meditation focusing on body scans and muscle tension release to relieve accumulated mental strain.
                </p>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>💬 Connect with Trusted Support</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Reach out to trusted friends, family members, or peers to share your feelings in a safe, comfortable setting.
                </p>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>👨‍⚕️ Consider Professional Consultation</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Schedule a preliminary check-in with a mental health counselor or wellbeing coach to discuss preventive coping strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRisk === 'High Risk' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-bold text-rose-300">Composite Score Range: 11 to 15 (High Distress Level)</span>
            </div>
            <span className="text-rose-400 font-medium">High Risk Level</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Professional Healthcare Action Card */}
            <div className="glass-panel p-5 rounded-xl border border-rose-500/40 bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950 space-y-3">
              <div className="flex items-center gap-2 text-rose-300">
                <svg width={20} height={20} className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h4 className="text-sm font-bold text-white">Seek Professional Mental Health Support</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Your survey score indicates elevated psychological distress. We strongly encourage reaching out to a licensed professional, clinical psychologist, or healthcare provider for tailored guidance.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-rose-300">Immediate Crisis & Helpline Resources:</div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>• <strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988 (Available 24/7, Toll-Free)</div>
                  <div>• <strong>Crisis Text Line:</strong> Text HOME to 741741</div>
                  <div>• <strong>International Resources:</strong> Contact your local emergency service or hospital.</div>
                </div>

                <button
                  onClick={handleCopyHelpline}
                  className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60 hover:bg-rose-900 transition-all flex items-center justify-center gap-1.5"
                >
                  <svg width={14} height={14} className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{copiedHelpline ? 'Copied Helpline Details!' : 'Copy Helpline Info'}</span>
                </button>
              </div>
            </div>

            {/* Immediate Grounding Self-Care Card */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <svg width={18} height={18} className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Immediate 5-4-3-2-1 Sensory Grounding Technique</span>
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed">
                When overwhelmed, engage your physical senses to ground yourself back in the present moment:
              </p>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                  👀 <strong>5 Things you see:</strong> Look around and acknowledge 5 objects near you.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                  🖐️ <strong>4 Things you feel:</strong> Touch your feet on the floor, clothing, or a surface.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                  👂 <strong>3 Things you hear:</strong> Listen for subtle background sounds or room ambiance.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                  👃 <strong>2 Things you smell:</strong> Notice scents in the air or your surroundings.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                  👅 <strong>1 Thing you taste:</strong> Focus on a sip of water or current taste.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
