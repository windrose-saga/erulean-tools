import { describe, expect, it } from 'vitest';

import { validateIngest } from './validateIngest';

import { Item } from '../types/item';
import { Unit } from '../types/unit';

const item = (id: string, loot_categories: string[]): Item =>
  ({ guid: id, id, loot_categories }) as unknown as Item;

const unit = (id: string, generator_tags: string[]): Unit =>
  ({
    guid: id,
    id,
    generator_tags,
    is_commander: false,
    actions: {},
    rarity: 0,
    can_be_reward: true,
    required_generator_level: 0,
  }) as unknown as Unit;

const run = (vocab: {
  items: Record<string, Item>;
  lootCategoryIds: string[];
  removedLootCategoryIds: string[];
  generatorTagIds: string[];
  removedGeneratorTagIds: string[];
  units?: Record<string, Unit>;
  lootCategoryOrdinals?: Record<string, number>;
  generatorTagOrdinals?: Record<string, number>;
}) =>
  validateIngest(vocab.units ?? {}, {}, {}, {}, undefined, {
    items: vocab.items,
    lootCategoryIds: vocab.lootCategoryIds,
    removedLootCategoryIds: vocab.removedLootCategoryIds,
    generatorTagIds: vocab.generatorTagIds,
    removedGeneratorTagIds: vocab.removedGeneratorTagIds,
    lootCategoryOrdinals: vocab.lootCategoryOrdinals,
    generatorTagOrdinals: vocab.generatorTagOrdinals,
  });

describe('vocabulary validation', () => {
  it('passes for a clean vocabulary with valid references', () => {
    const errors = run({
      items: { a: item('SWORD', ['WEAPON']) },
      lootCategoryIds: ['WEAPON', 'ARMOR'],
      removedLootCategoryIds: [],
      generatorTagIds: ['MARCH'],
      removedGeneratorTagIds: [],
      units: { u: unit('SPEAR', ['MARCH']) },
    });
    expect(errors).toEqual([]);
  });

  it('rejects an invalid identifier', () => {
    const errors = run({
      items: {},
      lootCategoryIds: ['WEAPON', 'bad id'],
      removedLootCategoryIds: [],
      generatorTagIds: [],
      removedGeneratorTagIds: [],
    });
    expect(errors.some((e) => e.message.includes("'bad id'"))).toBe(true);
  });

  it('rejects duplicates in the full list', () => {
    const errors = run({
      items: {},
      lootCategoryIds: ['WEAPON', 'WEAPON'],
      removedLootCategoryIds: [],
      generatorTagIds: [],
      removedGeneratorTagIds: [],
    });
    expect(errors.some((e) => e.message.includes('Duplicate'))).toBe(true);
  });

  it('rejects a removed value that is not in the full list', () => {
    const errors = run({
      items: {},
      lootCategoryIds: ['WEAPON'],
      removedLootCategoryIds: ['GHOST'],
      generatorTagIds: [],
      removedGeneratorTagIds: [],
    });
    expect(errors.some((e) => e.message.includes('not present in the full list'))).toBe(true);
  });

  it('rejects an item referencing an unknown loot category', () => {
    const errors = run({
      items: { a: item('SWORD', ['MYSTERY']) },
      lootCategoryIds: ['WEAPON'],
      removedLootCategoryIds: [],
      generatorTagIds: [],
      removedGeneratorTagIds: [],
    });
    expect(errors.some((e) => e.message.includes("unknown loot category 'MYSTERY'"))).toBe(true);
  });

  it('rejects an item referencing a tombstoned (removed) loot category', () => {
    const errors = run({
      items: { a: item('SWORD', ['RELIC']) },
      lootCategoryIds: ['WEAPON', 'RELIC'],
      removedLootCategoryIds: ['RELIC'],
      generatorTagIds: [],
      removedGeneratorTagIds: [],
    });
    expect(errors.some((e) => e.message.includes("removed loot category 'RELIC'"))).toBe(true);
  });

  it('passes when the ordinal ledger agrees with the list positions', () => {
    const errors = run({
      items: {},
      lootCategoryIds: ['WEAPON', 'ARMOR'],
      removedLootCategoryIds: [],
      generatorTagIds: ['MARCH', 'BANDIT'],
      removedGeneratorTagIds: [],
      generatorTagOrdinals: { MARCH: 0, BANDIT: 1 },
    });
    expect(errors).toEqual([]);
  });

  it('rejects a file whose ledger binds a name to a different index than it occupies', () => {
    // The BANDIT-teleport shape: BANDIT historically ordinal 7, but the edited list places it at
    // index 1. A hand-edited/stale file like this must hard-fail at the ingest boundary.
    const errors = run({
      items: {},
      lootCategoryIds: ['WEAPON'],
      removedLootCategoryIds: [],
      generatorTagIds: ['MARCH', 'BANDIT'],
      removedGeneratorTagIds: [],
      generatorTagOrdinals: { MARCH: 0, BANDIT: 7 },
    });
    expect(errors.some((e) => e.message.includes("'BANDIT' is at index 1"))).toBe(true);
  });
});
