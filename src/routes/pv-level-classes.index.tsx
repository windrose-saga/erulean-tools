import { createFileRoute } from '@tanstack/react-router';

import { LevelClassList } from '../components/LevelClassList';
import { withLoadingGate } from '../utils/withLoadingGate';

const PvLevelClassList = () => <LevelClassList kind="PV" />;

export const Route = createFileRoute('/pv-level-classes/')({
  component: withLoadingGate(PvLevelClassList),
});
