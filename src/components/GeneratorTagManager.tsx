import { VocabManager } from './VocabManager';

import { useGameStore } from '../store/useGameStore';

export const GeneratorTagManager = () => {
  const generatorTagIds = useGameStore.use.generatorTagIds();
  const removedGeneratorTagIds = useGameStore.use.removedGeneratorTagIds();
  const addGeneratorTag = useGameStore.use.addGeneratorTag();
  const removeGeneratorTag = useGameStore.use.removeGeneratorTag();
  const renameGeneratorTag = useGameStore.use.renameGeneratorTag();

  const activeNames = generatorTagIds.filter((name) => !removedGeneratorTagIds.includes(name));

  return (
    <VocabManager
      title="Generator Tags"
      noun="tag"
      activeNames={activeNames}
      removedNames={removedGeneratorTagIds}
      onAdd={addGeneratorTag}
      onRemove={removeGeneratorTag}
      onRename={renameGeneratorTag}
    />
  );
};
