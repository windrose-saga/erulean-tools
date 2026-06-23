import { describe, expect, it } from 'vitest';

import {
  ingestExpLevelClassesV2,
  ingestGridLevelClassesV2,
  ingestItemsV2,
  ingestUnitsV2,
} from './useIngest';

import {
  DEFAULT_DUNGEON_GRID_LEVEL_CLASS_GUID,
  DEFAULT_EXP_LEVEL_CLASS_GUID,
  DEFAULT_EXP_LEVEL_CLASS_ID,
  DEFAULT_GRID_LEVEL_CLASS_GUID,
  DEFAULT_PV_LEVEL_CLASS_GUID,
} from '../constants/levelClass';
import { ConsumableEffect, Item } from '../types/item';
import { IntLevelClass, VectorLevelClass } from '../types/levelClass';
import { CommanderData, Unit } from '../types/unit';

// Build a raw unit with only the fields a test cares about; ingest fills the
// rest from DEFAULT_UNIT via lodash `merge`. Cast through unknown so tests stay
// terse instead of spelling out every Unit field.
const rawUnit = (overrides: Partial<Unit>): Unit =>
  ({ guid: 'guid-1', id: 'CMD', ...overrides }) as unknown as Unit;

const ingestOne = (overrides: Partial<Unit>): Unit => {
  const result = ingestUnitsV2([rawUnit(overrides)]);
  return result['guid-1'];
};

describe('ingestUnitsV2 commander_data backfill', () => {
  it('backfills missing level-class refs / turn values from defaults', () => {
    const unit = ingestOne({
      is_commander: true,
      commander_data: {
        leadership: 110,
        army_name: 'Test Army',
      } as unknown as CommanderData,
    });

    expect(unit.commander_data.turn_movements).toBe(1);
    expect(unit.commander_data.turn_actions).toBe(1);
    expect(unit.commander_data.exp_level_class).toBe(DEFAULT_EXP_LEVEL_CLASS_GUID);
    expect(unit.commander_data.pv_level_class).toBe(DEFAULT_PV_LEVEL_CLASS_GUID);
    expect(unit.commander_data.grid_level_class).toBe(DEFAULT_GRID_LEVEL_CLASS_GUID);
    expect(unit.commander_data.dungeon_grid_level_class).toBe(
      DEFAULT_DUNGEON_GRID_LEVEL_CLASS_GUID,
    );
  });

  it('applies full default commander_data when none is provided', () => {
    const unit = ingestOne({ is_commander: false });

    expect(unit.commander_data.turn_movements).toBe(1);
    expect(unit.commander_data.turn_actions).toBe(1);
    expect(unit.commander_data.exp_level_class).toBe(DEFAULT_EXP_LEVEL_CLASS_GUID);
  });

  it('preserves authored level-class refs and turn values', () => {
    const unit = ingestOne({
      is_commander: true,
      commander_data: {
        leadership: 120,
        turn_movements: 2,
        turn_actions: 2,
        exp_level_class: 'custom-exp-guid',
      } as unknown as CommanderData,
    });

    expect(unit.commander_data.turn_movements).toBe(2);
    expect(unit.commander_data.turn_actions).toBe(2);
    expect(unit.commander_data.exp_level_class).toBe('custom-exp-guid');
    // Unspecified refs still fall back to the defaults.
    expect(unit.commander_data.pv_level_class).toBe(DEFAULT_PV_LEVEL_CLASS_GUID);
  });
});

describe('ingestUnitsV2 reward fields', () => {
  it('defaults rarity to 0 and can_be_reward to true for a sparse unit', () => {
    const unit = ingestOne({});

    expect(unit.rarity).toBe(0);
    expect(unit.can_be_reward).toBe(true);
  });

  it('preserves authored rarity and can_be_reward', () => {
    const unit = ingestOne({ rarity: 0.75, can_be_reward: false });

    expect(unit.rarity).toBe(0.75);
    expect(unit.can_be_reward).toBe(false);
  });

  it('defaults unique to false for a sparse unit', () => {
    const unit = ingestOne({});

    expect(unit.unique).toBe(false);
  });

  it('preserves authored unique', () => {
    const unit = ingestOne({ unique: true });

    expect(unit.unique).toBe(true);
  });
});

