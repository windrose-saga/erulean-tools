import { describe, expect, it } from 'vitest';

import { ingestActionsV2, ingestAugmentsV2, ingestItemsV2 } from './useIngest';

import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { Item } from '../types/item';

// Terse raw builders; ingest fills the rest from the DEFAULT_* constants via lodash `merge`.
const rawAugment = (overrides: Partial<Augment>): Augment =>
  ({ guid: 'aug-1', id: 'MANA', ...overrides }) as unknown as Augment;

describe('ingestAugmentsV2 MANA_DELTA backfill', () => {
  it('backfills mana_delta_props from defaults when omitted', () => {
    const augments = ingestAugmentsV2([rawAugment({ augment_class: 'MANA_DELTA' })]);
    expect(augments['aug-1'].mana_delta_props).toEqual({
      action: 'PRIMARY',
      mode: 'FLAT',
      amount: 0,
    });
  });

  it('preserves authored mana_delta_props', () => {
    const augments = ingestAugmentsV2([
      rawAugment({
        augment_class: 'MANA_DELTA',
        mana_delta_props: { action: 'SPECIAL', mode: 'SET', amount: -50 },
      }),
    ]);
    expect(augments['aug-1'].mana_delta_props).toEqual({
      action: 'SPECIAL',
      mode: 'SET',
      amount: -50,
    });
  });

  // Existing records predate the field entirely, so every augment gets it regardless of class.
  it('backfills mana_delta_props onto an unrelated augment class', () => {
    const augments = ingestAugmentsV2([rawAugment({ augment_class: 'FLAT_STAT' })]);
    expect(augments['aug-1'].mana_delta_props).toEqual({
      action: 'PRIMARY',
      mode: 'FLAT',
      amount: 0,
    });
  });
});

describe('inline MANA_DELTA backfill', () => {
  it('backfills a sparse inline effect on a damage action', () => {
    const actions = ingestActionsV2([
      {
        guid: 'act-1',
        id: 'ATK',
        damage_action_props: { augment_effects: [{ augment_class: 'MANA_DELTA' }] },
      } as unknown as Action,
    ]);
    expect(actions['act-1'].damage_action_props.augment_effects[0].mana_delta_props).toEqual({
      action: 'PRIMARY',
      mode: 'FLAT',
      amount: 0,
    });
  });

  it('preserves an authored inline effect on a damage action', () => {
    const actions = ingestActionsV2([
      {
        guid: 'act-1',
        id: 'ATK',
        damage_action_props: {
          augment_effects: [
            { augment_class: 'MANA_DELTA', mana_delta_props: { action: 'SPECIAL', mode: 'SET', amount: -50 } },
          ],
        },
      } as unknown as Action,
    ]);
    expect(actions['act-1'].damage_action_props.augment_effects[0].mana_delta_props).toEqual({
      action: 'SPECIAL',
      mode: 'SET',
      amount: -50,
    });
  });

  it('backfills a sparse inline effect on equipment', () => {
    const items = ingestItemsV2([
      {
        guid: 'item-1',
        id: 'HELM',
        equipment_props: { augment_effects: [{ augment_class: 'MANA_DELTA' }] },
      } as unknown as Item,
    ]);
    expect(items['item-1'].equipment_props.augment_effects[0].mana_delta_props).toEqual({
      action: 'PRIMARY',
      mode: 'FLAT',
      amount: 0,
    });
  });
});
