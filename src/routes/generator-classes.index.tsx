import { createFileRoute } from '@tanstack/react-router';

import { LevelClassList } from '../components/LevelClassList';
import { withLoadingGate } from '../utils/withLoadingGate';

const GeneratorClassList = () => <LevelClassList kind="GENERATOR" />;

export const Route = createFileRoute('/generator-classes/')({
  component: withLoadingGate(GeneratorClassList),
});
