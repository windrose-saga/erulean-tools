import * as React from "react";

import { getUnitData } from "../utils/parsers/unit";
import { getActionData } from "../utils/parsers/action";
import { getAugmentData } from "../utils/parsers/augment";
import { useGameStore } from "../store/useGameStore";
import { Unit } from "../types/unit";
import { Action } from "../types/action";
import { Augment } from "../types/augment";
import { validateIngest } from "../utils/validateIngest";

const ACTION_SHEET_GUID = "288ae487-6d6a-411e-b468-ab415b4ba7e6";
const UNIT_SHEET_GUID = "c4ca663f-445a-4bcb-bf4e-4cd51455c0a5";
const AUGMENT_SHEET_GUID = "4d53960f-f75e-4721-ad17-90d124808b18";

type ErrorType = "unit" | "action" | "augment";
type Error = {
  type: ErrorType;
  message: string;
};

export const useIngest = ({ onLoaded }: { onLoaded?: () => void } = {}) => {
  const [errors, setErrors] = React.useState<Error[]>([]);

  const setUnits = useGameStore.use.setUnits();
  const setActions = useGameStore.use.setActions();
  const setAugments = useGameStore.use.setAugments();
  const setLoaded = useGameStore.use.setLoaded();

  const ingest = React.useCallback(
    (json: string) => {
      try {
        const data = JSON.parse(json);
        const units = ingestUnits(data.sheets);
        const actions = ingestActions(data.sheets);
        const augments = ingestAugments(data.sheets);
        const ingestErrors = validateIngest(units, actions, augments);
        setErrors(ingestErrors);
        if (ingestErrors.length === 0) {
          setUnits(units);
          setActions(actions);
          setAugments(augments);
          setLoaded();
          if (onLoaded) {
            onLoaded();
          }
        }
      } catch (error) {
        console.warn("Failed to parse JSON:", error);
      }
    },
    [onLoaded, setActions, setAugments, setLoaded, setUnits]
  );

  return { ingest, errors };
};

const getUnitLines = (data: Array<any>) => {
  return data.find((sheet: any) => sheet.guid === UNIT_SHEET_GUID).lines;
};

const getActionLines = (data: Array<any>) => {
  return data.find((sheet: any) => sheet.guid === ACTION_SHEET_GUID).lines;
};

const getAugmentLines = (data: Array<any>) => {
  return data.find((sheet: any) => sheet.guid === AUGMENT_SHEET_GUID).lines;
};

const ingestUnits = (data: Array<any>) => {
  const unitData = {} as Record<string, Unit>;
  const lines = getUnitLines(data);
  lines.forEach((line: any) => {
    const unit = getUnitData(line);
    unitData[unit.guid] = unit;
  });
  return unitData;
};

const ingestActions = (data: Array<any>) => {
  const actionData = {} as Record<string, Action>;
  const lines = getActionLines(data);
  lines.forEach((line: any) => {
    const action = getActionData(line);
    actionData[action.guid] = action;
  });
  return actionData;
};

const ingestAugments = (data: Array<any>) => {
  const augmentData = {} as Record<string, Augment>;
  const lines = getAugmentLines(data);
  lines.forEach((line: any) => {
    const augment = getAugmentData(line);
    augmentData[augment.guid] = augment;
  });
  return augmentData;
};
