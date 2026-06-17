import * as React from 'react';

import { isValidVocabId, normalizeVocabId } from '../utils/vocabId';

export interface VocabManagerProps {
  title: string;
  // Singular noun used in placeholder/labels, e.g. "category" / "tag".
  noun: string;
  activeNames: Array<string>;
  removedNames: Array<string>;
  isProtected: (name: string) => boolean;
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
  onRename: (oldName: string, newName: string) => void;
}

// Generic add/rename/remove editor for a data-driven vocabulary (loot categories, generator
// tags). Protected built-ins are listed but cannot be renamed or removed. Removing a value
// tombstones it (and cascade-strips it from referencing items/units, handled by the store);
// removed values can be revived from the collapsed section.
export const VocabManager = ({
  title,
  noun,
  activeNames,
  removedNames,
  isProtected,
  onAdd,
  onRemove,
  onRename,
}: VocabManagerProps) => {
  const [draft, setDraft] = React.useState('');
  const [editing, setEditing] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState('');

  const submitAdd = React.useCallback(() => {
    const normalized = normalizeVocabId(draft);
    if (!isValidVocabId(normalized)) {
      return;
    }
    onAdd(normalized);
    setDraft('');
  }, [draft, onAdd]);

  const submitRename = React.useCallback(
    (oldName: string) => {
      const normalized = normalizeVocabId(editDraft);
      if (isValidVocabId(normalized) && normalized !== oldName) {
        onRename(oldName, normalized);
      }
      setEditing(null);
      setEditDraft('');
    },
    [editDraft, onRename],
  );

  return (
    <div className="flex flex-col gap-3 p-4 max-w-xl">
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="flex gap-2">
        <input
          type="text"
          className="border px-2 py-1 flex-1"
          placeholder={`Add ${noun} (UPPER_CASE)`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitAdd();
            }
          }}
        />
        <button type="button" className="border px-3 py-1" onClick={submitAdd}>
          Add
        </button>
      </div>

      <ul className="flex flex-col gap-1">
        {activeNames.map((name) => (
          <li key={name} className="flex items-center gap-2 border-b py-1">
            {editing === name ? (
              <>
                <input
                  type="text"
                  className="border px-1 flex-1"
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      submitRename(name);
                    } else if (e.key === 'Escape') {
                      setEditing(null);
                    }
                  }}
                />
                <button type="button" className="border px-2" onClick={() => submitRename(name)}>
                  Save
                </button>
                <button type="button" className="border px-2" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{name}</span>
                {isProtected(name) ? (
                  <span className="text-sm text-gray-500">built-in</span>
                ) : (
                  <>
                    <button
                      type="button"
                      className="border px-2"
                      onClick={() => {
                        setEditing(name);
                        setEditDraft(name);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="border px-2 text-red-600"
                      onClick={() => onRemove(name)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {removedNames.length > 0 && (
        <details>
          <summary className="cursor-pointer text-gray-600">
            Removed ({removedNames.length})
          </summary>
          <ul className="flex flex-col gap-1 mt-1">
            {removedNames.map((name) => (
              <li key={name} className="flex items-center gap-2 py-1">
                <span className="flex-1 text-gray-500 line-through">{name}</span>
                <button type="button" className="border px-2" onClick={() => onAdd(name)}>
                  Revive
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};
