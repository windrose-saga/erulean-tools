import { Action } from "../types/action";
import ActionSelect from "./ActionSelect";

type Props = {
  params: Action;
  setParams(val: Action | ((stats: Action) => Action)): void;
};
const ActionForm: React.FC<Props> = ({ setParams, params }) => {
  const damageParams = params.damageActionProps!;
  return (
    <form
      className="flex flex-col items-center"
      onChange={(e) => {
        setParams((curr) => {
          const updated = { ...curr };
          // @ts-expect-error event target fields
          const fieldId = e.nativeEvent.target.id;
          if (fieldId in updated) {
            // @ts-expect-error event target fields
            updated[fieldId] = parseFloat(e.target.value);
          } else {
            // @ts-expect-error event target fields
            updated.damageActionProps![fieldId] = parseFloat(e.target.value);
          }
          return updated;
        });
      }}
    >
      <ActionSelect
        typeFilter="DAMAGE_ACTION"
        setAction={(action: Action) => setParams(action!)}
      />
      <h1 className="font-bold text-xl">Action Parameters</h1>
      <div className="flex flex-row gap-4 items-start">
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Actor</h1>
          <label htmlFor="unitStrengthModifier">Strength Modifier</label>
          <input
            value={damageParams.unitStrengthModifier}
            type="number"
            id="unitStrengthModifier"
            title="unitStrengthModifier"
          />
          <label htmlFor="unitIntModifier">Intelligence Modifier</label>
          <input
            value={damageParams.unitIntModifier}
            type="number"
            id="unitIntModifier"
            title="unitIntModifier"
          />
          <label htmlFor="unitSpeedModifier">Speed Modifier</label>
          <input
            value={damageParams.unitSpeedModifier}
            type="number"
            id="unitSpeedModifier"
            title="unitSpeedModifier"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Base Damage</h1>
          <label htmlFor="basePhysDamage">Base Physical Dmg</label>
          <input
            value={damageParams.basePhysDamage}
            type="number"
            id="basePhysDamage"
            title="basePhysDamage"
          />
          <label htmlFor="baseMagicDamage">Base Magic Dmg</label>
          <input
            value={damageParams.baseMagicDamage}
            type="number"
            id="baseMagicDamage"
            title="baseMagicDamage"
          />
          <label htmlFor="baseDexDamage">Base Dexterity Dmg</label>
          <input
            value={damageParams.baseDexDamage}
            type="number"
            id="baseDexDamage"
            title="baseDexDamage"
          />
          <label htmlFor="baseDamage">Base Damage</label>
          <input
            value={damageParams.baseDamage}
            type="number"
            id="baseDamage"
            title="baseDamage"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">General</h1>
          <label htmlFor="totalDamageMultiplier">Total Dmg Modifier</label>
          <input
            value={damageParams.totalDamageMultiplier}
            type="number"
            id="totalDamageMultiplier"
            title="totalDamageMultiplier"
          />
          <label htmlFor="evasionMultiplier">Evasion Modifier</label>
          <input
            value={params.evasionMultiplier}
            type="number"
            id="evasionMultiplier"
            title="evasionMultiplier"
          />
          <label htmlFor="critChanceMultiplier">Crit Chance Modifier</label>
          <input
            value={params.critChanceMultiplier}
            type="number"
            id="critChanceMultiplier"
            title="critChanceMultiplier"
          />
          <label htmlFor="critModifier">Crit Damage Modifier</label>
          <input
            value={damageParams.critModifier}
            type="number"
            id="critModifier"
            title="critModifier"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Target</h1>
          <label htmlFor="targetPhysDefenseModifier">Defense Modifier</label>
          <input
            value={damageParams.targetPhysDefenseModifier}
            type="number"
            id="targetPhysDefenseModifier"
            title="targetPhysDefenseModifier"
          />
          <label htmlFor="targetSpecDefenseModifier">
            Sp. Defense Modifier
          </label>
          <input
            value={damageParams.targetSpecDefenseModifier}
            type="number"
            id="targetSpecDefenseModifier"
            title="targetSpecDefenseModifier"
          />
          <label htmlFor="targetSpeedModifier">Speed Modifier</label>
          <input
            value={damageParams.targetSpeedModifier}
            type="number"
            id="targetSpeedModifier"
            title="targetSpeedModifier"
          />
        </div>
      </div>
    </form>
  );
};

export default ActionForm;
