/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { merge } from 'lodash';
import * as React from 'react';

import { generateItemIdsMap } from './generateItemIdsMap';
import { generateLevelClassIdsMap } from './generateLevelClassIdsMap';
import { generatePrefabIdsMap } from './generatePrefabIdsMap';
import { generateUnitIdsMap } from './generateUnitIdsMap';
import { validateIngest } from './validateIngest';

import { DEFAULT_ACTION_DATA } from '../constants/action';
import { DEFAULT_AUGMENT } from '../constants/augment';
import { DEFAULT_DUNGEON_PREFAB } from '../constants/dungeonPrefab';
import { DEFAULT_CONSUMABLE_EFFECT, DEFAULT_ITEM_DATA } from '../constants/item';
import {
  DEFAULT_DUNGEON_GRID_LEVEL_CLASS,
  DEFAULT_EXP_LEVEL_CLASS,
  DEFAULT_GRID_LEVEL_CLASS,
  DEFAULT_PV_LEVEL_CLASS,
} from '../constants/levelClass';
import { DEFAULT_UNIT } from '../constants/unit';
import { useGameStore } from '../store/useGameStore';
import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { DungeonPrefab } from '../types/dungeonPrefab';
import { GameData } from '../types/gameData';
import { isDurationalEffectClass, Item, SEED_LOOT_CATEGORIES } from '../types/item';
import { IntLevelClass, VectorLevelClass } from '../types/levelClass';
import { SEED_GENERATOR_TAGS, Unit } from '../types/unit';

type ErrorType = 'unit' | 'action' | 'augment' | 'item' | 'prefab' | 'levelClass' | 'general';
type Error = {
  type: ErrorType;
  message: string;
};

