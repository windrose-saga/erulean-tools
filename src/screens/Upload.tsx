import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import { useGameStore } from '../store/useGameStore';
import { useParseUnitConstants } from '../utils/parseUnitConstants';
import { useExportStore } from '../utils/useExportStore';
import { useIngest, useIngestV2 } from '../utils/useIngest';
import { useLoadedInfo } from '../utils/useLoadedInfo';

const Upload: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [showLegacyIngest, setShowLegacyIngest] = React.useState(false);
  const reset = useGameStore.use.reset();
  const navigate = useNavigate();
  const onLoaded = React.useCallback(() => {
    navigate({ to: '/units' });
  }, [navigate]);
  const parseUnitConstants = useParseUnitConstants();
  const setUnitIds = useGameStore.use.setUnitIds();
  const unitIds = useGameStore.use.unitIds();

  const { loaded, lastLoadedTime, isStale } = useLoadedInfo();

  const { ingest, errors: errorsV1 } = useIngest();
  const { ingest: ingestV2, errors: errorsV2 } = useIngestV2({ onLoaded });
  const errors = [...errorsV1, ...errorsV2];

  const exportStore = useExportStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          try {
            ingest(fileReader.result as string);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Failed to parse JSON:', error);
          }
        }
      };
    }
  };

  const handleUploadV2 = () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          try {
            ingestV2(fileReader.result as string);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Failed to parse JSON:', error);
          }
        }
      };
    }
  };

  const handleUploadUnitConstants = () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          try {
            const unitConstants = parseUnitConstants(fileReader.result as string);
            if (!unitConstants) return;
            setUnitIds(unitConstants);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Failed to parse unit constants:', error);
          }
        }
      };
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <input type="file" accept=".json,.dpo,.gd" onChange={handleFileChange} />
        {showLegacyIngest ? (
          <>
            <button onClick={handleUpload} disabled={!file}>
              Upload Depot
            </button>
            <button onClick={handleUploadUnitConstants} disabled={!(file && loaded)}>
              Upload Unit Constants
            </button>
          </>
        ) : (
          <button onClick={handleUploadV2} disabled={!file}>
            Upload New Game Store
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label>
          <input
            type="checkbox"
            checked={showLegacyIngest}
            onChange={(e) => setShowLegacyIngest(e.target.checked)}
          />
          Show legacy ingest
        </label>
      </div>
      {errors.map((error) => (
        <p className="text-red-500" key={error.message}>
          {error.message}
        </p>
      ))}
      {loaded && (
        <>
          <p className={isStale ? 'text-red-500' : 'text-green-500'}>
            Data loaded at {lastLoadedTime}
          </p>
          <p className={isStale ? 'text-red-500' : 'text-green-500'}>{unitIds.size} units</p>
          <div className="flex flex-col max-w-64">
            <button onClick={exportStore}>Export data</button>
            <button onClick={reset}>Reset</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Upload;
