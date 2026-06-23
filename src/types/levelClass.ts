export type Vector2 = { x: number; y: number };

type LevelClassBase = { guid: string; id: string; name: string };

// EXP/PV classes carry a flat list of integers; Grid/DungeonGrid carry Vector2s.
// The named types are kept distinct (for store slices + clarity) but are
// structurally just the two shapes below.
export type IntLevelClass = LevelClassBase & { levels: number[] };
export type VectorLevelClass = LevelClassBase & { levels: Vector2[] };
// Army generator curves carry two parallel per-level float arrays rather than a single
// `levels` list: jitter[N] and rarity_pressure[N] are the values at level N.
export type GeneratorClass = LevelClassBase & { jitter: number[]; rarity_pressure: number[] };

export type ExpLevelClass = IntLevelClass;
export type PvLevelClass = IntLevelClass;
export type GridLevelClass = VectorLevelClass;
export type DungeonGridLevelClass = VectorLevelClass;

export const LEVEL_CLASS_KINDS = ['EXP', 'PV', 'GRID', 'DUNGEON_GRID', 'GENERATOR'] as const;
export type LevelClassKind = (typeof LEVEL_CLASS_KINDS)[number];
