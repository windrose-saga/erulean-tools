// Builds a guid -> id map for a level-class table, ordered by the provided id
// list when present (backward-compat: older exports may omit it, in which case
// order is derived from the classes themselves). Any class whose id is not in
// the provided list is appended so seeded defaults are never dropped.
export const generateLevelClassIdsMap = (
  classes: Array<{ guid: string; id: string }>,
  ids?: string[],
) => {
  const idToGuid = new Map(classes.map((levelClass) => [levelClass.id, levelClass.guid]));
  const orderedIds = ids && ids.length ? [...ids] : [];
  classes.forEach((levelClass) => {
    if (!orderedIds.includes(levelClass.id)) {
      orderedIds.push(levelClass.id);
    }
  });

  const guidToId = new Map<string, string>();
  orderedIds.forEach((id) => {
    const guid = idToGuid.get(id);
    if (guid) {
      guidToId.set(guid, id);
    }
  });
  return guidToId;
};
