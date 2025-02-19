import ActionSelect from './ActionSelect';

import { Action } from '../types/action';

type Props = {
  params: Action;
  setParams(val: Action | ((stats: Action) => Action)): void;
};
const CalculatorActionForm: React.FC<Props> = ({ setParams, params }) => {
  const damageParams = params.damage_action_props;
  return (
    <form
      className="flex flex-col items-center"
      onChange={(e) => {
        setParams((curr) => {
          const updated = { ...curr };
          // eslint-disable-next-line
          const fieldId = (e?.nativeEvent?.target as unknown as { id: string }).id ?? '';
          if (!fieldId) return updated;
          if (fieldId in updated) {
            // @ts-expect-error event target fields
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            updated[fieldId] = parseFloat(e?.target?.value);
          } else {
            updated.damage_action_props = { ...updated.damage_action_props };
            // @ts-expect-error event target fields
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            updated.damage_action_props[fieldId] = parseFloat(e.target.value);
          }
          return updated;
        });
      }}
    >
      <ActionSelect typeFilter="DAMAGE_ACTION" setAction={(action: Action) => setParams(action)} />
      <h1 className="font-bold text-xl">Action Parameters</h1>
      <div className="flex flex-row gap-4 items-start">
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Actor</h1>
          <label htmlFor="unit_strength_modifier">Strength Modifier</label>
          <input
            value={damageParams.unit_strength_modifier}
            type="number"
            id="unit_strength_modifier"
            title="unit_strength_modifier"
          />
          <label htmlFor="unit_int_modifier">Intelligence Modifier</label>
          <input
            value={damageParams.unit_int_modifier}
            type="number"
            id="unit_int_modifier"
            title="unit_int_modifier"
          />
          <label htmlFor="unit_speed_modifier">Speed Modifier</label>
          <input
            value={damageParams.unit_speed_modifier}
            type="number"
            id="unit_speed_modifier"
            title="unit_speed_modifier"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Base Damage</h1>
          <label htmlFor="base_phys_damage">Base Physical Dmg</label>
          <input
            value={damageParams.base_phys_damage}
            type="number"
            id="base_phys_damage"
            title="base_phys_damage"
          />
          <label htmlFor="base_magic_damage">Base Magic Dmg</label>
          <input
            value={damageParams.base_magic_damage}
            type="number"
            id="base_magic_damage"
            title="base_magic_damage"
          />
          <label htmlFor="base_dex_damage">Base Dexterity Dmg</label>
          <input
            value={damageParams.base_dex_damage}
            type="number"
            id="base_dex_damage"
            title="base_dex_damage"
          />
          <label htmlFor="base_damage">Base Damage</label>
          <input
            value={damageParams.base_damage}
            type="number"
            id="base_damage"
            title="base_damage"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">General</h1>
          <label htmlFor="total_damage_multiplier">Total Dmg Modifier</label>
          <input
            value={damageParams.total_damage_multiplier}
            type="number"
            id="total_damage_multiplier"
            title="total_damage_multiplier"
          />
          <label htmlFor="evasion_multiplier">Evasion Modifier</label>
          <input
            value={params.evasion_multiplier}
            type="number"
            id="evasion_multiplier"
            title="evasion_multiplier"
          />
          <label htmlFor="crit_chance_multiplier">Crit Chance Modifier</label>
          <input
            value={params.crit_chance_multiplier}
            type="number"
            id="crit_chance_multiplier"
            title="crit_chance_multiplier"
          />
          <label htmlFor="crit_modifier">Crit Damage Modifier</label>
          <input
            value={damageParams.crit_modifier}
            type="number"
            id="crit_modifier"
            title="crit_modifier"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Target</h1>
          <label htmlFor="target_phys_defense_modifier">Defense Modifier</label>
          <input
            value={damageParams.target_phys_defense_modifier}
            type="number"
            id="target_phys_defense_modifier"
            title="target_phys_defense_modifier"
          />
          <label htmlFor="target_spec_defense_modifier">Sp. Defense Modifier</label>
          <input
            value={damageParams.target_spec_defense_modifier}
            type="number"
            id="target_spec_defense_modifier"
            title="target_spec_defense_modifier"
          />
          <label htmlFor="target_speed_modifier">Speed Modifier</label>
          <input
            value={damageParams.target_speed_modifier}
            type="number"
            id="target_speed_modifier"
            title="target_speed_modifier"
          />
        </div>
      </div>
    </form>
  );
};

export default CalculatorActionForm;
