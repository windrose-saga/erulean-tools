import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { DungeonPrefab } from '../types/dungeonPrefab';
import { Item } from '../types/item';
import {
  DungeonGridLevelClass,
  ExpLevelClass,
  GridLevelClass,
  PvLevelClass,
} from '../types/levelClass';
import { Unit } from '../types/unit';
import { createSelectors } from '../utils/createSelectors';
import env from '../utils/env';

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
  unitIds: Map<string, string>;
  itemIds: Map<string, string>;
  prefabIds: Map<string, string>;
  expLevelClassIds: Map<string, string>;
  pvLevelClassIds: Map<string, string>;
  gridLevelClassIds: Map<string, string>;
  dungeonGridLevelClassIds: Map<string, string>;
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
  setUnitIds: (unitIds: Map<string, string>) => void;
  setItemIds: (itemIds: Map<string, string>) => void;
  setPrefabIds: (prefabIds: Map<string, string>) => void;
  setExpLevelClassIds: (ids: Map<string, string>) => void;
  setPvLevelClassIds: (ids: Map<string, string>) => void;
  setGridLevelClassIds: (ids: Map<string, string>) => void;
  setDungeonGridLevelClassIds: (ids: Map<string, string>) => void;
  setUnit: (unit: Unit) => void;
  setAction: (action: Action) => void;
  setAugment: (augment: Augment) => void;
  setItem: (item: Item) => void;
  setPrefab: (prefab: DungeonPrefab) => void;
  setExpLevelClass: (levelClass: ExpLevelClass) => void;
  setPvLevelClass: (levelClass: PvLevelClass) => void;
  setGridLevelClass: (levelClass: GridLevelClass) => void;
  setDungeonGridLevelClass: (levelClass: DungeonGridLevelClass) => void;
  setLastSaved: (savedAt: number) => void;
  setExported: () => void;
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
  unitIds: new Map<string, string>(),
  itemIds: new Map<string, string>(),
  prefabIds: new Map<string, string>(),
  expLevelClassIds: new Map<string, string>(),
  pvLevelClassIds: new Map<string, string>(),
  gridLevelClassIds: new Map<string, string>(),
  dungeonGridLevelClassIds: new Map<string, string>(),
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
    })),
    {
      name: `erulean-tools-${env.useTestData ? 'dev' : 'prod'}`,
    },
  ),
);

export const useGameStore = createSelectors(useGameStoreBase);
