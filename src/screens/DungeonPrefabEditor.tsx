import * as React from 'react';

import {
  CONNECTOR_TILE,
  DEFAULT_DUNGEON_PREFAB_LAYOUT,
  DUNGEON_PREFAB_TILES,
  DungeonPrefabGrid,
  DungeonPrefabTile,
  FLOOR_TILE,
  WALL_TILE,
  createDungeonPrefabGridFromText,
  createFilledDungeonPrefabGrid,
  resizeDungeonPrefabGrid,
  serializeDungeonPrefabGrid,
} from '../utils/dungeonPrefabLayout';

type Tool = 'brush' | 'eraser';

const MIN_DIMENSION = 1;
const MAX_DIMENSION = 48;
const CELL_SIZE = 28;

const TILE_LABELS = {
  '#': 'Wall',
  '.': 'Floor',
  '*': 'Entrance',
} satisfies Record<DungeonPrefabTile, string>;

const TILE_CLASSES = {
  '#': 'bg-zinc-800 text-zinc-100',
  '.': 'bg-stone-100 text-zinc-950',
  '*': 'bg-emerald-500 text-zinc-950',
} satisfies Record<DungeonPrefabTile, string>;

const TOOL_LABELS: Record<Tool, string> = {
  brush: 'Brush',
  eraser: 'Eraser',
};

const clampDimension = (value: string, fallback: number): number => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.min(MAX_DIMENSION, Math.max(MIN_DIMENSION, Math.trunc(parsedValue)));
};

const writeTextToClipboard = async (value: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const wasCopied = document.execCommand('copy');
  document.body.removeChild(textArea);

  if (!wasCopied) {
    throw new Error('Clipboard copy failed');
  }
};

const createDefaultGrid = (): DungeonPrefabGrid =>
  createDungeonPrefabGridFromText(DEFAULT_DUNGEON_PREFAB_LAYOUT);