describe('level-class ingestion', () => {
  it('seeds the default class and normalizes int levels to numbers', () => {
    const raw = [
      { guid: 'exp-1', id: 'FAST', name: 'Fast', levels: ['0', '500'] },
    ] as unknown as IntLevelClass[];
    const result = ingestExpLevelClassesV2(raw);

    expect(result[DEFAULT_EXP_LEVEL_CLASS_GUID].id).toBe(DEFAULT_EXP_LEVEL_CLASS_ID);
    expect(result['exp-1'].levels).toEqual([0, 500]);
  });

  it('normalizes vector levels to numeric {x,y}', () => {
    const raw = [
      { guid: 'grid-1', id: 'WIDE', name: 'Wide', levels: [{ x: '8', y: '12' }] },
    ] as unknown as VectorLevelClass[];
    const result = ingestGridLevelClassesV2(raw);

    expect(result['grid-1'].levels).toEqual([{ x: 8, y: 12 }]);
    expect(result[DEFAULT_GRID_LEVEL_CLASS_GUID]).toBeDefined();
  });
});

// Build a raw item with only the fields a test cares about; ingest fills the rest from
// DEFAULT_ITEM_DATA / DEFAULT_CONSUMABLE_EFFECT via lodash `merge`.
const rawItem = (overrides: Partial<Item>): Item =>
  ({ guid: 'item-1', id: 'POTION', item_type: 'CONSUMABLE', ...overrides }) as unknown as Item;

const ingestOneItem = (overrides: Partial<Item>): Item =>
  ingestItemsV2([rawItem(overrides)])['item-1'];

describe('ingestItemsV2 consumable backfill', () => {
  it('applies full default consumable_props when none is provided', () => {
    const item = ingestOneItem({});

    expect(item.consumable_props.consumed_on_use).toBe(true);
    expect(item.consumable_props.effects).toEqual([]);
  });

  it('backfills missing fields inside a partial effect entry from the effect default', () => {
    const item = ingestOneItem({
      consumable_props: {
        consumed_on_use: false,
        effects: [
          { effect_class: 'SPAWN_ENEMIES', spawn_enemies_props: { count: 7 } },
        ] as unknown as Array<ConsumableEffect>,
      },
    });

    const effect = item.consumable_props.effects[0];
    // authored field preserved...
    expect(effect.spawn_enemies_props.count).toBe(7);
    // ...and the rest of the buckets/scalars backfilled from DEFAULT_CONSUMABLE_EFFECT.
    expect(effect.duration).toBe(1);
    expect(effect.restore_party_health_props.mode).toBe('FULL');
    expect(effect.grant_movement_props.moves).toBe(1);
    expect(item.consumable_props.consumed_on_use).toBe(false);
  });

  it('generates a save_key for a durational effect that has none', () => {
    const item = ingestOneItem({
      consumable_props: {
        consumed_on_use: true,
        effects: [
          { effect_class: 'EXPAND_VISION', expand_vision_props: { bonus_radius: 4 } },
        ] as unknown as Array<ConsumableEffect>,
      },
    });

    const effect = item.consumable_props.effects[0];
    expect(effect.save_key).toBeTruthy();
    expect(effect.expand_vision_props.bonus_radius).toBe(4);
  });

  it('preserves an existing save_key and does not touch instant effects', () => {
    const item = ingestOneItem({
      consumable_props: {
        consumed_on_use: true,
        effects: [
          {
            effect_class: 'BOOST_EXP_RATE',
            save_key: 'fixed-key',
            boost_exp_rate_props: { multiplier: 2 },
          },
          { effect_class: 'REVEAL_FLOOR' },
        ] as unknown as Array<ConsumableEffect>,
      },
    });

    expect(item.consumable_props.effects[0].save_key).toBe('fixed-key');
    // Instant effects keep the default empty save_key (unused at runtime).
    expect(item.consumable_props.effects[1].save_key).toBe('');
  });
});
