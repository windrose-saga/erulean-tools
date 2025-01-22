import * as React from 'react';

import { useUnit } from '../store/getters/unit';

export const UnitDetail: React.FC<{ unitId: string }> = ({ unitId }) => {
  const unit = useUnit(unitId);
  return <p>{unit.name} Detail</p>;
};
