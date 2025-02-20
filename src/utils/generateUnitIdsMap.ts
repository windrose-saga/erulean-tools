import { Unit } from '../types/unit';

export const generateUnitIdsMap = (units: Array<Unit>, unitIds: Array<string>) => {
  const guidToId = new Map<string, string>();

  // Create reverse lookup for unit id to guid
  const idToGuid = new Map(units.map((unit) => [unit.id, unit.guid]));

  // Validate each unit type exists and build the map
  unitIds.forEach((unitId) => {
    const guid = idToGuid.get(unitId);
    if (!guid) {
      throw new Error(`Unit type '${unitId}' not found in game store`);
    }
    guidToId.set(guid, unitId);
  });
  return guidToId;
};
