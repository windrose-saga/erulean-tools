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
  setLootCategoryIds: (full: string[], removed: string[]) => void;
  addLootCategory: (name: string) => void;
  removeLootCategory: (name: string) => void;
  renameLootCategory: (oldName: string, newName: string) => void;
  setGeneratorTagIds: (full: string[], removed: string[]) => void;
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
      setLootCategoryIds: (full, removed) =>
        set((state) => {
          state.lootCategoryIds = [...full];
          state.removedLootCategoryIds = [...removed];
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
          if (!state.lootCategoryIds.includes(normalized)) {
            state.lootCategoryIds.push(normalized);
          }
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
          // Reject collision with any existing name (active or tombstoned) other than a no-op.
          if (normalized !== oldName && state.lootCategoryIds.includes(normalized)) {
            return;
          }
          // Rename in place: the ordinal (index) is preserved.
          state.lootCategoryIds[state.lootCategoryIds.indexOf(oldName)] = normalized;
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
      setGeneratorTagIds: (full, removed) =>
        set((state) => {
          state.generatorTagIds = [...full];
          state.removedGeneratorTagIds = [...removed];
        }),
      addGeneratorTag: (name) =>
        set((state) => {
          const normalized = normalizeVocabId(name);
          if (!isValidVocabId(normalized)) {
            return;
          }
          const tombstoneIndex = state.removedGeneratorTagIds.indexOf(normalized);
          if (tombstoneIndex !== -1) {
            state.removedGeneratorTagIds.splice(tombstoneIndex, 1);
            return;
          }
          if (!state.generatorTagIds.includes(normalized)) {
            state.generatorTagIds.push(normalized);
          }
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
          if (normalized !== oldName && state.generatorTagIds.includes(normalized)) {
            return;
          }
          state.generatorTagIds[state.generatorTagIds.indexOf(oldName)] = normalized;
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
    },
  ),
);

export const useGameStore = createSelectors(useGameStoreBase);
