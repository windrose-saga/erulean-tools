import * as React from 'react';

import { useActions } from '../store/getters/action';
import { useAugments } from '../store/getters/augment';
import { useUnits } from '../store/getters/unit';
import { useGameStore } from '../store/useGameStore';

export const useExportStore = () => {
  const units = useUnits();
  const actions = useActions();
  const augments = useAugments();
  const setLoaded = useGameStore.use.setLoaded();

  return React.useCallback(() => {
    const exportStore = {
      units,
      actions,
      augments,
    };
    const jsonExport = JSON.stringify(exportStore, null, 2);
    const blob = new Blob([jsonExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-data.json';
    a.click();
    URL.revokeObjectURL(url);
    setLoaded();
  }, [units, actions, augments, setLoaded]);
};