export const useIngestV2 = ({ onLoaded }: { onLoaded?: () => void } = {}) => {
  const [errors, setErrors] = React.useState<Error[]>([]);

  const setUnits = useGameStore.use.setUnits();
  const setActions = useGameStore.use.setActions();
  const setAugments = useGameStore.use.setAugments();
  const setItems = useGameStore.use.setItems();
  const setPrefabs = useGameStore.use.setPrefabs();
  const setExpLevelClasses = useGameStore.use.setExpLevelClasses();
  const setPvLevelClasses = useGameStore.use.setPvLevelClasses();
  const setGridLevelClasses = useGameStore.use.setGridLevelClasses();
  const setDungeonGridLevelClasses = useGameStore.use.setDungeonGridLevelClasses();
  const setUnitIds = useGameStore.use.setUnitIds();
  const setItemIds = useGameStore.use.setItemIds();
  const setPrefabIds = useGameStore.use.setPrefabIds();
  const setExpLevelClassIds = useGameStore.use.setExpLevelClassIds();
  const setPvLevelClassIds = useGameStore.use.setPvLevelClassIds();
  const setGridLevelClassIds = useGameStore.use.setGridLevelClassIds();
  const setDungeonGridLevelClassIds = useGameStore.use.setDungeonGridLevelClassIds();
  const setLootCategoryIds = useGameStore.use.setLootCategoryIds();
  const setGeneratorTagIds = useGameStore.use.setGeneratorTagIds();
  const setLoaded = useGameStore.use.setLoaded();
  const reset = useGameStore.use.reset();
  const lastSaved = useGameStore.use.lastSaved();
  const setLastSaved = useGameStore.use.setLastSaved();

  const ingest = React.useCallback(
    (json: string) => {
      try {
        const data: GameData = JSON.parse(json);
        const units = ingestUnitsV2(data.units);
        const actions = ingestActionsV2(data.actions);
        const augments = ingestAugmentsV2(data.augments);
        const items = ingestItemsV2(data.items || []);
        const prefabs = ingestPrefabsV2(data.prefabs || []);
        const expLevelClasses = ingestExpLevelClassesV2(data.expLevelClasses || []);
        const pvLevelClasses = ingestPvLevelClassesV2(data.pvLevelClasses || []);
        const gridLevelClasses = ingestGridLevelClassesV2(data.gridLevelClasses || []);
        const dungeonGridLevelClasses = ingestDungeonGridLevelClassesV2(
          data.dungeonGridLevelClasses || [],
        );
        const unitIds = ingestUnitIds(data);
        const itemIds = ingestItemIds(data);
        const prefabIds = ingestPrefabIds(data);
        const expLevelClassIds = generateLevelClassIdsMap(
          Object.values(expLevelClasses),
          data.expLevelClassIds,
        );
        const pvLevelClassIds = generateLevelClassIdsMap(
          Object.values(pvLevelClasses),
          data.pvLevelClassIds,
        );
        const gridLevelClassIds = generateLevelClassIdsMap(
          Object.values(gridLevelClasses),
          data.gridLevelClassIds,
        );
        const dungeonGridLevelClassIds = generateLevelClassIdsMap(
          Object.values(dungeonGridLevelClasses),
          data.dungeonGridLevelClassIds,
        );
        // Presence-based legacy fallback: a missing field means a pre-vocabulary file (seed the
        // defaults); an explicit empty array must stay empty (so `|| defaults` would be wrong).
        const lootCategoryIds =
          data.lootCategoryIds === undefined ? [...SEED_LOOT_CATEGORIES] : data.lootCategoryIds;
        const removedLootCategoryIds = data.removedLootCategoryIds ?? [];
        const generatorTagIds =
          data.generatorTagIds === undefined ? [...SEED_GENERATOR_TAGS] : data.generatorTagIds;
        const removedGeneratorTagIds = data.removedGeneratorTagIds ?? [];
        const ingestErrors = validateIngest(
          units,
          actions,
          augments,
          prefabs,
          {
            expLevelClasses,
            pvLevelClasses,
            gridLevelClasses,
            dungeonGridLevelClasses,
          },
          {
            items,
            lootCategoryIds,
            removedLootCategoryIds,
            generatorTagIds,
            removedGeneratorTagIds,
          },
        );
        if (
          lastSaved &&
          data.updatedAt < lastSaved &&
          !window.confirm(
            'You are loading data older than the currently loaded data. Are you sure you want to proceed?',
          )
        ) {
          return;
        }
        setErrors(ingestErrors);
        reset();
        if (ingestErrors.length === 0) {
          setUnits(units);
          setActions(actions);
          setAugments(augments);
          setItems(items);
          setPrefabs(prefabs);
          setExpLevelClasses(expLevelClasses);
          setPvLevelClasses(pvLevelClasses);
          setGridLevelClasses(gridLevelClasses);
          setDungeonGridLevelClasses(dungeonGridLevelClasses);
          setUnitIds(unitIds);
          setItemIds(itemIds);
          setPrefabIds(prefabIds);
          setExpLevelClassIds(expLevelClassIds);
          setPvLevelClassIds(pvLevelClassIds);
          setGridLevelClassIds(gridLevelClassIds);
          setDungeonGridLevelClassIds(dungeonGridLevelClassIds);
          setLootCategoryIds(lootCategoryIds, removedLootCategoryIds);
          setGeneratorTagIds(generatorTagIds, removedGeneratorTagIds);
          setLoaded();
          setLastSaved(data.updatedAt);
          if (onLoaded) {
            onLoaded();
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to parse JSON:', error);
        setErrors([
          { type: 'general', message: 'Failed to parse JSON. See console for more info.' },
        ]);
      }
    },
    [
      lastSaved,
      onLoaded,
      reset,
      setActions,
      setAugments,
      setItems,
      setItemIds,
      setPrefabs,
      setPrefabIds,
      setExpLevelClasses,
      setPvLevelClasses,
      setGridLevelClasses,
      setDungeonGridLevelClasses,
      setExpLevelClassIds,
      setPvLevelClassIds,
      setGridLevelClassIds,
      setDungeonGridLevelClassIds,
      setLastSaved,
      setLoaded,
      setUnitIds,
      setUnits,
      setLootCategoryIds,
      setGeneratorTagIds,
    ],
  );

  return { ingest, errors };
};

export const ingestUnitsV2 = (rawData: Array<Unit>) => {
  const unitData = {} as Record<string, Unit>;
  rawData.forEach((unit) => {
    unitData[unit.guid] = merge({}, DEFAULT_UNIT, unit);
  });
  return unitData;
};

const ingestActionsV2 = (rawData: Array<Action>) => {
  const actionData = {} as Record<string, Action>;
  rawData.forEach((action) => {
    actionData[action.guid] = merge({}, DEFAULT_ACTION_DATA, action);
  });
  return actionData;
};

const ingestAugmentsV2 = (rawData: Array<Augment>) => {
  const augmentData = {} as Record<string, Augment>;
  rawData.forEach((augment) => {
    augmentData[augment.guid] = merge({}, DEFAULT_AUGMENT, augment);
  });
  return augmentData;
};

export const ingestItemsV2 = (rawData: Array<Item>) => {
  const itemData = {} as Record<string, Item>;
  rawData.forEach((item) => {
    const merged: Item = merge({}, DEFAULT_ITEM_DATA, item);
    // The top-level merge backfills `consumable_props` but not fields inside authored effect
    // objects (lodash merges arrays by index against an empty default). Backfill each effect
    // from DEFAULT_CONSUMABLE_EFFECT, and ensure durational effects have a stable save_key so
    // imported/sparse data matches UI-authored effects (which get a UUID at append-time).
    merged.consumable_props.effects = merged.consumable_props.effects.map((effect) => {
      const mergedEffect = merge({}, DEFAULT_CONSUMABLE_EFFECT, effect);
      if (isDurationalEffectClass(mergedEffect.effect_class) && !mergedEffect.save_key) {
        mergedEffect.save_key = crypto.randomUUID();
      }
      return mergedEffect;
    });
    itemData[item.guid] = merged;
  });
  return itemData;
};

export const ingestPrefabsV2 = (rawData: Array<DungeonPrefab>) => {
  const prefabData = {} as Record<string, DungeonPrefab>;
  rawData.forEach((prefab) => {
    prefabData[prefab.guid] = merge({}, DEFAULT_DUNGEON_PREFAB, prefab);
  });
  return prefabData;
};

const ingestUnitIds = (rawData: GameData) => generateUnitIdsMap(rawData.units, rawData.unitIds);

const ingestItemIds = (rawData: GameData) => generateItemIdsMap(rawData.items, rawData.itemIds);

export const ingestPrefabIds = (rawData: Partial<GameData>) => {
  const prefabs = rawData.prefabs || [];
  // Backward-compat: older exports may omit prefabIds. Derive the order from the
  // prefabs themselves so ingest -> export never drops the enum id list.
  const prefabIds = rawData.prefabIds ?? prefabs.map((prefab) => prefab.id);
  return generatePrefabIdsMap(prefabs, prefabIds);
};

const normalizeIntLevelClass = (levelClass: IntLevelClass): IntLevelClass => ({
  guid: levelClass.guid,
  id: levelClass.id,
  name: levelClass.name,
  levels: (levelClass.levels ?? []).map((value) => Number(value)),
});

const normalizeVectorLevelClass = (levelClass: VectorLevelClass): VectorLevelClass => ({
  guid: levelClass.guid,
  id: levelClass.id,
  name: levelClass.name,
  levels: (levelClass.levels ?? []).map((vector) => ({
    x: Number(vector.x),
    y: Number(vector.y),
  })),
});

// Each table is seeded with its well-known default class first so commanders
// (which default to the default-class guid) always resolve, then authored
// classes are layered on (overriding the default if they share a guid).
const ingestIntLevelClasses = (rawData: Array<IntLevelClass>, defaultClass: IntLevelClass) => {
  const out: Record<string, IntLevelClass> = { [defaultClass.guid]: defaultClass };
  rawData.forEach((levelClass) => {
    out[levelClass.guid] = normalizeIntLevelClass(levelClass);
  });
  return out;
};

const ingestVectorLevelClasses = (
  rawData: Array<VectorLevelClass>,
  defaultClass: VectorLevelClass,
) => {
  const out: Record<string, VectorLevelClass> = { [defaultClass.guid]: defaultClass };
  rawData.forEach((levelClass) => {
    out[levelClass.guid] = normalizeVectorLevelClass(levelClass);
  });
  return out;
};

export const ingestExpLevelClassesV2 = (rawData: Array<IntLevelClass>) =>
  ingestIntLevelClasses(rawData, DEFAULT_EXP_LEVEL_CLASS);

export const ingestPvLevelClassesV2 = (rawData: Array<IntLevelClass>) =>
  ingestIntLevelClasses(rawData, DEFAULT_PV_LEVEL_CLASS);

export const ingestGridLevelClassesV2 = (rawData: Array<VectorLevelClass>) =>
  ingestVectorLevelClasses(rawData, DEFAULT_GRID_LEVEL_CLASS);

export const ingestDungeonGridLevelClassesV2 = (rawData: Array<VectorLevelClass>) =>
  ingestVectorLevelClasses(rawData, DEFAULT_DUNGEON_GRID_LEVEL_CLASS);
