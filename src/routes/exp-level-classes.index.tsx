import { createFileRoute } from '@tanstack/react-router';

import { LevelClassList } from '../components/LevelClassList';
import { withLoadingGate } from '../utils/withLoadingGate';

const ExpLevelClassList = () => <LevelClassList kind="EXP" />;

export const Route = createFileRoute('/exp-level-classes/')({
  component: withLoadingGate(ExpLevelClassList),
});
