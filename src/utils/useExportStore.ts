import * as React from 'react';

import { useActions } from '../store/getters/action';
import { useAugments } from '../store/getters/augment';
import { useUnits } from '../store/getters/unit';
import { useGameStore } from '../store/useGameStore';
import { GameData } from '../types/gameData';

export const useExportStore = () => {
  const units = useUnits();
  const actions = useActions();
  const augments = useAugments();
  const lastLoaded = useGameStore.use.lastLoaded();
  const setExported = useGameStore.use.setExported();
  const unitIds = useGameStore.use.unitIds();

  const translatedUnits = units.map((unit) => {
    const translation_id: string = `unit.${unit.id}`;
    const name_translation_key: string = `${translation_id}.name`;
    const description_translation_key: string = `${translation_id}.description`;

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

  return React.useCallback(() => {
    const exportStore: GameData = {
      units: translatedUnits,
      actions: translatedActions,
      augments: translatedAugments,
      unitIds: Array.from(unitIds.values()),
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
  }, [translatedUnits, translatedActions, translatedAugments, unitIds, lastLoaded, setExported]);
};
