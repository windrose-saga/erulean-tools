import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import "./App.css";
import UnitForm, { UnitStats } from "./components/UnitForm";
import LabeledValue from "./components/LabeledValue";
import ActionForm, { ActionParams } from "./components/ActionForm";

const DEFAULT_STATS: UnitStats = {
  strength: 10,
  intelligence: 10,
  speed: 10,
  physicalDefense: 10,
  specialDefense: 10,
  luck: 10,
};

const DEFAULT_PARAMS: ActionParams = {
  basePhysical: 0,
  baseSpecial: 0,
  baseDex: 0,
  baseDmg: 0,
  totalDmgMod: 1,
  actorStrMod: 1,
  actorIntMod: 1,
  actorSpdMod: 1,
  targetDefMod: 1,
  targetSpDefMod: 1,
  targetSpdMod: 1,
  evasionMod: 1,
  critChanceMod: 1,
  critDamageMod: 1.5,
};

function App() {
  const [unitStats, setUnitStats] = useState<UnitStats>(DEFAULT_STATS);
  const [targetStats, setTargetStats] = useState<UnitStats>(DEFAULT_STATS);
  const [params, setParams] = useState<ActionParams>(DEFAULT_PARAMS);

  const results = useMemo(() => {
    const physAtk =
      unitStats.strength * params.actorStrMod + params.basePhysical;
    const physDef = targetStats.physicalDefense * params.targetDefMod;
    const physDmg = Math.max(physAtk - physDef, 0);

    const magAtk =
      unitStats.intelligence * params.actorIntMod + params.baseSpecial;
    const magDef = targetStats.specialDefense * params.targetSpDefMod;
    const magDmg = Math.max(magAtk - magDef, 0);

    const dexAtk = unitStats.speed * params.actorSpdMod + params.baseDex;
    const speedDef = targetStats.speed * params.targetSpdMod;
    const dexDef = (physDef + speedDef) / 2;
    const dexDmg = Math.max(dexAtk - dexDef, 0);

    const total =
      (physDmg + magDmg + dexDmg + params.baseDmg) * params.totalDmgMod;

    const hitChance = Math.min(
      (unitStats.specialDefense / 2 + (100 - targetStats.speed)) *
        params.evasionMod,
      100
    );
    const critConstant = 40 / params.critChanceMod;
    const critChance = Math.floor(
      Math.min((unitStats.luck / (unitStats.luck + critConstant)) * 100, 100)
    );
    const critDamage = total * params.critDamageMod;

    //   var constant = CRIT_CONSTANT / crit_chance_multiplier
    // var chance = unit.stats.luck / (constant + unit.stats.luck)
    // return Probability.weighted_roll(chance)

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
  }, [unitStats, targetStats, params]);

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
              value={params.actorStrMod}
            />
          </Parens>
          <Plus />
          <LabeledValue
            label="Base Physical Damage"
            value={params.basePhysical}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Physical Defense" value={results.physDef} />
          <Equals />
          <LabeledValue
            label="Target Defense"
            value={targetStats.physicalDefense}
          />
          <Mult />
          <LabeledValue
            label="Target Defense Modifier"
            value={params.targetDefMod}
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
              value={params.actorIntMod}
            />
          </Parens>
          <Plus />
          <LabeledValue label="Base Magic Damage" value={params.baseSpecial} />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Magic Defense" value={results.magDef} />
          <Equals />
          <LabeledValue
            label="Target Sp. Defense"
            value={targetStats.specialDefense}
          />
          <Mult />
          <LabeledValue
            label="Target Sp. Defense Modifier"
            value={params.targetSpDefMod}
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
              value={params.actorSpdMod}
            />
          </Parens>
          <Plus />
          <LabeledValue label="Base Dexterity Damage" value={params.baseDex} />
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
                value={params.targetSpdMod}
              />
            </Parens>
            <Plus />
            <Parens>
              <LabeledValue
                label="Target Defense"
                value={targetStats.physicalDefense}
              />
              <Mult />
              <LabeledValue
                label="Target Defense Modifier"
                value={params.targetDefMod}
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
            <LabeledValue label="Base Damage" value={params.baseDmg} />
          </Parens>
          <Mult />
          <LabeledValue
            label="Total Damage Multiplier"
            value={params.totalDmgMod}
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
          <LabeledValue label="Evasion Multiplier" value={params.evasionMod} />
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
                  value={params.critChanceMod}
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
            value={params.critDamageMod}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

// func _calculate_damage(target: Unit) -> float:
// 	var total_phys_attack = (unit.stats.strength * unit_strength_modifier) + base_phys_damage
// 	var total_phys_def = target.stats.physical_defense * target_phys_defense_modifier
// 	var physical_damage = max(total_phys_attack - total_phys_def, 0)

// 	var total_magic_attack = (unit.stats.intelligence * unit_int_modifier) + base_magic_damage
// 	var total_spec_defense = target.stats.special_defense * target_spec_defense_modifier
// 	var magic_damage = max(total_magic_attack - total_spec_defense, 0)

// 	var total_dex_attack = (unit.stats.speed * unit_speed_modifier) + base_dex_damage
// 	var total_speed_def = target.stats.speed * target_speed_modifier
// 	var total_dex_def = (total_speed_def + total_phys_def) / 2
// 	var dex_damage = max(total_dex_attack - total_dex_def, 0)

// 	return (physical_damage + magic_damage + dex_damage + base_damage) * total_damage_multiplier

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
