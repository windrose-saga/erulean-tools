import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { DungeonPrefab } from '../types/dungeonPrefab';
import { Item, SEED_LOOT_CATEGORIES } from '../types/item';
import {
  DungeonGridLevelClass,
  ExpLevelClass,
  GeneratorClass,
  GridLevelClass,
  PvLevelClass,
} from '../types/levelClass';
import { SEED_GENERATOR_TAGS, Unit } from '../types/unit';
import { createSelectors } from '../utils/createSelectors';
import env from '../utils/env';
import { isValidVocabId, normalizeVocabId } from '../utils/vocabId';
import { reconcileLedger, VocabLedger, wouldRemapOrdinal } from '../utils/vocabLedger';

type State = {
  loaded: boolean;
  lastLoaded: number | null;
  lastSaved: number | null;
  units: Record<string, Unit>;
  actions: Record<string, Action>;
  augments: Record<string, Augment>;
  items: Record<string, Item>;
  prefabs: Record<string, DungeonPrefab>;
  expLevelClasses: Record<string, ExpLevelClass>;
  pvLevelClasses: Record<string, PvLevelClass>;
  gridLevelClasses: Record<string, GridLevelClass>;
  dungeonGridLevelClasses: Record<string, DungeonGridLevelClass>;
  generatorClasses: Record<string, GeneratorClass>;
  unitIds: Map<string, string>;
  itemIds: Map<string, string>;
  prefabIds: Map<string, string>;
  expLevelClassIds: Map<string, string>;
  pvLevelClassIds: Map<string, string>;
  gridLevelClassIds: Map<string, string>;
  dungeonGridLevelClassIds: Map<string, string>;
  generatorClassIds: Map<string, string>;
  // Append-only ordered vocabularies (index = Godot enum ordinal). `removed*` are tombstoned
  // names: hidden from the UI and stripped from items/units, but never spliced out of the
  // ordered list so existing ordinals stay stable.
  lootCategoryIds: string[];
  removedLootCategoryIds: string[];
  generatorTagIds: string[];
  removedGeneratorTagIds: string[];
  // Durable name -> ordinal ledgers (see utils/vocabLedger). They remember every name a vocabulary
  // has ever held — including names retired by rename — so no name can be rebound to a different
  // ordinal, which would remap persisted Godot enum integers.
  lootCategoryOrdinals: VocabLedger;
  generatorTagOrdinals: VocabLedger;
};

type Actions = {
  reset: () => void;
  setLoaded: () => void;
  setUnits: (units: Record<string, Unit>) => void;
  setActions: (actions: Record<string, Action>) => void;
  setAugments: (augments: Record<string, Augment>) => void;
  setItems: (items: Record<string, Item>) => void;
  setPrefabs: (prefabs: Record<string, DungeonPrefab>) => void;
  setExpLevelClasses: (classes: Record<string, ExpLevelClass>) => void;
  setPvLevelClasses: (classes: Record<string, PvLevelClass>) => void;
  setGridLevelClasses: (classes: Record<string, GridLevelClass>) => void;
  setDungeonGridLevelClasses: (classes: Record<string, DungeonGridLevelClass>) => void;
  setGeneratorClasses: (classes: Record<string, GeneratorClass>) => void;
  setUnitIds: (unitIds: Map<string, string>) => void;
  setItemIds: (itemIds: Map<string, string>) => void;
  setPrefabIds: (prefabIds: Map<string, string>) => void;
  setExpLevelClassIds: (ids: Map<string, string>) => void;
  setPvLevelClassIds: (ids: Map<string, string>) => void;
  setGridLevelClassIds: (ids: Map<string, string>) => void;
  setDungeonGridLevelClassIds: (ids: Map<string, string>) => void;
  setGeneratorClassIds: (ids: Map<string, string>) => void;
  setUnit: (unit: Unit) => void;
  setAction: (action: Action) => void;
  setAugment: (augment: Augment) => void;
  setItem: (item: Item) => void;
  setPrefab: (prefab: DungeonPrefab) => void;
  setExpLevelClass: (levelClass: ExpLevelClass) => void;
  setPvLevelClass: (levelClass: PvLevelClass) => void;
  setGridLevelClass: (levelClass: GridLevelClass) => void;
  setDungeonGridLevelClass: (levelClass: DungeonGridLevelClass) => void;
  setGeneratorClass: (generatorClass: GeneratorClass) => void;
  setLastSaved: (savedAt: number) => void;
  setExported: () => void;
  setLootCategoryIds: (full: string[], removed: string[], ledger?: VocabLedger) => void;
  addLootCategory: (name: string) => void;
  removeLootCategory: (name: string) => void;
  renameLootCategory: (oldName: string, newName: string) => void;
  setGeneratorTagIds: (full: string[], removed: string[], ledger?: VocabLedger) => void;
  addGeneratorTag: (name: string) => void;
  removeGeneratorTag: (name: string) => void;
  renameGeneratorTag: (oldName: string, newName: string) => void;
};

