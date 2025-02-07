import { useAugment } from '../store/getters/augment';

export const AugmentDetail: React.FC<{ augmentId: string }> = ({ augmentId }) => {
  const augment = useAugment(augmentId);
  return <p>{augment.name} Detail</p>;
};
