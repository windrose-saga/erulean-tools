import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import UnitForm from "../components/UnitForm";
import LabeledValue from "../components/LabeledValue";
import ActionForm from "../components/ActionForm";
import { UnitStats } from "../types/unit";
import { Action } from "../types/action";

const DEFAULT_STATS: UnitStats = {
  strength: 10,
  intelligence: 10,
  speed: 10,
  physDefense: 10,
  specDefense: 10,
  luck: 10,
  manaGrowth: 0,
  // not used from here down
  maxHp: 100,
  startingHp: 100,
  maxMana: 10,
  startingMana: 0,
  pointValue: 1,
  bravery: 99,
  canFlee: true,
  movement: 1,
  movementStrategy: "ADVANCE",
  holdingDistance: 0,
  faithful: false,
  inactionLimit: 20,
};

const DEFAULT_PARAMS: Action = {
  actionType: "DAMAGE_ACTION",
  critChanceMultiplier: 1,
  evasionMultiplier: 1,
  damageActionProps: {
    basePhysDamage: 0,
    unitStrengthModifier: 1,
    targetPhysDefenseModifier: 1,
    baseMagicDamage: 0,
    unitIntModifier: 1,
    targetSpecDefenseModifier: 1,
    baseDexDamage: 0,
    unitSpeedModifier: 1,
    targetSpeedModifier: 1,
    critModifier: 1.5,
    baseDamage: 0,
    totalDamageMultiplier: 1,
    targetAugmentSelf: false,
    augment: null,
    critAugment: null,
  },
} as Action;

