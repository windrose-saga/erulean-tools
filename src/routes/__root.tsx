import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import '../App.css';
import { enableMapSet } from 'immer';
import * as React from 'react';

import { useGameStore } from '../store/useGameStore';
import { useTestData } from '../utils/useTestData';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isTestDataEnabledForCurrentEnv = !!import.meta.env.VITE_USE_TEST_DATA;

  React.useEffect(() => {
    enableMapSet();
  }, []);

  useTestData();
  const loaded = useGameStore.use.loaded();
  return (
    <>
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
      <hr />
      <Outlet />
      {isTestDataEnabledForCurrentEnv && <TanStackRouterDevtools position="bottom-right" />}
    </>
  );
}
