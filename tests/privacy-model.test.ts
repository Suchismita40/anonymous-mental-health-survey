import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export interface AggregateLedgerState {
  totalSubmissions: bigint;
  totalMoodScore: bigint;
  totalAnxietyScore: bigint;
  totalStressScore: bigint;
  lowRiskCount: bigint;
  moderateRiskCount: bigint;
  highRiskCount: bigint;
  isSurveyActive: boolean;
}

export function computeAggregateAverages(ledger: AggregateLedgerState) {
  const total = Number(ledger.totalSubmissions);
  if (total === 0) return { avgMood: 0, avgAnxiety: 0, avgStress: 0 };
  return {
    avgMood: Number((Number(ledger.totalMoodScore) / total).toFixed(2)),
    avgAnxiety: Number((Number(ledger.totalAnxietyScore) / total).toFixed(2)),
    avgStress: Number((Number(ledger.totalStressScore) / total).toFixed(2)),
  };
}

describe('Privacy Model & Disclosures', () => {
  it('does NOT expose individual survey responses in ledger state schema', () => {
    const ledgerSample: AggregateLedgerState = {
      totalSubmissions: 2n,
      totalMoodScore: 8n,
      totalAnxietyScore: 4n,
      totalStressScore: 6n,
      lowRiskCount: 1n,
      moderateRiskCount: 1n,
      highRiskCount: 0n,
      isSurveyActive: true,
    };

    const averages = computeAggregateAverages(ledgerSample);
    assert.equal(averages.avgMood, 4.0);
    assert.equal(averages.avgAnxiety, 2.0);
    assert.equal(averages.avgStress, 3.0);

    const keys = Object.keys(ledgerSample);
    assert.equal(keys.includes('individualResponses'), false);
    assert.equal(keys.includes('participantAddress'), false);
  });
});
