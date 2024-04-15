const LabeledValue = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div>
    <p>{label}</p>
    <p>{value}</p>
  </div>
);

export default LabeledValue;