const initialState: State = {
  loaded: false,
  lastLoaded: null,
  lastSaved: null,
  units: {},
  actions: {},
  augments: {},
  items: {},
  prefabs: {},
  expLevelClasses: {},
  pvLevelClasses: {},
  gridLevelClasses: {},
  dungeonGridLevelClasses: {},
  generatorClasses: {},
  unitIds: new Map<string, string>(),
  itemIds: new Map<string, string>(),
  prefabIds: new Map<string, string>(),
  expLevelClassIds: new Map<string, string>(),
  pvLevelClassIds: new Map<string, string>(),
  gridLevelClassIds: new Map<string, string>(),
  dungeonGridLevelClassIds: new Map<string, string>(),
  generatorClassIds: new Map<string, string>(),
  lootCategoryIds: [...SEED_LOOT_CATEGORIES],
  removedLootCategoryIds: [],
  generatorTagIds: [...SEED_GENERATOR_TAGS],
  removedGeneratorTagIds: [],
  lootCategoryOrdinals: reconcileLedger(SEED_LOOT_CATEGORIES),
  generatorTagOrdinals: reconcileLedger(SEED_GENERATOR_TAGS),
};

export type GameStore = State & Actions;

const useGameStoreBase = create<GameStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      reset: () => {
        set(initialState);
      },
      setLoaded: () =>
        set((state) => {
          state.loaded = true;
          state.lastLoaded = Date.now();
        }),
      setLastSaved: (lastSaved) =>
        set((state) => {
          state.lastSaved = lastSaved;
        }),
      setExported: () =>
        set((state) => {
          const timeStamp = Date.now();
          state.lastSaved = timeStamp;
          state.lastLoaded = timeStamp;
        }),
      setUnits: (units) =>
        set((state) => {
          state.units = units;
        }),
      setActions: (actions) =>
        set((state) => {
          state.actions = actions;
        }),
      setAugments: (augments) =>
        set((state) => {
          state.augments = augments;
        }),
      setItems: (items) =>
        set((state) => {
          state.items = items;
        }),
      setPrefabs: (prefabs) =>
        set((state) => {
          state.prefabs = prefabs;
        }),
      setExpLevelClasses: (classes) =>
        set((state) => {
          state.expLevelClasses = classes;
        }),
      setPvLevelClasses: (classes) =>
        set((state) => {
          state.pvLevelClasses = classes;
        }),
      setGridLevelClasses: (classes) =>
        set((state) => {
          state.gridLevelClasses = classes;
        }),
      setDungeonGridLevelClasses: (classes) =>
        set((state) => {
          state.dungeonGridLevelClasses = classes;
        }),
      setGeneratorClasses: (classes) =>
        set((state) => {
          state.generatorClasses = classes;
        }),
      setUnitIds: (unitIds) =>
        set((state) => {
          state.unitIds = new Map(unitIds);
        }),
      setItemIds: (itemIds) =>
        set((state) => {
          state.itemIds = new Map(itemIds);
        }),
      setPrefabIds: (prefabIds) =>
        set((state) => {
          state.prefabIds = new Map(prefabIds);
        }),
      setExpLevelClassIds: (ids) =>
        set((state) => {
          state.expLevelClassIds = new Map(ids);
        }),
      setPvLevelClassIds: (ids) =>
        set((state) => {
          state.pvLevelClassIds = new Map(ids);
        }),
      setGridLevelClassIds: (ids) =>
        set((state) => {
          state.gridLevelClassIds = new Map(ids);
        }),
      setDungeonGridLevelClassIds: (ids) =>
        set((state) => {
          state.dungeonGridLevelClassIds = new Map(ids);
        }),
      setGeneratorClassIds: (ids) =>
        set((state) => {
          state.generatorClassIds = new Map(ids);
        }),
      setUnit: (unit) =>
        set((state) => {
          state.units[unit.guid] = unit;
          state.unitIds.set(unit.guid, unit.id);
        }),
      setAction: (action) =>
        set((state) => {
          state.actions[action.guid] = action;
        }),
      setAugment: (augment) =>
        set((state) => {
          state.augments[augment.guid] = augment;
        }),
      setItem: (item) =>
        set((state) => {
          state.items[item.guid] = item;
          state.itemIds.set(item.guid, item.id);
        }),
      setPrefab: (prefab) =>
        set((state) => {
          state.prefabs[prefab.guid] = prefab;
          state.prefabIds.set(prefab.guid, prefab.id);
        }),
      setExpLevelClass: (levelClass) =>
        set((state) => {
          state.expLevelClasses[levelClass.guid] = levelClass;
          state.expLevelClassIds.set(levelClass.guid, levelClass.id);
        }),
      setPvLevelClass: (levelClass) =>
        set((state) => {
          state.pvLevelClasses[levelClass.guid] = levelClass;
          state.pvLevelClassIds.set(levelClass.guid, levelClass.id);
        }),
      setGridLevelClass: (levelClass) =>
        set((state) => {
          state.gridLevelClasses[levelClass.guid] = levelClass;
          state.gridLevelClassIds.set(levelClass.guid, levelClass.id);
        }),
      setDungeonGridLevelClass: (levelClass) =>
        set((state) => {
          state.dungeonGridLevelClasses[levelClass.guid] = levelClass;
          state.dungeonGridLevelClassIds.set(levelClass.guid, levelClass.id);
        }),
      setGeneratorClass: (generatorClass) =>
        set((state) => {
          state.generatorClasses[generatorClass.guid] = generatorClass;
          state.generatorClassIds.set(generatorClass.guid, generatorClass.id);
        }),
      setLootCategoryIds: (full, removed, ledger) =>
        set((state) => {
          state.lootCategoryIds = [...full];
          state.removedLootCategoryIds = [...removed];
          state.lootCategoryOrdinals = reconcileLedger(full, ledger);
        }),
      addLootCategory: (name) =>
        set((state) => {
          const normalized = normalizeVocabId(name);
          if (!isValidVocabId(normalized)) {
            return;
          }
          // Re-adding a tombstoned value revives its existing slot rather than appending a dup.
          const tombstoneIndex = state.removedLootCategoryIds.indexOf(normalized);
          if (tombstoneIndex !== -1) {
            state.removedLootCategoryIds.splice(tombstoneIndex, 1);
            return;
          }
          if (state.lootCategoryIds.includes(normalized)) {
            return;
          }
          // A name retired from another ordinal (renamed away) cannot be reborn at a new ordinal:
          // that would bind one name to two integers. The user must rename its old slot back.
          if (state.lootCategoryOrdinals[normalized] !== undefined) {
            return;
          }
          state.lootCategoryOrdinals[normalized] = state.lootCategoryIds.length;
          state.lootCategoryIds.push(normalized);
        }),
      removeLootCategory: (name) =>
        set((state) => {
          if (!state.lootCategoryIds.includes(name)) {
            return;
          }
          if (!state.removedLootCategoryIds.includes(name)) {
            state.removedLootCategoryIds.push(name);
          }
          // Cascade-strip the tombstoned value from every item that referenced it.
          Object.values(state.items).forEach((item) => {
            if (item.loot_categories.includes(name)) {
              item.loot_categories = item.loot_categories.filter((category) => category !== name);
            }
          });
        }),
      renameLootCategory: (oldName, newName) =>
        set((state) => {
          const normalized = normalizeVocabId(newName);
          if (!isValidVocabId(normalized) || !state.lootCategoryIds.includes(oldName)) {
            return;
          }
          if (normalized === oldName) {
            return;
          }
          // Reject collision with any current name (active or tombstoned).
          if (state.lootCategoryIds.includes(normalized)) {
            return;
          }
          const ordinal = state.lootCategoryIds.indexOf(oldName);
          // Reject reusing a name the ledger bound to a *different* ordinal — that would teleport
          // the name across enum integers and remap persisted ordinals in windrose-saga.
          if (wouldRemapOrdinal(state.lootCategoryOrdinals, normalized, ordinal)) {
            return;
          }
          // Rename in place: the ordinal (index) is preserved. The old name stays in the ledger
          // (retired) so it can never be reattached to a different ordinal.
          state.lootCategoryIds[ordinal] = normalized;
          state.lootCategoryOrdinals[normalized] = ordinal;
          const removedIndex = state.removedLootCategoryIds.indexOf(oldName);
          if (removedIndex !== -1) {
            state.removedLootCategoryIds[removedIndex] = normalized;
          }
          Object.values(state.items).forEach((item) => {
            if (item.loot_categories.includes(oldName)) {
              item.loot_categories = item.loot_categories.map((category) =>
                category === oldName ? normalized : category,
              );
            }
          });
        }),
      setGeneratorTagIds: (full, removed, ledger) =>
        set((state) => {
          state.generatorTagIds = [...full];
          state.removedGeneratorTagIds = [...removed];
          state.generatorTagOrdinals = reconcileLedger(full, ledger);
        }),
      addGeneratorTag: (name) =>
        set((state) => {
          const normalized = normalizeVocabId(name);
          if (!isValidVocabId(normalized)) {
            return;
          }
          // Re-adding a tombstoned value revives its existing slot rather than appending a dup.
          const tombstoneIndex = state.removedGeneratorTagIds.indexOf(normalized);
          if (tombstoneIndex !== -1) {
            state.removedGeneratorTagIds.splice(tombstoneIndex, 1);
            return;
          }
          if (state.generatorTagIds.includes(normalized)) {
            return;
          }
          // A name retired from another ordinal (renamed away) cannot be reborn at a new ordinal:
          // that would bind one name to two integers. The user must rename its old slot back.
          if (state.generatorTagOrdinals[normalized] !== undefined) {
            return;
          }
          state.generatorTagOrdinals[normalized] = state.generatorTagIds.length;
          state.generatorTagIds.push(normalized);
        }),
      removeGeneratorTag: (name) =>
        set((state) => {
          if (!state.generatorTagIds.includes(name)) {
            return;
          }
          if (!state.removedGeneratorTagIds.includes(name)) {
            state.removedGeneratorTagIds.push(name);
          }
          Object.values(state.units).forEach((unit) => {
            if (unit.generator_tags.includes(name)) {
              unit.generator_tags = unit.generator_tags.filter((tag) => tag !== name);
            }
          });
        }),
      renameGeneratorTag: (oldName, newName) =>
        set((state) => {
          const normalized = normalizeVocabId(newName);
          if (!isValidVocabId(normalized) || !state.generatorTagIds.includes(oldName)) {
            return;
          }
          if (normalized === oldName) {
            return;
          }
          // Reject collision with any current name (active or tombstoned).
          if (state.generatorTagIds.includes(normalized)) {
            return;
          }
          const ordinal = state.generatorTagIds.indexOf(oldName);
          // Reject reusing a name the ledger bound to a *different* ordinal — that would teleport
          // the name across enum integers and remap persisted ordinals in windrose-saga.
          if (wouldRemapOrdinal(state.generatorTagOrdinals, normalized, ordinal)) {
            return;
          }
          // Rename in place: the ordinal (index) is preserved. The old name stays in the ledger
          // (retired) so it can never be reattached to a different ordinal.
          state.generatorTagIds[ordinal] = normalized;
          state.generatorTagOrdinals[normalized] = ordinal;
          const removedIndex = state.removedGeneratorTagIds.indexOf(oldName);
          if (removedIndex !== -1) {
            state.removedGeneratorTagIds[removedIndex] = normalized;
          }
          Object.values(state.units).forEach((unit) => {
            if (unit.generator_tags.includes(oldName)) {
              unit.generator_tags = unit.generator_tags.map((tag) =>
                tag === oldName ? normalized : tag,
              );
            }
          });
        }),
    })),
    {
      name: `erulean-tools-${env.useTestData ? 'dev' : 'prod'}`,
      // State persisted before the ordinal ledgers existed rehydrates without them, leaving the
      // guard inconsistent with the ordered lists. Rebuild both ledgers from the persisted lists
      // on every rehydrate so the name->ordinal invariant always holds, even pre-migration.
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<GameStore>) };
        merged.lootCategoryOrdinals = reconcileLedger(
          merged.lootCategoryIds,
          merged.lootCategoryOrdinals,
        );
        merged.generatorTagOrdinals = reconcileLedger(
          merged.generatorTagIds,
          merged.generatorTagOrdinals,
        );
        return merged;
      },
    },
  ),
);

export const useGameStore = createSelectors(useGameStoreBase);
