import { createFileRoute } from '@tanstack/react-router';

import { PrefabList } from '../components/PrefabList';
import { withLoadingGate } from '../utils/withLoadingGate';

export const Route = createFileRoute('/prefabs/')({
  component: withLoadingGate(PrefabList),
});
