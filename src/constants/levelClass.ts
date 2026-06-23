import {
  DungeonGridLevelClass,
  ExpLevelClass,
  GeneratorClass,
  GridLevelClass,
  PvLevelClass,
} from '../types/levelClass';

// Stable, well-known default classes. Every commander references these by guid
// unless a developer deliberately picks another. The guids are fixed so
// DEFAULT_COMMANDER_DATA can point at them deterministically, and they are
// seeded into game-data.json on export.
export const DEFAULT_EXP_LEVEL_CLASS_ID = 'DEFAULT_EXP';
export const DEFAULT_PV_LEVEL_CLASS_ID = 'DEFAULT_PV';
export const DEFAULT_GRID_LEVEL_CLASS_ID = 'DEFAULT_GRID';
export const DEFAULT_DUNGEON_GRID_LEVEL_CLASS_ID = 'DEFAULT_DUNGEON_GRID';
export const DEFAULT_GENERATOR_CLASS_ID = 'DEFAULT_GENERATOR';

export const DEFAULT_EXP_LEVEL_CLASS_GUID = '00000000-0000-4000-8000-000000000e01';
export const DEFAULT_PV_LEVEL_CLASS_GUID = '00000000-0000-4000-8000-000000000e02';
export const DEFAULT_GRID_LEVEL_CLASS_GUID = '00000000-0000-4000-8000-000000000e03';
export const DEFAULT_DUNGEON_GRID_LEVEL_CLASS_GUID = '00000000-0000-4000-8000-000000000e04';
export const DEFAULT_GENERATOR_CLASS_GUID = '00000000-0000-4000-8000-000000000e05';

export const DEFAULT_EXP_LEVEL_CLASS: ExpLevelClass = {
  guid: DEFAULT_EXP_LEVEL_CLASS_GUID,
  id: DEFAULT_EXP_LEVEL_CLASS_ID,
  name: 'Default EXP',
  levels: [0, 1000],
};

export const DEFAULT_PV_LEVEL_CLASS: PvLevelClass = {
  guid: DEFAULT_PV_LEVEL_CLASS_GUID,
  id: DEFAULT_PV_LEVEL_CLASS_ID,
  name: 'Default PV',
  levels: [2000, 1000],
};

export const DEFAULT_GRID_LEVEL_CLASS: GridLevelClass = {
  guid: DEFAULT_GRID_LEVEL_CLASS_GUID,
  id: DEFAULT_GRID_LEVEL_CLASS_ID,
  name: 'Default Grid',
  levels: [
    { x: 12, y: 20 },
    { x: 12, y: 20 },
  ],
};

export const DEFAULT_DUNGEON_GRID_LEVEL_CLASS: DungeonGridLevelClass = {
  guid: DEFAULT_DUNGEON_GRID_LEVEL_CLASS_GUID,
  id: DEFAULT_DUNGEON_GRID_LEVEL_CLASS_ID,
  name: 'Default Dungeon Grid',
  levels: [
    { x: 2, y: 5 },
    { x: 2, y: 5 },
  ],
};

export const DEFAULT_GENERATOR_CLASS: GeneratorClass = {
  guid: DEFAULT_GENERATOR_CLASS_GUID,
  id: DEFAULT_GENERATOR_CLASS_ID,
  name: 'Default Generator',
  jitter: [10],
  rarity_pressure: [2],
};

// Blank templates used when creating a brand-new class in the editor.
export const NEW_INT_LEVEL_CLASS: ExpLevelClass = { guid: '', id: '', name: '', levels: [] };
export const NEW_VECTOR_LEVEL_CLASS: GridLevelClass = { guid: '', id: '', name: '', levels: [] };
export const NEW_GENERATOR_CLASS: GeneratorClass = {
  guid: '',
  id: '',
  name: '',
  jitter: [],
  rarity_pressure: [],
};
