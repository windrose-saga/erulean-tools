import { describe, expect, it } from 'vitest';

import {
  createDungeonPrefabGridFromText,
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
});
