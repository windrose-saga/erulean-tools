import * as React from 'react';

import { useActions } from '../store/getters/action';
import { useAugments } from '../store/getters/augment';
import { useItems } from '../store/getters/item';
import { useUnits } from '../store/getters/unit';
import { useGameStore } from '../store/useGameStore';
import { GameData } from '../types/gameData';

export const useExportStore = () => {
  const units = useUnits();
  const actions = useActions();
  const augments = useAugments();
  const items = useItems();
  const lastLoaded = useGameStore.use.lastLoaded();
  const setExported = useGameStore.use.setExported();
  const unitIds = useGameStore.use.unitIds();
  const itemIds = useGameStore.use.itemIds();

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
      unitIds: Array.from(unitIds.values()),
      itemIds: Array.from(itemIds.values()),
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
    unitIds,
    itemIds,
    trainableUnits,
    lastLoaded,
    setExported,
  ]);
};
