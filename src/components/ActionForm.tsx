import { DamageActionData } from "../types/action";

type Props = {
  params: DamageActionData;
  setParams(
    val: DamageActionData | ((stats: DamageActionData) => DamageActionData)
  ): void;
};
const ActionForm: React.FC<Props> = ({ setParams, params }) => {
  return (
    <form
      className="flex flex-col items-center"
      onChange={(e) => {
        setParams((curr) => {
          const updated = { ...curr };
          // @ts-expect-error event target fields
          updated[e.nativeEvent.target.id] = parseFloat(e.target.value);
          return updated;
        });
      }}
    >
      <h1 className="font-bold text-xl">Action Parameters</h1>
      <div className="flex flex-row gap-4 items-start">
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Actor</h1>
          <label htmlFor="unitStrengthModifier">Strength Modifier</label>
          <input
            value={params.unitStrengthModifier}
            type="number"
            id="unitStrengthModifier"
            title="unitStrengthModifier"
          />
          <label htmlFor="unitIntModifier">Intelligence Modifier</label>
          <input
            value={params.unitIntModifier}
            type="number"
            id="unitIntModifier"
            title="unitIntModifier"
          />
          <label htmlFor="unitSpeedModifier">Speed Modifier</label>
          <input
            value={params.unitSpeedModifier}
            type="number"
            id="unitSpeedModifier"
            title="unitSpeedModifier"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Base Damage</h1>
          <label htmlFor="basePhysDamage">Base Physical Dmg</label>
          <input
            value={params.basePhysDamage}
            type="number"
            id="basePhysDamage"
            title="basePhysDamage"
          />
          <label htmlFor="baseMagicDamage">Base Magic Dmg</label>
          <input
            value={params.baseMagicDamage}
            type="number"
            id="baseMagicDamage"
            title="baseMagicDamage"
          />
          <label htmlFor="baseDexDamage">Base Dexterity Dmg</label>
          <input
            value={params.baseDexDamage}
            type="number"
            id="baseDexDamage"
            title="baseDexDamage"
          />
          <label htmlFor="baseDamage">Base Damage</label>
          <input
            value={params.baseDamage}
            type="number"
            id="baseDamage"
            title="baseDamage"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">General</h1>
          <label htmlFor="totalDamageMultiplier">Total Dmg Modifier</label>
          <input
            value={params.totalDamageMultiplier}
            type="number"
            id="totalDamageMultiplier"
            title="totalDamageMultiplier"
          />
          {/* <label htmlFor="evasionMod">Evasion Modifier</label>
          <input
            value={params.evasionMod}
            type="number"
            id="evasionMod"
            title="evasionMod"
          />
          <label htmlFor="critChanceMod">Crit Chance Modifier</label>
          <input
            value={params.critChanceMod}
            type="number"
            id="critChanceMod"
            title="critChanceMod"
          /> */}
          <label htmlFor="critModifier">Crit Damage Modifier</label>
          <input
            value={params.critModifier}
            type="number"
            id="critModifier"
            title="critModifier"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Target</h1>
          <label htmlFor="targetPhysDefenseModifier">Defense Modifier</label>
          <input
            value={params.targetPhysDefenseModifier}
            type="number"
            id="targetPhysDefenseModifier"
            title="targetPhysDefenseModifier"
          />
          <label htmlFor="targetSpecDefenseModifier">
            Sp. Defense Modifier
          </label>
          <input
            value={params.targetSpecDefenseModifier}
            type="number"
            id="targetSpecDefenseModifier"
            title="targetSpecDefenseModifier"
          />
          <label htmlFor="targetSpeedModifier">Speed Modifier</label>
          <input
            value={params.targetSpeedModifier}
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
