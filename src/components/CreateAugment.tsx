import React from 'react';

import { AugmentForm } from './forms/AugmentForm';

import { DEFAULT_AUGMENT } from '../constants/augment';

export const CreateAugment: React.FC = () => {
  const augment = React.useMemo(() => ({ ...DEFAULT_AUGMENT, guid: crypto.randomUUID() }), []);

  return <AugmentForm augment={augment} />;
};
