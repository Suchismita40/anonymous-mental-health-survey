import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export function calculateCompositeScore(mood: number, anxiety: number, stress: number): number {
  if ([mood, anxiety, stress].some((s) => s < 1 || s > 5)) {
    throw new Error('Score ratings must be between 1 and 5');
  }
  return mood + anxiety + stress;
}

export function classifyRiskLevel(compositeScore: number): 'Low' | 'Moderate' | 'High' {
  if (compositeScore <= 6) return 'Low';
  if (compositeScore <= 10) return 'Moderate';
  return 'High';
}

describe('Contract Assumptions & Score Rules', () => {
  it('validates scores strictly within range 1 to 5', () => {
    assert.equal(calculateCompositeScore(1, 1, 1), 3);
    assert.equal(calculateCompositeScore(5, 5, 5), 15);
    assert.throws(() => calculateCompositeScore(0, 3, 3), /Score ratings must be between 1 and 5/);
    assert.throws(() => calculateCompositeScore(4, 6, 2), /Score ratings must be between 1 and 5/);
  });

  it('correctly classifies risk categories from composite score', () => {
    assert.equal(classifyRiskLevel(3), 'Low');
    assert.equal(classifyRiskLevel(6), 'Low');
    assert.equal(classifyRiskLevel(7), 'Moderate');
    assert.equal(classifyRiskLevel(10), 'Moderate');
    assert.equal(classifyRiskLevel(11), 'High');
    assert.equal(classifyRiskLevel(15), 'High');
  });
});
