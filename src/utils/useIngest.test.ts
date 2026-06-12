import { describe, expect, it } from 'vitest';

import { ingestItemsV2, ingestUnitsV2 } from './useIngest';

import { ConsumableEffect, Item } from '../types/item';
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
  it('backfills missing levels/turn_movements/turn_actions/dungeon grid from defaults', () => {
    const unit = ingestOne({
      is_commander: true,
      commander_data: {
        leadership: 110,
        grid_size_x: 6,
        grid_size_y: 10,
        army_name: 'Test Army',
      } as unknown as CommanderData,
    });

    expect(unit.commander_data.levels).toEqual([]);
    expect(unit.commander_data.turn_movements).toBe(1);
    expect(unit.commander_data.turn_actions).toBe(1);
    expect(unit.commander_data.dungeon_grid_size_x).toBe(2);
    expect(unit.commander_data.dungeon_grid_size_y).toBe(5);
  });

  it('applies full default commander_data when none is provided', () => {
    const unit = ingestOne({ is_commander: false });

    expect(unit.commander_data.levels).toEqual([]);
    expect(unit.commander_data.turn_movements).toBe(1);
    expect(unit.commander_data.turn_actions).toBe(1);
    expect(unit.commander_data.dungeon_grid_size_x).toBe(2);
    expect(unit.commander_data.dungeon_grid_size_y).toBe(5);
  });

  it('preserves authored levels and turn values instead of overwriting with defaults', () => {
    const levels = [
      {
        experience: 0,
        point_value_limit: 80,
        grid_size_x: 10,
        grid_size_y: 10,
        dungeon_grid_size_x: 2,
        dungeon_grid_size_y: 5,
      },
      {
        experience: 35,
        point_value_limit: 190,
        grid_size_x: 10,
        grid_size_y: 12,
        dungeon_grid_size_x: 0,
        dungeon_grid_size_y: 0,
      },
    ];
    const unit = ingestOne({
      is_commander: true,
      commander_data: {
        leadership: 120,
        turn_movements: 2,
        turn_actions: 2,
        levels,
      } as unknown as CommanderData,
    });

    expect(unit.commander_data.turn_movements).toBe(2);
    expect(unit.commander_data.turn_actions).toBe(2);
    expect(unit.commander_data.levels).toHaveLength(2);
    expect(unit.commander_data.levels[1]).toEqual(levels[1]);
  });

  it('does not leave stale trailing level entries (default levels array is empty)', () => {
    // lodash `merge` blends arrays by index; an empty default means the authored
    // array length is preserved exactly rather than padded from a template.
    const unit = ingestOne({
      is_commander: true,
      commander_data: {
        levels: [
          {
            experience: 0,
            point_value_limit: 1000,
            grid_size_x: 12,
            grid_size_y: 26,
            dungeon_grid_size_x: 0,
            dungeon_grid_size_y: 0,
          },
        ],
      } as unknown as CommanderData,
    });

    expect(unit.commander_data.levels).toHaveLength(1);
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
