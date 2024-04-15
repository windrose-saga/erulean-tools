export type UnitStats = {
  physicalDefense: number;
  specialDefense: number;
  speed: number;
  strength: number;
  intelligence: number;
  luck: number;
};
type Props = {
  title: string;
  stats: UnitStats;
  setStats(val: UnitStats | ((stats: UnitStats) => UnitStats)): void;
};
const UnitForm: React.FC<Props> = ({ setStats, stats, title }) => {
  return (
    <form
      className="flex flex-col items-start"
      onChange={(e) => {
        setStats((curr) => {
          const updated = { ...curr };
          // @ts-expect-error event target fields
          updated[e.nativeEvent.target.id] = parseInt(e.target.value);
          return updated;
        });
      }}
    >
      <h1 className="font-bold text-xl">{title}</h1>
      <label htmlFor="strength">Strength</label>
      <input
        value={stats.strength}
        type="number"
        id="strength"
        title="Strength"
      />
      <label htmlFor="intelligence">Intelligence</label>
      <input
        value={stats.intelligence}
        type="number"
        id="intelligence"
        title="Intelligence"
      />
      <label htmlFor="speed">Speed</label>
      <input value={stats.speed} type="number" id="speed" title="Speed" />
      <label htmlFor="physicalDefense">Physical Defense</label>
      <input
        value={stats.physicalDefense}
        type="number"
        id="physicalDefense"
        title="Physical Defense"
      />
      <label htmlFor="specialDefense">Special Defense</label>
      <input
        value={stats.specialDefense}
        type="number"
        id="specialDefense"
        title="Special Defense"
      />
      <label htmlFor="luck">Luck</label>
      <input value={stats.luck} type="number" id="luck" title="Luck" />
    </form>
  );
};

export default UnitForm;
