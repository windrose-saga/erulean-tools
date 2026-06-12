import { describe, expect, it } from 'vitest';

import {
  createDungeonPrefabGridFromText,
  floodFillDungeonPrefabGrid,
  resizeDungeonPrefabGrid,
  serializeDungeonPrefabGrid,
} from './dungeonPrefabLayout';

describe('dungeon prefab layout utilities', () => {
  it('trims blank edge lines and pads short rows with walls', () => {
    const grid = createDungeonPrefabGridFromText('\n*.\n.\n');

    expect(serializeDungeonPrefabGrid(grid)).toBe('*.\n.#');
  });

  it('extracts layout text from a Godot resource assignment', () => {
    const grid = createDungeonPrefabGridFromText(`[resource]
script = ExtResource("1_script")
layout = "###*###
##...##
#.....#"
allow_rotation = true`);

    expect(serializeDungeonPrefabGrid(grid)).toBe('###*###\n##...##\n#.....#');
  });

  it('normalizes non-prefab glyphs to wall tiles', () => {
    const grid = createDungeonPrefabGridFromText(' #*\na.b');

    expect(serializeDungeonPrefabGrid(grid)).toBe('##*\n#.#');
  });

  it('resizes while preserving existing cells from the top-left', () => {
    const grid = createDungeonPrefabGridFromText('*.\n..');

    expect(serializeDungeonPrefabGrid(resizeDungeonPrefabGrid(grid, 3, 1))).toBe('*.#');
  });

  it('flood-fills the contiguous region sharing the start tile (4-connected)', () => {
    // A wall ring around a floor interior; filling the interior must not leak past the walls.
    const grid = createDungeonPrefabGridFromText('#####\n#...#\n#...#\n#####');

    expect(serializeDungeonPrefabGrid(floodFillDungeonPrefabGrid(grid, 2, 1, '*'))).toBe(
      '#####\n#***#\n#***#\n#####',
    );
  });

  it('returns the grid unchanged when the start cell already holds the target tile', () => {
    const grid = createDungeonPrefabGridFromText('..\n..');

    expect(floodFillDungeonPrefabGrid(grid, 0, 0, '.')).toBe(grid);
  });

  it('does not bleed diagonally across a wall', () => {
    // Two floor cells touching only at a corner stay separate regions.
    const grid = createDungeonPrefabGridFromText('.#\n#.');

    expect(serializeDungeonPrefabGrid(floodFillDungeonPrefabGrid(grid, 0, 0, '*'))).toBe('*#\n#.');
  });
});
