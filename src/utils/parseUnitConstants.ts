import React from 'react';

import { useUnits } from '../store/getters/unit';

export const useParseUnitConstants = () => {
  const units = useUnits();

  const parseUnitConstants = React.useCallback(
    (fileContents: string): Map<string, string> | null => {
      try {
        // Find the enum Types block
        const enumMatch = fileContents.match(/enum\s+Types\s*{([^}]*)}/);
        if (!enumMatch) {
          throw new Error('Could not find enum Types in file contents');
        }

        // Extract the enum content
        const enumContent = enumMatch[1].trim();

        // Split by commas and clean up each entry
        const unitTypes = enumContent
          .split(',')
          .map((entry) => entry.trim())
          .filter((entry) => entry.length > 0); // Remove empty entries

        if (unitTypes.length === 0) {
          throw new Error('No enum values found in Types enum');
        }

        // Create a Map to store guid -> id mappings
        const guidToId = new Map<string, string>();

        // Create reverse lookup for unit id to guid
        const idToGuid = new Map(units.map((unit) => [unit.id, unit.guid]));

        // Validate each unit type exists and build the map
        unitTypes.forEach((unitType) => {
          const guid = idToGuid.get(unitType);
          if (!guid) {
            throw new Error(`Unit type '${unitType}' not found in game store`);
          }
          guidToId.set(guid, unitType);
        });
        return guidToId;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }

      return null;
    },
    [units],
  );

  return parseUnitConstants;
};
