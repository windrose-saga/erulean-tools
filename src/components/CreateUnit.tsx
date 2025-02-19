import React from 'react';

import { UnitForm } from './forms/UnitForm';

import { DEFAULT_UNIT } from '../constants/unit';

export const CreateUnit: React.FC = () => {
  const unit = React.useMemo(() => ({ ...DEFAULT_UNIT, guid: crypto.randomUUID() }), []);

  return <UnitForm unit={unit} />;
};
