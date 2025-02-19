import React from 'react';

import { ActionForm } from './forms/ActionForm';

import { DEFAULT_ACTION_DATA } from '../constants/action';

export const CreateAction: React.FC = () => {
  const action = React.useMemo(() => ({ ...DEFAULT_ACTION_DATA, guid: crypto.randomUUID() }), []);

  return <ActionForm action={action} />;
};
