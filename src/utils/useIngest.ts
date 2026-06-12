/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { merge } from 'lodash';
import * as React from 'react';

import { generateItemIdsMap } from './generateItemIdsMap';
import { generateUnitIdsMap } from './generateUnitIdsMap';
import { validateIngest } from './validateIngest';

import { DEFAULT_ACTION_DATA } from '../constants/action';
import { DEFAULT_AUGMENT } from '../constants/augment';
import { DEFAULT_CONSUMABLE_EFFECT, DEFAULT_ITEM_DATA } from '../constants/item';
import { DEFAULT_UNIT } from '../constants/unit';
import { useGameStore } from '../store/useGameStore';
import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { GameData } from '../types/gameData';
import { isDurationalEffectClass, Item } from '../types/item';
import { Unit } from '../types/unit';

type ErrorType = 'unit' | 'action' | 'augment' | 'item' | 'general';
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
  const setUnitIds = useGameStore.use.setUnitIds();
  const setItemIds = useGameStore.use.setItemIds();
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
        const unitIds = ingestUnitIds(data);
        const itemIds = ingestItemIds(data);
        const ingestErrors = validateIngest(units, actions, augments);
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
          setUnitIds(unitIds);
          setItemIds(itemIds);
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
      setLastSaved,
      setLoaded,
      setUnitIds,
      setUnits,
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

const ingestUnitIds = (rawData: GameData) => generateUnitIdsMap(rawData.units, rawData.unitIds);

const ingestItemIds = (rawData: GameData) => generateItemIdsMap(rawData.items, rawData.itemIds);
