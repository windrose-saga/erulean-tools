export type Vector2 = { x: number; y: number };

type LevelClassBase = { guid: string; id: string; name: string };

// EXP/PV classes carry a flat list of integers; Grid/DungeonGrid carry Vector2s.
// The named types are kept distinct (for store slices + clarity) but are
// structurally just the two shapes below.
export type IntLevelClass = LevelClassBase & { levels: number[] };
export type VectorLevelClass = LevelClassBase & { levels: Vector2[] };

export type ExpLevelClass = IntLevelClass;
export type PvLevelClass = IntLevelClass;
export type GridLevelClass = VectorLevelClass;
export type DungeonGridLevelClass = VectorLevelClass;

export const LEVEL_CLASS_KINDS = ['EXP', 'PV', 'GRID', 'DUNGEON_GRID'] as const;
export type LevelClassKind = (typeof LEVEL_CLASS_KINDS)[number];
