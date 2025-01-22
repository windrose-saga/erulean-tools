import * as React from 'react';

import { useGameStore } from '../store/useGameStore';

export const LoadingGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const loaded = useGameStore.use.loaded();
  if (!loaded) return <div>Please upload a JSON or DPO file to proceed</div>;
  return children;
};
