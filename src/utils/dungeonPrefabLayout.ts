export const DUNGEON_PREFAB_TILES = ['#', '.', '*'] as const;

export type DungeonPrefabTile = (typeof DUNGEON_PREFAB_TILES)[number];
export type DungeonPrefabGrid = DungeonPrefabTile[][];

export const WALL_TILE: DungeonPrefabTile = '#';
export const FLOOR_TILE: DungeonPrefabTile = '.';
export const CONNECTOR_TILE: DungeonPrefabTile = '*';

export const DEFAULT_DUNGEON_PREFAB_LAYOUT = `#######*###
#.........#
#.........#
#.........#
#.........#
####*######`;

const GODOT_LAYOUT_PROPERTY_PATTERN = /(?:^|\n)\s*layout\s*=\s*"([\s\S]*?)"/;

const isDungeonPrefabTile = (value: string): value is DungeonPrefabTile =>
  DUNGEON_PREFAB_TILES.includes(value as DungeonPrefabTile);

const decodeGodotString = (value: string): string =>
  value.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

const extractLayoutText = (text: string): string => {
  const match = text.match(GODOT_LAYOUT_PROPERTY_PATTERN);
  return match ? decodeGodotString(match[1]) : text;
};

const trimBlankEdgeLines = (lines: string[]): string[] => {
  const firstContentIndex = lines.findIndex((line) => line.trim().length > 0);

  if (firstContentIndex === -1) {
    return [];
  }

  const reversedLastContentIndex = [...lines].reverse().findIndex((line) => line.trim().length > 0);
  const lastContentIndex = lines.length - reversedLastContentIndex;

  return lines.slice(firstContentIndex, lastContentIndex);
};

const removeCommonIndent = (lines: string[]): string[] => {
  const contentLines = lines.filter((line) => line.trim().length > 0);
  const commonIndent = Math.min(...contentLines.map((line) => line.match(/^\s*/)?.[0].length ?? 0));

  if (!Number.isFinite(commonIndent) || commonIndent === 0) {
    return lines;
  }

  return lines.map((line) => line.slice(commonIndent));
};

export const createFilledDungeonPrefabGrid = (
  width: number,
  height: number,
  tile: DungeonPrefabTile = WALL_TILE,
): DungeonPrefabGrid =>
  Array.from({ length: height }, () => Array.from({ length: width }, () => tile));

export const createDungeonPrefabGridFromText = (text: string): DungeonPrefabGrid => {
  const source = extractLayoutText(text);
  const contentLines = removeCommonIndent(
    trimBlankEdgeLines(source.split('\n').map((line) => line.replace(/\r$/, ''))),
  );
  const width = contentLines.reduce((maxWidth, line) => Math.max(maxWidth, line.length), 0);

  if (width === 0) {
    return [];
  }

  return contentLines.map((line) =>
    Array.from({ length: width }, (_, index) => {
      const glyph = line[index] ?? WALL_TILE;
      return isDungeonPrefabTile(glyph) ? glyph : WALL_TILE;
    }),
  );
};

export const resizeDungeonPrefabGrid = (
  grid: DungeonPrefabGrid,
  width: number,
  height: number,
  fillTile: DungeonPrefabTile = WALL_TILE,
): DungeonPrefabGrid =>
  Array.from({ length: height }, (_row, y) =>
    Array.from({ length: width }, (_column, x) => grid[y]?.[x] ?? fillTile),
  );

export const serializeDungeonPrefabGrid = (grid: DungeonPrefabGrid): string =>
  grid.map((row) => row.join('')).join('\n');
