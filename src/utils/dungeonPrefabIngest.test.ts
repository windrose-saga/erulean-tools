import { describe, expect, it } from 'vitest';

import { ingestPrefabIds, ingestPrefabsV2 } from './useIngest';

import { DungeonPrefab } from '../types/dungeonPrefab';
import { GameData } from '../types/gameData';

const prefab = (id: string): DungeonPrefab =>
  ({ guid: `guid-${id}`, id, layout: '*' }) as unknown as DungeonPrefab;

describe('ingestPrefabsV2', () => {
  it('preserves authored fields and backfills missing ones from DEFAULT_DUNGEON_PREFAB', () => {
    const result = ingestPrefabsV2([
      { guid: 'g1', id: 'ROOM', layout: '###*###\n#...#\n###*###' } as unknown as DungeonPrefab,
    ]);
    // authored fields are preserved
    expect(result.g1.id).toBe('ROOM');
    expect(result.g1.layout).toContain('*');
    // missing field filled from the default (no name authored)
    expect(result.g1.name).toBe('');
  });
});

describe('ingestPrefabIds backward compatibility / ordering', () => {
  it('returns an empty map when a file has no prefabs or prefabIds (old data survives)', () => {
    const oldData: Partial<GameData> = { units: [], items: [] } as Partial<GameData>;
    expect(ingestPrefabIds(oldData).size).toBe(0);
  });

  it('preserves the prefabIds order from the file', () => {
    const data: Partial<GameData> = {
      prefabs: [prefab('A'), prefab('B'), prefab('C')],
      prefabIds: ['C', 'A', 'B'],
    };
    expect(Array.from(ingestPrefabIds(data).values())).toEqual(['C', 'A', 'B']);
  });

  it('derives prefabIds from prefabs (in order) when the key is missing', () => {
    const data: Partial<GameData> = {
      prefabs: [prefab('A'), prefab('B'), prefab('C')],
    };
    expect(Array.from(ingestPrefabIds(data).values())).toEqual(['A', 'B', 'C']);
  });
});
