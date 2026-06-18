import { createFileRoute } from '@tanstack/react-router';

import { GeneratorTagManager } from '../components/GeneratorTagManager';
import { UnitGeneratorTagMatrix } from '../components/UnitGeneratorTagMatrix';
import { VocabViewSwitcher } from '../components/VocabViewSwitcher';
import { withLoadingGate } from '../utils/withLoadingGate';

const GeneratorTagsPage = () => (
  <VocabViewSwitcher manageView={<GeneratorTagManager />} matrixView={<UnitGeneratorTagMatrix />} />
);

export const Route = createFileRoute('/generator-tags/')({
  component: withLoadingGate(GeneratorTagsPage),
});
