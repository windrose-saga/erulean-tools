import UnitSelect from './UnitSelect';

import { Unit } from '../types/unit';

type Props = {
  title: string;
  stats: Unit;
  setStats(val: Unit | ((stats: Unit) => Unit)): void;
};
const CalculatorUnitForm: React.FC<Props> = ({ setStats, stats, title }) => (
  <form
    className="flex flex-col items-start"
    onChange={(e) => {
      setStats((curr) => {
        const updated = { ...curr };
        // @ts-expect-error event target fields
        updated[e.nativeEvent.target.id] = parseInt(e.target.value as string);
        return updated;
      });
    }}
  >
    <UnitSelect setUnit={(unit) => setStats(unit)} />
    <h1 className="font-bold text-xl">{title}</h1>
    <p className="font-bold">Max HP: {stats.max_hp}</p>
    <label htmlFor="strength">Strength</label>
    <input value={stats.strength} type="number" id="strength" title="Strength" />
    <label htmlFor="intelligence">Intelligence</label>
    <input value={stats.intelligence} type="number" id="intelligence" title="Intelligence" />
    <label htmlFor="speed">Speed</label>
    <input value={stats.speed} type="number" id="speed" title="Speed" />
    <label htmlFor="physicalDefense">Physical Defense</label>
    <input value={stats.phys_defense} type="number" id="phys_defense" title="Physical Defense" />
    <label htmlFor="specialDefense">Special Defense</label>
    <input value={stats.spec_defense} type="number" id="spec_defense" title="Special Defense" />
    <label htmlFor="luck">Luck</label>
    <input value={stats.luck} type="number" id="luck" title="Luck" />
  </form>
);

export default CalculatorUnitForm;
