export type ActionParams = {
  basePhysical: number;
  baseSpecial: number;
  baseDex: number;
  baseDmg: number;
  totalDmgMod: number;
  actorStrMod: number;
  actorIntMod: number;
  actorSpdMod: number;
  targetDefMod: number;
  targetSpDefMod: number;
  targetSpdMod: number;
  evasionMod: number;
  critChanceMod: number;
  critDamageMod: number;
};

type Props = {
  params: ActionParams;
  setParams(val: ActionParams | ((stats: ActionParams) => ActionParams)): void;
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
          <label htmlFor="actorStrMod">Strength Modifier</label>
          <input
            value={params.actorStrMod}
            type="number"
            id="actorStrMod"
            title="actorStrMod"
          />
          <label htmlFor="actorIntMod">Intelligence Modifier</label>
          <input
            value={params.actorIntMod}
            type="number"
            id="actorIntMod"
            title="actorIntMod"
          />
          <label htmlFor="actorSpdMod">Speed Modifier</label>
          <input
            value={params.actorSpdMod}
            type="number"
            id="actorSpdMod"
            title="actorSpdMod"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Base Damage</h1>
          <label htmlFor="basePhysical">Base Physical Dmg</label>
          <input
            value={params.basePhysical}
            type="number"
            id="basePhysical"
            title="basePhysical"
          />
          <label htmlFor="baseSpecial">Base Magic Dmg</label>
          <input
            value={params.baseSpecial}
            type="number"
            id="baseSpecial"
            title="baseSpecial"
          />
          <label htmlFor="baseDex">Base Dexterity Dmg</label>
          <input
            value={params.baseDex}
            type="number"
            id="baseDex"
            title="baseDex"
          />
          <label htmlFor="baseDmg">Base Damage</label>
          <input
            value={params.baseDmg}
            type="number"
            id="baseDmg"
            title="baseDmg"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">General</h1>
          <label htmlFor="totalDmgMod">Total Dmg Modifier</label>
          <input
            value={params.totalDmgMod}
            type="number"
            id="totalDmgMod"
            title="totalDmgMod"
          />
          <label htmlFor="evasionMod">Evasion Modifier</label>
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
          />
          <label htmlFor="critDamageMod">Crit Damage Modifier</label>
          <input
            value={params.critDamageMod}
            type="number"
            id="critDamageMod"
            title="critDamageMod"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-md">Target</h1>
          <label htmlFor="targetDefMod">Defense Modifier</label>
          <input
            value={params.targetDefMod}
            type="number"
            id="targetDefMod"
            title="targetDefMod"
          />
          <label htmlFor="targetSpDefMod">Sp. Defense Modifier</label>
          <input
            value={params.targetSpDefMod}
            type="number"
            id="targetSpDefMod"
            title="targetSpDefMod"
          />
          <label htmlFor="targetSpdMod">Speed Modifier</label>
          <input
            value={params.targetSpdMod}
            type="number"
            id="targetSpdMod"
            title="targetSpdMod"
          />
        </div>
      </div>
    </form>
  );
};

export default ActionForm;
