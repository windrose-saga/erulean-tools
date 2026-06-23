import * as React from 'react';

import { useActions } from '../store/getters/action';
import { useAugments } from '../store/getters/augment';
import { useItems } from '../store/getters/item';
import {
  useDungeonGridLevelClasses,
  useExpLevelClasses,
  useGeneratorClasses,
  useGridLevelClasses,
  usePvLevelClasses,
} from '../store/getters/levelClass';
import { usePrefabs } from '../store/getters/prefab';
import { useUnits } from '../store/getters/unit';
import { useGameStore } from '../store/useGameStore';
import { GameData } from '../types/gameData';

export const useExportStore = () => {
  const units = useUnits();
  const actions = useActions();
  const augments = useAugments();
  const items = useItems();
  const prefabs = usePrefabs();
  const expLevelClasses = useExpLevelClasses();
  const pvLevelClasses = usePvLevelClasses();
  const gridLevelClasses = useGridLevelClasses();
  const dungeonGridLevelClasses = useDungeonGridLevelClasses();
  const generatorClasses = useGeneratorClasses();
  const lastLoaded = useGameStore.use.lastLoaded();
  const setExported = useGameStore.use.setExported();
  const unitIds = useGameStore.use.unitIds();
  const itemIds = useGameStore.use.itemIds();
  const prefabIds = useGameStore.use.prefabIds();
  const expLevelClassIds = useGameStore.use.expLevelClassIds();
  const pvLevelClassIds = useGameStore.use.pvLevelClassIds();
  const gridLevelClassIds = useGameStore.use.gridLevelClassIds();
  const dungeonGridLevelClassIds = useGameStore.use.dungeonGridLevelClassIds();
  const generatorClassIds = useGameStore.use.generatorClassIds();
  const lootCategoryIds = useGameStore.use.lootCategoryIds();
  const removedLootCategoryIds = useGameStore.use.removedLootCategoryIds();
  const generatorTagIds = useGameStore.use.generatorTagIds();
  const removedGeneratorTagIds = useGameStore.use.removedGeneratorTagIds();

  const translatedUnits = units.map((unit) => {
    const translation_id: string = `unit.${unit.id}`;
    const name_translation_key: string = `${translation_id}.name`;
    const description_translation_key: string = `${translation_id}.description`;
    const train_button_text_translation_key: string = `${translation_id}.train_button_text`;

    const translatedCommanderData = {
      ...unit.commander_data,
      army_name_translation_key: `${translation_id}.army_name`,
    };
    return {
      ...unit,
      commander_data: translatedCommanderData,
      translation_id,
      name_translation_key,
      description_translation_key,
      train_button_text_translation_key,
    };
  });

  const translatedActions = actions.map((action) => {
    const translation_id: string = `action.${action.id}`;
    const name_translation_key: string = `${translation_id}.name`;
    const description_translation_key: string = `${translation_id}.description`;

    return {
      ...action,
      translation_id,
      name_translation_key,
      description_translation_key,
    };
  });

  const translatedAugments = augments.map((augment) => {
    const translation_id: string = `augment.${augment.id}`;
    const name_translation_key: string = `${translation_id}.name`;
    const description_translation_key: string = `${translation_id}.description`;

    return {
      ...augment,
      translation_id,
      name_translation_key,
      description_translation_key,
    };
  });

  const translatedItems = items.map((item) => {
    const translation_id: string = `item.${item.id}`;
    const name_translation_key: string = `${translation_id}.name`;
    const description_translation_key: string = `${translation_id}.description`;

    return {
      ...item,
      translation_id,
      name_translation_key,
      description_translation_key,
    };
  });

  const trainableUnits = units.filter((unit) => unit.trainable).map((unit) => unit.id);

  return React.useCallback(() => {
    const exportStore: GameData = {
      units: translatedUnits,
      actions: translatedActions,
      augments: translatedAugments,
      items: translatedItems,
      prefabs,
      expLevelClasses,
      pvLevelClasses,
      gridLevelClasses,
      dungeonGridLevelClasses,
      generatorClasses,
      unitIds: Array.from(unitIds.values()),
      itemIds: Array.from(itemIds.values()),
      prefabIds: Array.from(prefabIds.values()),
      expLevelClassIds: Array.from(expLevelClassIds.values()),
      pvLevelClassIds: Array.from(pvLevelClassIds.values()),
      gridLevelClassIds: Array.from(gridLevelClassIds.values()),
      dungeonGridLevelClassIds: Array.from(dungeonGridLevelClassIds.values()),
      generatorClassIds: Array.from(generatorClassIds.values()),
      lootCategoryIds: [...lootCategoryIds],
      removedLootCategoryIds: [...removedLootCategoryIds],
      generatorTagIds: [...generatorTagIds],
      removedGeneratorTagIds: [...removedGeneratorTagIds],
      trainable_units: trainableUnits,
      updatedAt: lastLoaded ?? Date.now(),
    };
    const jsonExport = JSON.stringify(exportStore, null, 2);
    const jsonExportWithNewLine = `${jsonExport}\n`;
    const blob = new Blob([jsonExportWithNewLine], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-data.json';
    a.click();
    URL.revokeObjectURL(url);
    setExported();
  }, [
    translatedUnits,
    translatedActions,
    translatedAugments,
    translatedItems,
    prefabs,
    expLevelClasses,
    pvLevelClasses,
    gridLevelClasses,
    dungeonGridLevelClasses,
    generatorClasses,
    unitIds,
    itemIds,
    prefabIds,
    expLevelClassIds,
    pvLevelClassIds,
    gridLevelClassIds,
    dungeonGridLevelClassIds,
    generatorClassIds,
    lootCategoryIds,
    removedLootCategoryIds,
    generatorTagIds,
    removedGeneratorTagIds,
    trainableUnits,
    lastLoaded,
    setExported,
  ]);
};
