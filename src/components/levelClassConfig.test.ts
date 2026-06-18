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

describe('PV level-class content validation', () => {
  it('blocks non-positive point-value limits', () => {
    expect(LEVEL_CLASS_CONFIG.PV.blockOnWarning).toBe(true);
    expect(LEVEL_CLASS_CONFIG.PV.warn?.([100, 0])).toMatch(/positive/);
  });

  it('accepts positive point-value limits', () => {
    expect(LEVEL_CLASS_CONFIG.PV.warn?.([100, 250])).toBeNull();
  });
});
