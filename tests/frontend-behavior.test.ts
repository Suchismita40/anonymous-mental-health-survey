import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export function getRiskBadgeCategory(score: number): { category: string; color: string } {
  if (score <= 6) return { category: 'Low Risk', color: 'emerald' };
  if (score <= 10) return { category: 'Moderate Risk', color: 'amber' };
  return { category: 'High Risk', color: 'rose' };
}

export function validateRatingInput(mood: number, anxiety: number, stress: number): boolean {
  return [mood, anxiety, stress].every((v) => Number.isInteger(v) && v >= 1 && v <= 5);
}

describe('Frontend Behavior & UI Logic', () => {
  it('assigns correct risk badge categories and styling classes', () => {
    assert.deepEqual(getRiskBadgeCategory(3), { category: 'Low Risk', color: 'emerald' });
    assert.deepEqual(getRiskBadgeCategory(6), { category: 'Low Risk', color: 'emerald' });
    assert.deepEqual(getRiskBadgeCategory(8), { category: 'Moderate Risk', color: 'amber' });
    assert.deepEqual(getRiskBadgeCategory(12), { category: 'High Risk', color: 'rose' });
  });

  it('validates user slider inputs before transaction construction', () => {
    assert.equal(validateRatingInput(3, 4, 2), true);
    assert.equal(validateRatingInput(0, 4, 2), false);
    assert.equal(validateRatingInput(3, 6, 2), false);
    assert.equal(validateRatingInput(3.5, 4, 2), false);
  });
});
