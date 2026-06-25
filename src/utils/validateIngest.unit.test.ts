import { describe, expect, it } from 'vitest';

import { validateIngest } from './validateIngest';

import { DEFAULT_UNIT } from '../constants/unit';
import { Unit } from '../types/unit';

const unitWithGeneratorLevel = (value: unknown): Unit =>
  ({
    ...DEFAULT_UNIT,
    guid: 'unit-guid',
    id: 'UNIT',
    required_generator_level: value,
  }) as unknown as Unit;

const hasGeneratorLevelError = (value: unknown): boolean => {
  const errors = validateIngest({ 'unit-guid': unitWithGeneratorLevel(value) }, {}, {});
  return errors.some((error) => error.message.includes('invalid required_generator_level'));
};

describe('required_generator_level ingest validation', () => {
  // Value-based: real numbers and non-empty numeric strings (game-data.json persists
  // numbers as strings) whose value is a non-negative integer are accepted, so '1.0' passes.
  it.each([0, 5, '0', '1.0'])('accepts non-negative integer value %p', (value) => {
    expect(hasGeneratorLevelError(value)).toBe(false);
  });

  it.each(['', '   ', null, false, '1.5', -1, 'abc'])('rejects invalid value %p', (value) => {
    expect(hasGeneratorLevelError(value)).toBe(true);
  });
});
