import { describe, expect, it } from 'vitest';

import { expWarn, LEVEL_CLASS_CONFIG } from './levelClassConfig';

describe('EXP level-class content validation', () => {
  it('marks invalid EXP progressions as blocking', () => {
    expect(LEVEL_CLASS_CONFIG.EXP.blockOnWarning).toBe(true);
    expect(expWarn([0, 100, 100])).toMatch(/strictly increase/);
    expect(expWarn([-1, 100])).toMatch(/non-negative/);
  });

  it('accepts a non-negative, strictly increasing progression', () => {
    expect(expWarn([0, 100, 250])).toBeNull();
  });
});
