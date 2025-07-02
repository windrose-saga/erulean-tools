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

  // const migratedUnits = units.map((unit) => {
  //   const primary_action = actions.find((action) => action.guid === unit.actions.primary_action);
  //   const special_action = actions.find((action) => action.guid === unit.actions.special_action);
  //   const passive_action = actions.find((action) => action.guid === unit.actions.passive_action);

  //   const deltas: Partial<Actions> = {
  //     primary_action_mana_delta: primary_action?.mana_delta ?? 0,
  //     special_action_mana_delta: special_action?.mana_delta ?? 0,
  //     passive_action_mana_delta: passive_action?.mana_delta ?? 0,
  //   };
  //   return {
  //     ...unit,
  //     actions: {
  //       ...unit.actions,
  //       ...deltas,
  //     },
  //   };
  // });

  return React.useCallback(() => {
    const exportStore: GameData = {
      units,
      actions,
      augments,
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
  }, [units, actions, augments, unitIds, lastLoaded, setExported]);
};
