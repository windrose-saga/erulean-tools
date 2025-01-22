import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "../App.css";
import { useGameStore } from "../store/useGameStore";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const loaded = useGameStore.use.loaded();
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
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
                className: "font-bold",
              }}
            >
              Units
            </Link>
            <Link
              to="/actions"
              activeProps={{
                className: "font-bold",
              }}
            >
              Actions
            </Link>
            <Link
              to="/augments"
              activeProps={{
                className: "font-bold",
              }}
            >
              Augments
            </Link>
          </>
        )}
        <Link
          to="/damage-calculator"
          activeProps={{
            className: "font-bold",
          }}
        >
          Damage Calculator
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
