import { format, subDays } from 'date-fns';
import { useMemo } from 'react';

import { useGameStore } from '../store/useGameStore';

export const useLoadedInfo = () => {
  const lastLoaded = useGameStore.use.lastLoaded();
  const loaded = useGameStore.use.loaded();

  const lastLoadedTime = useMemo(
    () => (lastLoaded === null ? null : format(new Date(lastLoaded), 'p MMM do')),
    [lastLoaded],
  );

  const isStale = useMemo(() => {
    if (lastLoaded === null) {
      return false;
    }

    const twentyFourHoursAgo = subDays(new Date(), 1).getTime();
    return lastLoaded < twentyFourHoursAgo;
  }, [lastLoaded]);

  return { loaded, lastLoadedTime, isStale };
};
