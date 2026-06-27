// A durable name -> ordinal ledger for a vocabulary (loot categories, generator tags).
//
// Each vocabulary is an append-only ordered list whose index is the persisted Godot enum integer.
// The ordered list only records the *current* name at each ordinal, so a rename overwrites (and
// forgets) the previous name. That memory loss is what let a name silently migrate between
// ordinals (e.g. renaming BANDIT away frees the name, then renaming a different slot to BANDIT
// rebinds the name to a new integer) — remapping every persisted ordinal in windrose-saga.
//
// The ledger fixes that by remembering every name a vocabulary has *ever* held, mapped to its
// permanent ordinal. Renamed-away names stay in the ledger so they can never be reattached to a
// different ordinal. The invariant the whole system depends on is: a name is bound to exactly one
// ordinal forever.
export type VocabLedger = Record<string, number>;

// Build (or repair) a ledger from the current ordered list, preserving any retired names already
// recorded in `existing`. Current positions always win, so a legacy/authoritative file lacking a
// ledger derives a correct one straight from array indices.
export const reconcileLedger = (ordered: string[], existing: VocabLedger = {}): VocabLedger => {
  const ledger: VocabLedger = { ...existing };
  ordered.forEach((name, index) => {
    ledger[name] = index;
  });
  return ledger;
};

// The ordinal a name is permanently bound to, or undefined if the ledger has never seen it.
export const ledgerOrdinalOf = (ledger: VocabLedger, name: string): number | undefined =>
  Object.prototype.hasOwnProperty.call(ledger, name) ? ledger[name] : undefined;

// True when assigning `name` to `ordinal` would teleport it across ordinals: the ledger already
// binds `name` to a different integer, so the assignment would remap a persisted enum value.
export const wouldRemapOrdinal = (ledger: VocabLedger, name: string, ordinal: number): boolean => {
  const bound = ledgerOrdinalOf(ledger, name);
  return bound !== undefined && bound !== ordinal;
};