function DamageCalculator() {
  const [unitStats, setUnitStats] = useState<UnitStats>(DEFAULT_STATS);
  const [targetStats, setTargetStats] = useState<UnitStats>(DEFAULT_STATS);
  const [params, setParams] = useState<Action>(DEFAULT_PARAMS);
  const damageParams = params.damageActionProps!;

  const results = useMemo(() => {
    const physAtk =
      unitStats.strength * damageParams.unitStrengthModifier +
      damageParams.basePhysDamage;
    const physDef =
      targetStats.physDefense * damageParams.targetPhysDefenseModifier;
    const physDmg = Math.max(physAtk - physDef, 0);

    const magAtk =
      unitStats.intelligence * damageParams.unitIntModifier +
      damageParams.baseMagicDamage;
    const magDef =
      targetStats.specDefense * damageParams.targetSpecDefenseModifier;
    const magDmg = Math.max(magAtk - magDef, 0);

    const dexAtk =
      unitStats.speed * damageParams.unitSpeedModifier +
      damageParams.baseDexDamage;
    const speedDef = targetStats.speed * damageParams.targetSpeedModifier;
    const dexDef = (physDef + speedDef) / 2;
    const dexDmg = Math.max(dexAtk - dexDef, 0);

    const total =
      (physDmg + magDmg + dexDmg + damageParams.baseDamage) *
      damageParams.totalDamageMultiplier;

    const hitChance = Math.min(
      (unitStats.specDefense / 2 + (100 - targetStats.speed)) *
        params.evasionMultiplier,
      100
    );
    const critConstant = 40 / params.critChanceMultiplier;
    const critChance = Math.floor(
      Math.min((unitStats.luck / (unitStats.luck + critConstant)) * 100, 100)
    );
    const critDamage = total * damageParams.critModifier;

    return {
      physAtk,
      physDef,
      physDmg,
      magAtk,
      magDef,
      magDmg,
      dexAtk,
      dexDef,
      speedDef,
      dexDmg,
      total,
      hitChance,
      critChance,
      critDamage,
    };
  }, [unitStats, targetStats, damageParams, params]);

  useEffect(() => {
    console.log("stats", unitStats);
  }, [unitStats]);
  return (
    <div>
      <div className="flex flex-row justify-between">
        <UnitForm title="Actor" setStats={setUnitStats} stats={unitStats} />
        <ActionForm params={params} setParams={setParams} />
        <UnitForm
          title="Target"
          setStats={setTargetStats}
          stats={targetStats}
        />
      </div>
      {/* PHYS */}
      <div className="flex flex-col self-center gap-4">
        <div className="flex flex-row gap-2 font-bold text-2xl self-center">
          <LabeledValue label="Hit Chance" value={`${results.hitChance}%`} />
          <LabeledValue label="Damage" value={results.total} />
          <LabeledValue label="Crit Chance" value={`${results.critChance}%`} />
          <LabeledValue label="Crit Damage" value={results.critDamage} />
        </div>
        <div className="flex flex-row gap-2 ">
          <LabeledValue label="Physical Attack" value={results.physAtk} />
          <Equals />
          <Parens>
            <LabeledValue label="Actor Strength" value={unitStats.strength} />
            <Mult />
            <LabeledValue
              label="Actor Strength Modifier"
              value={damageParams.unitStrengthModifier}
            />
          </Parens>
          <Plus />
          <LabeledValue
            label="Base Physical Damage"
            value={damageParams.basePhysDamage}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Physical Defense" value={results.physDef} />
          <Equals />
          <LabeledValue
            label="Target Defense"
            value={targetStats.physDefense}
          />
          <Mult />
          <LabeledValue
            label="Target Defense Modifier"
            value={damageParams.targetPhysDefenseModifier}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Physical Damage" value={results.physDmg} />
          <Equals />
          <LabeledValue label="Physical Attack" value={results.physAtk} />
          <Minus />
          <LabeledValue label="Physical Defense" value={results.physDef} />
        </div>
        <br></br>
        {/* MAGIC */}

        <div className="flex flex-row gap-2 ">
          <LabeledValue label="Magic Attack" value={results.magAtk} />
          <Equals />
          <Parens>
            <LabeledValue
              label="Actor Intelligence"
              value={unitStats.intelligence}
            />
            <Mult />
            <LabeledValue
              label="Actor Intelligence Modifier"
              value={damageParams.unitIntModifier}
            />
          </Parens>
          <Plus />
          <LabeledValue
            label="Base Magic Damage"
            value={damageParams.baseMagicDamage}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Magic Defense" value={results.magDef} />
          <Equals />
          <LabeledValue
            label="Target Sp. Defense"
            value={targetStats.specDefense}
          />
          <Mult />
          <LabeledValue
            label="Target Sp. Defense Modifier"
            value={damageParams.targetSpecDefenseModifier}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Magic Damage" value={results.magDmg} />
          <Equals />
          <LabeledValue label="Magic Attack" value={results.magAtk} />
          <Minus />
          <LabeledValue label="Magic Defense" value={results.magDef} />
        </div>
        <br></br>
        {/* DEX */}
        <div className="flex flex-row gap-2 ">
          <LabeledValue label="Dexterity Attack" value={results.dexAtk} />
          <Equals />
          <Parens>
            <LabeledValue label="Actor Intelligence" value={unitStats.speed} />
            <Mult />
            <LabeledValue
              label="Actor Intelligence Modifier"
              value={damageParams.unitSpeedModifier}
            />
          </Parens>
          <Plus />
          <LabeledValue
            label="Base Dexterity Damage"
            value={damageParams.baseDexDamage}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Dexterity Defense" value={results.dexDef} />
          <Equals />
          <Brackets>
            <Parens>
              <LabeledValue label="Target Speed" value={targetStats.speed} />
              <Mult />
              <LabeledValue
                label="Target Speed Modifier"
                value={damageParams.targetSpeedModifier}
              />
            </Parens>
            <Plus />
            <Parens>
              <LabeledValue
                label="Target Defense"
                value={targetStats.physDefense}
              />
              <Mult />
              <LabeledValue
                label="Target Defense Modifier"
                value={damageParams.targetPhysDefenseModifier}
              />
            </Parens>
          </Brackets>
          <Divide />
          <p className="font-bold">2</p>
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Dexterity Damage" value={results.dexDmg} />
          <Equals />
          <LabeledValue label="Dexterity Attack" value={results.dexAtk} />
          <Minus />
          <LabeledValue label="Dexterity Defense" value={results.dexDef} />
        </div>
        <br></br>
        {/* TOTAL */}
        <div className="flex flex-row gap-2">
          <LabeledValue label="Total Damage" value={results.total} />
          <Equals />
          <Parens>
            <LabeledValue label="Physical Damage" value={results.physDmg} />
            <Plus />
            <LabeledValue label="Magic Damage" value={results.magDmg} />
            <Plus />
            <LabeledValue label="Dexterity Damage" value={results.dexDmg} />
            <Plus />
            <LabeledValue label="Base Damage" value={damageParams.baseDamage} />
          </Parens>
          <Mult />
          <LabeledValue
            label="Total Damage Multiplier"
            value={damageParams.totalDamageMultiplier}
          />
        </div>
        <br></br>
        {/* EVASION */}
        <div className="flex flex-row gap-2">
          <LabeledValue label="Hit Chance" value={`${results.hitChance}%`} />
          <Equals />
          <Brackets>
            <Parens>
              <p className="font-bold">100</p>
              <Minus />
              <LabeledValue label="Target Speed" value={targetStats.speed} />
            </Parens>
            <Plus />
            <Parens>
              <LabeledValue label="Actor Speed" value={unitStats.speed} />
              <Divide />
              <p className="font-bold">2</p>
            </Parens>
          </Brackets>
          <Mult />
          <LabeledValue
            label="Evasion Multiplier"
            value={params.evasionMultiplier}
          />
        </div>
        <br></br>

        {/* CRIT */}
        <div className="flex flex-row gap-2">
          <LabeledValue label="Crit Chance" value={`${results.critChance}%`} />
          <Equals />
          <Curlies>
            <LabeledValue label="Actor Luck" value={unitStats.luck} />
            <Divide />
            <Brackets>
              <Parens>
                <p className="font-bold">40</p>
                <Divide />
                <LabeledValue
                  label="Crit Chance Modifier"
                  value={params.critChanceMultiplier}
                />
              </Parens>
              <Plus />
              <LabeledValue label="Actor Luck" value={unitStats.luck} />
            </Brackets>
          </Curlies>
          <Mult />
          <p className="font-bold">100</p>
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Crit Damage" value={results.critDamage} />
          <Equals />
          <LabeledValue label="Total Damage" value={results.total} />
          <Mult />
          <LabeledValue
            label="Crit Damage Multiplier"
            value={damageParams.critModifier}
          />
        </div>
      </div>
    </div>
  );
}

export default DamageCalculator;

const Plus = () => <p className="font-bold">+</p>;
const Minus = () => <p className="font-bold">–</p>;
const Mult = () => <p className="font-bold">X</p>;
const Equals = () => <p className="font-bold">=</p>;
const Divide = () => <p className="font-bold">÷</p>;
const Parens = ({ children }: PropsWithChildren) => (
  <>
    <p className="font-bold">(</p>
    {children}
    <p className="font-bold">)</p>
  </>
);

const Brackets = ({ children }: PropsWithChildren) => (
  <>
    <p className="font-bold">[</p>
    {children}
    <p className="font-bold">]</p>
  </>
);

const Curlies = ({ children }: PropsWithChildren) => (
  <>
    <p className="font-bold">{"{"}</p>
    {children}
    <p className="font-bold">{"}"}</p>
  </>
);
