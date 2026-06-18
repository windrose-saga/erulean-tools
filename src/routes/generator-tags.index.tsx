import { createFileRoute } from '@tanstack/react-router';

import { GeneratorTagManager } from '../components/GeneratorTagManager';
import { withLoadingGate } from '../utils/withLoadingGate';

export const Route = createFileRoute('/generator-tags/')({
  component: withLoadingGate(GeneratorTagManager),
});
