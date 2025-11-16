/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as React from 'react';

import { generateUnitIdsMap } from './generateUnitIdsMap';
import { getActionData } from './parsers/action';
import { getAugmentData } from './parsers/augment';
import { getUnitData } from './parsers/unit';
import { validateIngest } from './validateIngest';

import { useGameStore } from '../store/useGameStore';
import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { GameData } from '../types/gameData';
import { Item } from '../types/item';
import { Unit } from '../types/unit';

const ACTION_SHEET_GUID = '288ae487-6d6a-411e-b468-ab415b4ba7e6';
const UNIT_SHEET_GUID = 'c4ca663f-445a-4bcb-bf4e-4cd51455c0a5';
const AUGMENT_SHEET_GUID = '4d53960f-f75e-4721-ad17-90d124808b18';

type ErrorType = 'unit' | 'action' | 'augment' | 'item' | 'general';
type Error = {
  type: ErrorType;
  message: string;
};

export const useIngest = ({ onLoaded }: { onLoaded?: () => void } = {}) => {
  const [errors, setErrors] = React.useState<Error[]>([]);

  const setUnits = useGameStore.use.setUnits();
  const setActions = useGameStore.use.setActions();
  const setAugments = useGameStore.use.setAugments();
  const setItems = useGameStore.use.setItems();
  const setLoaded = useGameStore.use.setLoaded();
  const reset = useGameStore.use.reset();
  const lastSaved = useGameStore.use.lastSaved();
  const setLastSaved = useGameStore.use.setLastSaved();

  const ingest = React.useCallback(
    (json: string) => {
      try {
        const data = JSON.parse(json);
        const units = ingestUnits(data.sheets);
        const actions = ingestActions(data.sheets);
        const augments = ingestAugments(data.sheets);
        const items = {}; // V1 doesn't support items
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
    [lastSaved, onLoaded, reset, setActions, setAugments, setItems, setLastSaved, setLoaded, setUnits],
  );

  return { ingest, errors };
};

const getUnitLines = (data: Array<any>) =>
  data.find((sheet: any) => sheet.guid === UNIT_SHEET_GUID).lines;

const getActionLines = (data: Array<any>) =>
  data.find((sheet: any) => sheet.guid === ACTION_SHEET_GUID).lines;

const getAugmentLines = (data: Array<any>) =>
  data.find((sheet: any) => sheet.guid === AUGMENT_SHEET_GUID).lines;

const ingestUnits = (data: Array<any>) => {
  const unitData = {} as Record<string, Unit>;
  const lines = getUnitLines(data);
  lines.forEach((line: any) => {
    const unit = getUnitData(line);
    unitData[unit.guid] = unit;
  });
  return unitData;
};

const ingestActions = (data: Array<any>) => {
  const actionData = {} as Record<string, Action>;
  const lines = getActionLines(data);
  lines.forEach((line: any) => {
    const action = getActionData(line);
    actionData[action.guid] = action;
  });
  return actionData;
};

const ingestAugments = (data: Array<any>) => {
  const augmentData = {} as Record<string, Augment>;
  const lines = getAugmentLines(data);
  lines.forEach((line: any) => {
    const augment = getAugmentData(line);
    augmentData[augment.guid] = augment;
  });
  return augmentData;
};

export const useIngestV2 = ({ onLoaded }: { onLoaded?: () => void } = {}) => {
  const [errors, setErrors] = React.useState<Error[]>([]);

  const setUnits = useGameStore.use.setUnits();
  const setActions = useGameStore.use.setActions();
  const setAugments = useGameStore.use.setAugments();
  const setItems = useGameStore.use.setItems();
  const setUnitIds = useGameStore.use.setUnitIds();
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
      setLastSaved,
      setLoaded,
      setUnitIds,
      setUnits,
    ],
  );

  return { ingest, errors };
};

const ingestUnitsV2 = (rawData: Array<Unit>) => {
  const unitData = {} as Record<string, Unit>;
  rawData.forEach((unit) => {
    unitData[unit.guid] = unit;
  });
  return unitData;
};

const ingestActionsV2 = (rawData: Array<Action>) => {
  const actionData = {} as Record<string, Action>;
  rawData.forEach((action) => {
    actionData[action.guid] = action;
  });
  return actionData;
};

const ingestAugmentsV2 = (rawData: Array<Augment>) => {
  const augmentData = {} as Record<string, Augment>;
  rawData.forEach((augment) => {
    augmentData[augment.guid] = augment;
  });
  return augmentData;
};

const ingestItemsV2 = (rawData: Array<Item>) => {
  const itemData = {} as Record<string, Item>;
  rawData.forEach((item) => {
    itemData[item.guid] = item;
  });
  return itemData;
};

const ingestUnitIds = (rawData: GameData) => generateUnitIdsMap(rawData.units, rawData.unitIds);
