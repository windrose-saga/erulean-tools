import { enableMapSet } from 'immer';
import { beforeEach, describe, expect, it } from 'vitest';

import { useGameStore } from './useGameStore';

import { Item } from '../types/item';
import { Unit } from '../types/unit';

enableMapSet();

const store = () => useGameStore.getState();

const itemWith = (id: string, loot_categories: string[]): Item =>
  ({ guid: id, id, loot_categories }) as unknown as Item;

const unitWith = (id: string, generator_tags: string[]): Unit =>
  ({ guid: id, id, generator_tags }) as unknown as Unit;

beforeEach(() => {
  store().reset();
});

describe('loot category vocabulary actions', () => {
  it('seeds the protected built-ins by default', () => {
    expect(store().lootCategoryIds).toEqual([
      'WEAPON',
      'ARMOR',
      'MATERIAL',
      'MEADOWMERE',
      'WOODMERE',
      'CONSUMABLE',
    ]);
  });

  it('adds a normalized new value and ignores invalid input', () => {
    store().addLootCategory('relic blade');
    expect(store().lootCategoryIds).toContain('RELIC_BLADE');
    const before = store().lootCategoryIds.length;
    store().addLootCategory('2bad');
    expect(store().lootCategoryIds.length).toBe(before);
  });

  it('removes (tombstones) a custom value and cascade-strips it from items', () => {
    store().setItems({ a: itemWith('SWORD', ['WEAPON', 'RELIC']) });
    store().addLootCategory('RELIC');
    store().removeLootCategory('RELIC');

    // Tombstoned: still present in the ordered list (ordinal preserved) but marked removed.
    expect(store().lootCategoryIds).toContain('RELIC');
    expect(store().removedLootCategoryIds).toContain('RELIC');
    // Cascade-stripped from the referencing item.
    expect(store().items.a.loot_categories).toEqual(['WEAPON']);
  });

  it('revives a tombstoned value on re-add without duplicating its slot', () => {
    store().addLootCategory('RELIC');
    store().removeLootCategory('RELIC');
    const lengthWhileRemoved = store().lootCategoryIds.length;
    store().addLootCategory('RELIC');
    expect(store().removedLootCategoryIds).not.toContain('RELIC');
    expect(store().lootCategoryIds.length).toBe(lengthWhileRemoved); // no dup appended
  });

  it('allows removing a seed value (no protected built-ins) and cascades', () => {
    store().setItems({ a: itemWith('SWORD', ['WEAPON']) });
    store().removeLootCategory('WEAPON');
    expect(store().removedLootCategoryIds).toContain('WEAPON');
    expect(store().items.a.loot_categories).toEqual([]);
  });

  it('renames in place, preserving ordinal, and cascades to items', () => {
    store().setItems({ a: itemWith('SWORD', ['RELIC']) });
    store().addLootCategory('RELIC');
    const index = store().lootCategoryIds.indexOf('RELIC');
    store().renameLootCategory('RELIC', 'ARTIFACT');
    expect(store().lootCategoryIds.indexOf('ARTIFACT')).toBe(index); // same slot/ordinal
    expect(store().lootCategoryIds).not.toContain('RELIC');
    expect(store().items.a.loot_categories).toEqual(['ARTIFACT']);
  });

  it('rejects a rename that collides with an existing value', () => {
    store().addLootCategory('RELIC');
    store().renameLootCategory('RELIC', 'WEAPON'); // collision with existing value
    expect(store().lootCategoryIds).toContain('RELIC');
    expect(store().lootCategoryIds.filter((name) => name === 'WEAPON')).toHaveLength(1);
  });

  it('allows renaming a seed value (no protected built-ins), preserving its ordinal', () => {
    const index = store().lootCategoryIds.indexOf('WEAPON');
    store().renameLootCategory('WEAPON', 'ARMAMENT');
    expect(store().lootCategoryIds.indexOf('ARMAMENT')).toBe(index);
    expect(store().lootCategoryIds).not.toContain('WEAPON');
  });
});

describe('generator tag vocabulary actions', () => {
  it('removes a custom tag and cascade-strips it from units', () => {
    store().setUnits({ u: unitWith('SPEAR', ['MARCH', 'ELITE']) });
    store().addGeneratorTag('ELITE');
    store().removeGeneratorTag('ELITE');
    expect(store().removedGeneratorTagIds).toContain('ELITE');
    expect(store().units.u.generator_tags).toEqual(['MARCH']);
  });
});
