import * as React from "react";
import { LoadingGate } from "../components/LoadingGate";

export const withLoadingGate =
  <P extends object>(
    Component: React.ComponentType<P>
  ): ((props: P) => JSX.Element) =>
  (props: P) => (
    <LoadingGate>
      <Component {...props} />
    </LoadingGate>
  );
