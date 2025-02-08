import { useAction } from '../store/getters/action';

export const ActionDetail: React.FC<{ actionId: string }> = ({ actionId }) => {
  const action = useAction(actionId);
  return <p>{action.name} Detail</p>;
};
