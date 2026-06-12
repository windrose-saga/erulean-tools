import { DungeonPrefab } from '../types/dungeonPrefab';

export const generatePrefabIdsMap = (prefabs: Array<DungeonPrefab>, prefabIds: Array<string>) => {
  const guidToId = new Map<string, string>();

  // Create reverse lookup for prefab id to guid
  const idToGuid = new Map(prefabs.map((prefab) => [prefab.id, prefab.guid]));

  // Validate each prefab type exists and build the map
  prefabIds.forEach((prefabId) => {
    const guid = idToGuid.get(prefabId);
    if (!guid) {
      throw new Error(`Prefab type '${prefabId}' not found in game store`);
    }
    guidToId.set(guid, prefabId);
  });
  return guidToId;
};
