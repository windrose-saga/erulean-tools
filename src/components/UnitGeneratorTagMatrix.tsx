import * as React from 'react';

import { TagMatrix } from './TagMatrix';

import { useUnits } from '../store/getters/unit';
import { useActiveGeneratorTags } from '../store/getters/vocab';
import { useGameStore } from '../store/useGameStore';
import { Unit } from '../types/unit';

export const UnitGeneratorTagMatrix = () => {
  const units = useUnits();
  const tags = useActiveGeneratorTags();
  const setUnit = useGameStore.use.setUnit();
  const addGeneratorTag = useGameStore.use.addGeneratorTag();

  const onToggle = React.useCallback(
    (unit: Unit, tag: string, next: boolean) => {
      const generator_tags = next
        ? [...unit.generator_tags, tag]
        : unit.generator_tags.filter((t) => t !== tag);
      setUnit({ ...unit, generator_tags });
    },
    [setUnit],
  );

  return (
    <TagMatrix
      rows={units}
      columns={tags}
      noun="tag"
      getValues={(unit) => unit.generator_tags}
      onToggle={onToggle}
      onAddColumn={addGeneratorTag}
    />
  );
};
