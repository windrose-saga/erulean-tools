import { createFileRoute } from '@tanstack/react-router';

import { LevelClassList } from '../components/LevelClassList';
import { withLoadingGate } from '../utils/withLoadingGate';

const DungeonGridLevelClassList = () => <LevelClassList kind="DUNGEON_GRID" />;

export const Route = createFileRoute('/dungeon-grid-level-classes/')({
  component: withLoadingGate(DungeonGridLevelClassList),
});
