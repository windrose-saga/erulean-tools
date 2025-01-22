import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import { useGameStore } from '../store/useGameStore';
import { useIngest } from '../utils/useIngest';

const Upload: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const loaded = useGameStore.use.loaded();
  const navigate = useNavigate();
  const onLoaded = React.useCallback(() => {
    navigate({ to: '/units' });
  }, [navigate]);

  const { ingest, errors } = useIngest({ onLoaded });

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

  return (
    <div>
      <input type="file" accept=".json,.dpo" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
      {errors.map((error) => (
        <p className="text-red-500" key={error.message}>
          {error.message}
        </p>
      ))}
      {loaded && <p className="text-green-500">Data loaded</p>}
    </div>
  );
};

export default Upload;
