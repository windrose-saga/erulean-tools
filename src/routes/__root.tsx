import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import '../App.css';
import { enableMapSet } from 'immer';
import * as React from 'react';

import env from '../utils/env';
import { useLoadedInfo } from '../utils/useLoadedInfo';
import { useTestData } from '../utils/useTestData';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isTestDataEnabledForCurrentEnv = env.useTestData;

  React.useEffect(() => {
    enableMapSet();
  }, []);

  useTestData();
  const { loaded, lastLoadedTime, isStale } = useLoadedInfo();

  return (
    <>
      <div className="flex justify-between">
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Upload
          </Link>
          {loaded && (
            <>
              <Link
                to="/units"
                activeProps={{
                  className: 'font-bold',
                }}
              >
                Units
              </Link>
              <Link
                to="/actions"
                activeProps={{
                  className: 'font-bold',
                }}
              >
                Actions
              </Link>
              <Link
                to="/augments"
                activeProps={{
                  className: 'font-bold',
                }}
              >
                Augments
              </Link>
              <Link
                to="/items"
                activeProps={{
                  className: 'font-bold',
                }}
              >
                Items
              </Link>
            </>
          )}
          <Link
            to="/damage-calculator"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Damage Calculator
          </Link>
        </div>
        {loaded && (
          <div className="flex flex-col items-end">
            <p className={`text-sm ${isStale ? 'text-red-600' : undefined}`}>
              Last loaded: {lastLoadedTime}
            </p>
            {isStale && (
              <p className="text-red-600 text-sm">
                Data is potentially stale. Make sure you are on the latest version.
              </p>
            )}
          </div>
        )}
      </div>
      <hr />
      <Outlet />
      {isTestDataEnabledForCurrentEnv && <TanStackRouterDevtools position="bottom-right" />}
    </>
  );
}