function DungeonPrefabEditor() {
  const [grid, setGrid] = React.useState<DungeonPrefabGrid>(createDefaultGrid);
  const [selectedTile, setSelectedTile] = React.useState<DungeonPrefabTile>(FLOOR_TILE);
  const [tool, setTool] = React.useState<Tool>('brush');
  const [loadText, setLoadText] = React.useState(DEFAULT_DUNGEON_PREFAB_LAYOUT);
  const [widthInput, setWidthInput] = React.useState(String(createDefaultGrid()[0].length));
  const [heightInput, setHeightInput] = React.useState(String(createDefaultGrid().length));
  const [status, setStatus] = React.useState('');
  const [isPainting, setIsPainting] = React.useState(false);

  const dimensions = React.useMemo(
    () => ({
      width: grid[0]?.length ?? 0,
      height: grid.length,
    }),
    [grid],
  );

  const exportedLayout = React.useMemo(() => serializeDungeonPrefabGrid(grid), [grid]);

  const tileCounts = React.useMemo(() => {
    const tiles = grid.flat();
    const connectors = tiles.filter((tile) => tile === CONNECTOR_TILE).length;
    const floor = tiles.filter((tile) => tile !== WALL_TILE).length;

    return {
      connectors,
      floor,
      walls: tiles.length - floor,
    };
  }, [grid]);

  const gridCells = React.useMemo(
    () =>
      grid.flatMap((row, y) =>
        row.map((tile, x) => ({
          id: `${x}-${y}`,
          tile,
          x,
          y,
        })),
      ),
    [grid],
  );

  const activeTile = tool === 'eraser' ? WALL_TILE : selectedTile;
  const isValidPrefab = dimensions.width > 0 && dimensions.height > 0 && tileCounts.floor > 0;
  const hasConnector = tileCounts.connectors > 0;

  React.useEffect(() => {
    if (!isPainting) {
      return undefined;
    }

    const stopPainting = () => setIsPainting(false);
    window.addEventListener('pointerup', stopPainting);

    return () => window.removeEventListener('pointerup', stopPainting);
  }, [isPainting]);

  const syncDimensionInputs = React.useCallback((nextGrid: DungeonPrefabGrid) => {
    setWidthInput(String(nextGrid[0]?.length ?? MIN_DIMENSION));
    setHeightInput(String(nextGrid.length || MIN_DIMENSION));
  }, []);

  const paintCell = React.useCallback(
    (x: number, y: number) => {
      setGrid((currentGrid) =>
        currentGrid.map((row, rowIndex) => {
          if (rowIndex !== y) {
            return row;
          }

          return row.map((tile, columnIndex) => (columnIndex === x ? activeTile : tile));
        }),
      );
      setStatus('');
    },
    [activeTile],
  );

  const handlePointerDown = React.useCallback(
    (x: number, y: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setIsPainting(true);
      paintCell(x, y);
    },
    [paintCell],
  );

  const handlePointerEnter = React.useCallback(
    (x: number, y: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!isPainting || event.buttons !== 1) {
        return;
      }

      paintCell(x, y);
    },
    [isPainting, paintCell],
  );

  const handleResize = React.useCallback(() => {
    const nextWidth = clampDimension(widthInput, dimensions.width || MIN_DIMENSION);
    const nextHeight = clampDimension(heightInput, dimensions.height || MIN_DIMENSION);
    const nextGrid = resizeDungeonPrefabGrid(grid, nextWidth, nextHeight);

    setGrid(nextGrid);
    syncDimensionInputs(nextGrid);
    setStatus(`Resized to ${nextWidth} x ${nextHeight}`);
  }, [dimensions.height, dimensions.width, grid, heightInput, syncDimensionInputs, widthInput]);

  const handleClear = React.useCallback(() => {
    const nextGrid = createFilledDungeonPrefabGrid(dimensions.width, dimensions.height);

    setGrid(nextGrid);
    setStatus('Cleared');
  }, [dimensions.height, dimensions.width]);

  const handleLoad = React.useCallback(() => {
    const nextGrid = createDungeonPrefabGridFromText(loadText);

    if (nextGrid.length === 0) {
      setStatus('No layout found');
      return;
    }

    setGrid(nextGrid);
    syncDimensionInputs(nextGrid);
    setStatus(`Loaded ${nextGrid[0].length} x ${nextGrid.length}`);
  }, [loadText, syncDimensionInputs]);

  const handleExport = React.useCallback(async () => {
    try {
      await writeTextToClipboard(exportedLayout);
      setStatus('Copied layout');
    } catch {
      setStatus('Clipboard copy failed');
    }
  }, [exportedLayout]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 p-4 text-left">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-500 pb-4">
        <div>
          <h1 className="text-3xl font-bold">Dungeon Prefab Editor</h1>
          <p className="text-sm text-gray-500"># wall, . floor, * entrance</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm font-bold">
            Width
            <input
              className="w-20 rounded border border-gray-500 bg-transparent p-2 font-normal"
              max={MAX_DIMENSION}
              min={MIN_DIMENSION}
              onChange={(event) => setWidthInput(event.target.value)}
              type="number"
              value={widthInput}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">
            Height
            <input
              className="w-20 rounded border border-gray-500 bg-transparent p-2 font-normal"
              max={MAX_DIMENSION}
              min={MIN_DIMENSION}
              onChange={(event) => setHeightInput(event.target.value)}
              type="number"
              value={heightInput}
            />
          </label>
          <button className="rounded border border-gray-600 px-4 py-2" onClick={handleResize}>
            Apply Size
          </button>
          <button className="rounded border border-gray-600 px-4 py-2" onClick={handleClear}>
            Clear
          </button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)_22rem]">
        <aside className="flex flex-col gap-5">
          <div className="rounded border border-gray-500 p-4">
            <h2 className="mb-3 text-lg font-bold">Tiles</h2>
            <div className="grid gap-2">
              {DUNGEON_PREFAB_TILES.map((tile) => (
                <button
                  aria-pressed={selectedTile === tile}
                  className={`flex items-center gap-3 rounded border px-3 py-2 text-left ${
                    selectedTile === tile ? 'border-emerald-500' : 'border-gray-600'
                  }`}
                  key={tile}
                  onClick={() => {
                    setSelectedTile(tile);
                    setTool('brush');
                  }}
                  title={TILE_LABELS[tile]}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded border border-black/30 font-mono ${TILE_CLASSES[tile]}`}
                  >
                    {tile}
                  </span>
                  <span>{TILE_LABELS[tile]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded border border-gray-500 p-4">
            <h2 className="mb-3 text-lg font-bold">Tool</h2>
            <div className="grid grid-cols-2 gap-2">
              {(['brush', 'eraser'] as const).map((toolOption) => (
                <button
                  aria-pressed={tool === toolOption}
                  className={`rounded border px-3 py-2 ${
                    tool === toolOption ? 'border-emerald-500' : 'border-gray-600'
                  }`}
                  key={toolOption}
                  onClick={() => setTool(toolOption)}
                  title={TOOL_LABELS[toolOption]}
                >
                  {TOOL_LABELS[toolOption]}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded border border-gray-500 p-4">
            <h2 className="mb-3 text-lg font-bold">Status</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt>Size</dt>
              <dd className="font-mono">
                {dimensions.width} x {dimensions.height}
              </dd>
              <dt>Walls</dt>
              <dd className="font-mono">{tileCounts.walls}</dd>
              <dt>Floor</dt>
              <dd className="font-mono">{tileCounts.floor}</dd>
              <dt>Entrances</dt>
              <dd className="font-mono">{tileCounts.connectors}</dd>
            </dl>
            <p
              className={`mt-3 text-sm font-bold ${isValidPrefab && hasConnector ? 'text-green-600' : 'text-red-600'}`}
            >
              {isValidPrefab && hasConnector ? 'Valid prefab' : 'Needs floor and entrance'}
            </p>
            {status && <p className="mt-2 text-sm text-gray-500">{status}</p>}
          </div>
        </aside>

        <section className="min-w-0 rounded border border-gray-500 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Grid</h2>
            <p className="text-sm text-gray-500">
              {TOOL_LABELS[tool]}: {TILE_LABELS[activeTile]}
            </p>
          </div>
          <div className="overflow-auto rounded border border-gray-500 bg-gray-300 p-3">
            <div
              className="grid w-max select-none"
              style={{
                gridTemplateColumns: `repeat(${dimensions.width}, ${CELL_SIZE}px)`,
              }}
            >
              {gridCells.map((cell) => (
                <button
                  aria-label={`Row ${cell.y + 1}, column ${cell.x + 1}: ${TILE_LABELS[cell.tile]}`}
                  className={`h-7 w-7 border border-black/30 font-mono text-sm leading-none ${
                    TILE_CLASSES[cell.tile]
                  }`}
                  key={cell.id}
                  onClick={() => paintCell(cell.x, cell.y)}
                  onPointerDown={handlePointerDown(cell.x, cell.y)}
                  onPointerEnter={handlePointerEnter(cell.x, cell.y)}
                  title={`${cell.x},${cell.y} ${TILE_LABELS[cell.tile]}`}
                >
                  {cell.tile}
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="flex min-w-0 flex-col gap-5">
          <div className="rounded border border-gray-500 p-4">
            <label className="mb-2 block text-lg font-bold" htmlFor="dungeon-prefab-load">
              Load
            </label>
            <textarea
              className="h-48 w-full rounded border border-gray-500 bg-transparent p-3 font-mono text-sm"
              id="dungeon-prefab-load"
              onChange={(event) => setLoadText(event.target.value)}
              spellCheck={false}
              value={loadText}
            />
            <button className="mt-3 rounded border border-gray-600 px-4 py-2" onClick={handleLoad}>
              Load Layout
            </button>
          </div>

          <div className="rounded border border-gray-500 p-4">
            <label className="mb-2 block text-lg font-bold" htmlFor="dungeon-prefab-export">
              Export
            </label>
            <textarea
              className="h-48 w-full rounded border border-gray-500 bg-transparent p-3 font-mono text-sm"
              id="dungeon-prefab-export"
              readOnly
              spellCheck={false}
              value={exportedLayout}
            />
            <button
              className="mt-3 rounded border border-gray-600 px-4 py-2"
              disabled={!isValidPrefab || !hasConnector}
              onClick={handleExport}
            >
              Copy Layout
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default DungeonPrefabEditor;
