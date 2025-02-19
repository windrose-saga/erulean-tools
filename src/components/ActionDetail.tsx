import React from 'react';

import { ActionForm } from './forms/ActionForm';

import { useAction } from '../store/getters/action';

export const ActionDetail: React.FC<{ actionId: string }> = ({ actionId }) => {
  const action = useAction(actionId);

  return <ActionForm action={action} />;
};
