import * as React from "react";
import { ActionData, ActionType } from "../types/action";
import useDataContext from "../context/DataContext/useDataContext";

type Props = {
  setAction: (action: ActionData) => void;
  typeFilter: ActionType;
};

const ActionSelect: React.FC<Props> = ({ setAction, typeFilter }) => {
  const { actions } = useDataContext();

  return (
    <select
      onChange={(e) => {
        const action = actions.find((a) => a.id === e.target.value);
        if (action) {
          setAction(action);
        }
      }}
    >
      <option value="">Select an action</option>
      {actions
        .filter((a) => a.actionType === typeFilter)
        .map((action) => (
          <option key={action.id} value={action.id}>
            {action.name}
          </option>
        ))}
    </select>
  );
};

export default ActionSelect;
