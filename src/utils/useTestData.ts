import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import { useIngest } from './useIngest';

import * as data from '../../depot.json';

export const useTestData = () => {
  const isTestDataEnabledForCurrentEnv = !!import.meta.env.VITE_USE_TEST_DATA;
  const [initialized, setInitialized] = React.useState(false);
  const navigate = useNavigate();

  const onLoaded = React.useCallback(() => {
    navigate({ to: '/units' });
  }, [navigate]);

  const { ingest, errors } = useIngest({ onLoaded });

  React.useEffect(() => {
    if (isTestDataEnabledForCurrentEnv && !initialized) {
      ingest(JSON.stringify(data));
      setInitialized(true);
    }
  }, [errors, ingest, initialized, isTestDataEnabledForCurrentEnv]);
};
