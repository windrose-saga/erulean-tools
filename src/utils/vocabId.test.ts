import { describe, expect, it } from 'vitest';

import { isValidVocabId, normalizeVocabId } from './vocabId';

describe('normalizeVocabId', () => {
  it('upper-cases, trims, and collapses whitespace to underscores', () => {
    expect(normalizeVocabId('  fire blade ')).toBe('FIRE_BLADE');
    expect(normalizeVocabId('weapon')).toBe('WEAPON');
  });
});

describe('isValidVocabId', () => {
  it('accepts UPPER_CASE identifiers and rejects invalid ones', () => {
    expect(isValidVocabId('WEAPON')).toBe(true);
    expect(isValidVocabId('_HIDDEN')).toBe(true);
    expect(isValidVocabId('TIER_2')).toBe(true);
    expect(isValidVocabId('2COOL')).toBe(false); // leading digit
    expect(isValidVocabId('bad id')).toBe(false); // space + lower-case
    expect(isValidVocabId('')).toBe(false);
  });
});
