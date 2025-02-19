import * as React from 'react';

import { UnitForm } from './forms/UnitForm';

import { useUnit } from '../store/getters/unit';

export const UnitDetail: React.FC<{ unitId: string }> = ({ unitId }) => {
  const unit = useUnit(unitId);

  return <UnitForm unit={unit} />;
};
