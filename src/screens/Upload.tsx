import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import { useGameStore } from '../store/useGameStore';
import { useExportStore } from '../utils/useExportStore';
import { useIngest, useIngestV2 } from '../utils/useIngest';
import { useLoadedInfo } from '../utils/useLoadedInfo';

const Upload: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const reset = useGameStore.use.reset();
  const navigate = useNavigate();
  const onLoaded = React.useCallback(() => {
    navigate({ to: '/units' });
  }, [navigate]);

  const { loaded, lastLoadedTime, isStale } = useLoadedInfo();

  const { ingest, errors: errorsV1 } = useIngest({ onLoaded });
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

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <input type="file" accept=".json,.dpo" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file}>
          Upload Depot
        </button>
        <button onClick={handleUploadV2} disabled={!file}>
          Upload New Game Store
        </button>
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
