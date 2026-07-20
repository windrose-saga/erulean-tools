import { describe, expect, it } from 'vitest';

import { ingestActionsV2, ingestAugmentsV2 } from './useIngest';

import { Action } from '../types/action';
import { Augment } from '../types/augment';

// Terse raw builders; ingest fills the rest from the DEFAULT_* constants via lodash `merge`.
const rawAugment = (overrides: Partial<Augment>): Augment =>
  ({ guid: 'aug-1', id: 'SET', ...overrides }) as unknown as Augment;

describe('ingestAugmentsV2 SET_STAT backfill', () => {
  it('backfills set_stat_props from defaults when omitted', () => {
    const augments = ingestAugmentsV2([rawAugment({ augment_class: 'SET_STAT' })]);
    expect(augments['aug-1'].set_stat_props).toEqual({
      stat: 'PHYSICAL_DEFENSE',
      stat_value: 0,
    });
  });

  it('preserves authored set_stat_props', () => {
    const augments = ingestAugmentsV2([
      rawAugment({
        augment_class: 'SET_STAT',
        set_stat_props: { stat: 'STRENGTH', stat_value: 10 },
      }),
    ]);
    expect(augments['aug-1'].set_stat_props).toEqual({ stat: 'STRENGTH', stat_value: 10 });
  });

  // Existing records predate the field entirely, so every augment gets it regardless of class.
  it('backfills set_stat_props onto an unrelated augment class', () => {
    const augments = ingestAugmentsV2([rawAugment({ augment_class: 'FLAT_STAT' })]);
    expect(augments['aug-1'].set_stat_props).toEqual({
      stat: 'PHYSICAL_DEFENSE',
      stat_value: 0,
    });
  });
});

describe('inline SET_STAT backfill', () => {
  it('backfills a sparse inline effect on a damage action', () => {
    const actions = ingestActionsV2([
      {
        guid: 'act-1',
        id: 'ATK',
        damage_action_props: { augment_effects: [{ augment_class: 'SET_STAT' }] },
      } as unknown as Action,
    ]);
    expect(actions['act-1'].damage_action_props.augment_effects[0].set_stat_props).toEqual({
      stat: 'PHYSICAL_DEFENSE',
      stat_value: 0,
    });
  });

  it('preserves an authored inline effect on a damage action', () => {
    const actions = ingestActionsV2([
      {
        guid: 'act-1',
        id: 'ATK',
        damage_action_props: {
          augment_effects: [
            { augment_class: 'SET_STAT', set_stat_props: { stat: 'SPEED', stat_value: 3 } },
          ],
        },
      } as unknown as Action,
    ]);
    expect(actions['act-1'].damage_action_props.augment_effects[0].set_stat_props).toEqual({
      stat: 'SPEED',
      stat_value: 3,
    });
  });
});
