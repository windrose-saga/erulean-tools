import * as React from 'react';

export interface VocabViewSwitcherProps {
  // The list editor (rename/remove/add).
  manageView: React.ReactNode;
  // The two-axis assignment matrix, shown by default.
  matrixView: React.ReactNode;
}

type View = 'manage' | 'matrix';

// In-tab toggle between the existing vocabulary manager and the new assignment matrix. Lives
// inside a single top-level tab (Generator Tags / Loot Categories) rather than adding a new tab.
export const VocabViewSwitcher = ({ manageView, matrixView }: VocabViewSwitcherProps) => {
  const [view, setView] = React.useState<View>('matrix');

  const tabClass = (target: View) =>
    // No background colors: the app is system-themed (Canvas/CanvasText), so a fixed light bg
    // would be illegible in dark mode. The active tab is marked with bold text + the accent border.
    `px-3 py-1 ${view === target ? 'font-bold border-[#646cff]' : ''}`;

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 p-2">
        <button type="button" className={tabClass('manage')} onClick={() => setView('manage')}>
          Manage
        </button>
        <button type="button" className={tabClass('matrix')} onClick={() => setView('matrix')}>
          Matrix
        </button>
      </div>
      {view === 'manage' ? manageView : matrixView}
    </div>
  );
};
