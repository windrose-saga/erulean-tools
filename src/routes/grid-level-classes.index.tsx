import { createFileRoute } from '@tanstack/react-router';

import { LevelClassList } from '../components/LevelClassList';
import { withLoadingGate } from '../utils/withLoadingGate';

const GridLevelClassList = () => <LevelClassList kind="GRID" />;

export const Route = createFileRoute('/grid-level-classes/')({
  component: withLoadingGate(GridLevelClassList),
});
