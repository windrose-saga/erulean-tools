import { describe, expect, it } from 'vitest';

import { ingestActionsV2, ingestAugmentsV2, ingestItemsV2 } from './useIngest';
import { validateIngest } from './validateIngest';

import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { Item } from '../types/item';

// Terse raw builders; ingest fills the rest from the DEFAULT_* constants via lodash `merge`.
const rawAugment = (overrides: Partial<Augment>): Augment =>
  ({ guid: 'aug-1', id: 'SWAP', ...overrides }) as unknown as Augment;

describe('ingestAugmentsV2 ACTION_SWAP backfill', () => {
  it('backfills action_swap_props from defaults when omitted', () => {
    const augments = ingestAugmentsV2([rawAugment({ augment_class: 'ACTION_SWAP' })]);
    expect(augments['aug-1'].action_swap_props).toEqual({ type: 'PRIMARY', action: '' });
  });

  it('preserves authored action_swap_props', () => {
    const augments = ingestAugmentsV2([
      rawAugment({
        augment_class: 'ACTION_SWAP',
        action_swap_props: { type: 'SPECIAL', action: 'act-1' },
      }),
    ]);
    expect(augments['aug-1'].action_swap_props).toEqual({ type: 'SPECIAL', action: 'act-1' });
  });
});

describe('inline ACTION_SWAP backfill', () => {
  it('backfills a sparse inline effect on a damage action', () => {
    const actions = ingestActionsV2([
      {
        guid: 'act-1',
        id: 'ATK',
        damage_action_props: { augment_effects: [{ augment_class: 'ACTION_SWAP' }] },
      } as unknown as Action,
    ]);
    expect(actions['act-1'].damage_action_props.augment_effects[0].action_swap_props).toEqual({
      type: 'PRIMARY',
      action: '',
    });
  });

  it('backfills a sparse inline effect on a summon action', () => {
    const actions = ingestActionsV2([
      {
        guid: 'act-1',
        id: 'CALL',
        summon_action_props: { augment_effects: [{ augment_class: 'ACTION_SWAP' }] },
      } as unknown as Action,
    ]);
    expect(actions['act-1'].summon_action_props.augment_effects[0].action_swap_props).toEqual({
      type: 'PRIMARY',
      action: '',
    });
  });

  it('backfills a sparse inline effect on equipment', () => {
    const items = ingestItemsV2([
      {
        guid: 'item-1',
        id: 'HELM',
        equipment_props: { augment_effects: [{ augment_class: 'ACTION_SWAP' }] },
      } as unknown as Item,
    ]);
    expect(items['item-1'].equipment_props.augment_effects[0].action_swap_props).toEqual({
      type: 'PRIMARY',
      action: '',
    });
  });
});

describe('validateIngest ACTION_SWAP action references', () => {
  const danglingAugment = ingestAugmentsV2([
    rawAugment({
      augment_class: 'ACTION_SWAP',
      action_swap_props: { type: 'PRIMARY', action: 'missing' },
    }),
  ]);

  it('rejects a dangling standalone action guid', () => {
    const errors = validateIngest({}, {}, danglingAugment);
    expect(
      errors.some((error) => error.message.includes('ACTION_SWAP references action that does not exist')),
    ).toBe(true);
  });

  it('accepts an ACTION_SWAP whose action exists', () => {
    const actions = ingestActionsV2([{ guid: 'act-1', id: 'ATK' } as unknown as Action]);
    const augments = ingestAugmentsV2([
      rawAugment({
        augment_class: 'ACTION_SWAP',
        action_swap_props: { type: 'PRIMARY', action: 'act-1' },
      }),
    ]);
    const errors = validateIngest({}, actions, augments);
    expect(errors.some((error) => error.message.includes('ACTION_SWAP'))).toBe(false);
  });

  it('rejects a dangling inline action guid on an action', () => {
    const actions = ingestActionsV2([
      {
        guid: 'act-1',
        id: 'ATK',
        damage_action_props: {
          augment_effects: [
            { augment_class: 'ACTION_SWAP', action_swap_props: { type: 'PRIMARY', action: 'missing' } },
          ],
        },
      } as unknown as Action,
    ]);
    const errors = validateIngest({}, actions, {});
    expect(errors.some((error) => error.message.includes('Action ATK inline effect ACTION_SWAP'))).toBe(
      true,
    );
  });

  it('rejects a dangling inline action guid on a summon action', () => {
    const actions = ingestActionsV2([
      {
        guid: 'act-1',
        id: 'CALL',
        action_type: 'SUMMON_ACTION',
        summon_action_props: {
          augment_effects: [
            { augment_class: 'ACTION_SWAP', action_swap_props: { type: 'PRIMARY', action: 'missing' } },
          ],
        },
      } as unknown as Action,
    ]);
    const errors = validateIngest({}, actions, {});
    expect(
      errors.some((error) => error.message.includes('Action CALL inline effect ACTION_SWAP')),
    ).toBe(true);
  });

  it('rejects a dangling inline action guid on equipment', () => {
    const items = ingestItemsV2([
      {
        guid: 'item-1',
        id: 'HELM',
        loot_categories: [],
        equipment_props: {
          augment_effects: [
            { augment_class: 'ACTION_SWAP', action_swap_props: { type: 'PRIMARY', action: 'missing' } },
          ],
        },
      } as unknown as Item,
    ]);
    const errors = validateIngest({}, {}, {}, {}, undefined, {
      items,
      lootCategoryIds: [],
      removedLootCategoryIds: [],
      generatorTagIds: [],
      removedGeneratorTagIds: [],
    });
    expect(errors.some((error) => error.message.includes('Item HELM inline effect ACTION_SWAP'))).toBe(
      true,
    );
  });
});
