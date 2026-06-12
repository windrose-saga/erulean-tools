import { createFileRoute } from '@tanstack/react-router';

import DungeonPrefabEditor from '../screens/DungeonPrefabEditor';

export const Route = createFileRoute('/dungeon-prefab-editor')({
  component: DungeonPrefabEditor,
});
