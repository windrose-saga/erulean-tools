import { SEED_LOOT_CATEGORIES } from '../types/item';
import { SEED_GENERATOR_TAGS } from '../types/unit';

// A vocabulary id becomes a GDScript enum member name, so it must be a valid identifier:
// upper-case letter/underscore start, then upper-case letters/digits/underscores.
export const VOCAB_ID_PATTERN = /^[A-Z_][A-Z0-9_]*$/;

// Normalize free-text input toward a valid id: trim, upper-case, collapse internal whitespace
// to single underscores. Callers still validate the result (e.g. a leading digit stays invalid).
export const normalizeVocabId = (raw: string): string =>
  raw.trim().toUpperCase().replace(/\s+/g, '_');

export const isValidVocabId = (id: string): boolean => VOCAB_ID_PATTERN.test(id);

// The original built-in values are protected: their enum ordinals back hand-authored Godot
// resources (e.g. reward-generator-inputs/*.tres) and GdUnit tests, so they may not be renamed
// or removed.
export const isProtectedLootCategory = (name: string): boolean =>
  (SEED_LOOT_CATEGORIES as readonly string[]).includes(name);

export const isProtectedGeneratorTag = (name: string): boolean =>
  (SEED_GENERATOR_TAGS as readonly string[]).includes(name);
