import { Item } from '../types/item';

export const generateItemIdsMap = (items: Array<Item>, itemIds: Array<string>) => {
  const guidToId = new Map<string, string>();

  // Create reverse lookup for item id to guid
  const idToGuid = new Map(items.map((item) => [item.id, item.guid]));

  // Validate each item type exists and build the map
  itemIds.forEach((itemId) => {
    const guid = idToGuid.get(itemId);
    if (!guid) {
      throw new Error(`Item type '${itemId}' not found in game store`);
    }
    guidToId.set(guid, itemId);
  });
  return guidToId;
};
