import { AugmentForm } from './forms/AugmentForm';

import { useAugment } from '../store/getters/augment';

export const AugmentDetail: React.FC<{ augmentId: string }> = ({ augmentId }) => {
  const augment = useAugment(augmentId);
  return <AugmentForm augment={augment} />;
};
