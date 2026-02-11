import { PropsWithChildren, useMemo, useState } from 'react';

import CalculatorActionForm from '../components/CalculatorActionForm';
import CalculatorUnitForm from '../components/CalculatorUnitForm';
import LabeledValue from '../components/LabeledValue';
import { DEFAULT_ACTION_DATA } from '../constants/action';
import { Action } from '../types/action';
import { Unit } from '../types/unit';

const DEFAULT_STATS: Unit = {
  strength: 10,
  intelligence: 10,
  speed: 10,
  phys_defense: 10,
  spec_defense: 10,
  luck: 10,
  mana_growth: 0,
  // not used from here down
  max_hp: 100,
  starting_hp: 100,
  max_mana: 10,
  starting_mana: 0,
  point_value: 1,
  bravery: 99,
  can_flee: true,
  movement: 1,
  movement_strategy: 'ADVANCE',
  holding_distance: 0,
  faithful: false,
  inaction_limit: 20,
} as Unit;

const DEFAULT_PARAMS: Action = DEFAULT_ACTION_DATA;

function DamageCalculator() {
  const [unitStats, setUnitStats] = useState<Unit>(DEFAULT_STATS);
  const [targetStats, setTargetStats] = useState<Unit>(DEFAULT_STATS);
  const [params, setParams] = useState<Action>(DEFAULT_PARAMS);

  const results = useMemo(() => {
    const DEFENSE_CONSTANT = 0.06;

    const totalPhysAtk =
      unitStats.strength * params.damage_action_props.unit_strength_modifier +
      unitStats.speed * params.damage_action_props.unit_speed_modifier +
      params.damage_action_props.base_phys_damage;
    const basePhysDmgReduction =
      (targetStats.phys_defense * DEFENSE_CONSTANT) /
      (1 + targetStats.phys_defense * DEFENSE_CONSTANT);
    const physDmgReduction =
      basePhysDmgReduction * params.damage_action_props.target_phys_defense_modifier;
    const physDmg = Math.max(totalPhysAtk * (1 - physDmgReduction), 0);

    const totalMagAtk =
      unitStats.intelligence * params.damage_action_props.unit_int_modifier +
      params.damage_action_props.base_magic_damage;
    const baseSpecDmgReduction =
      (targetStats.spec_defense * DEFENSE_CONSTANT) /
      (1 + targetStats.spec_defense * DEFENSE_CONSTANT);
    const specDmgReduction =
      baseSpecDmgReduction * params.damage_action_props.target_spec_defense_modifier;
    const magDmg = Math.max(totalMagAtk * (1 - specDmgReduction), 0);

    const total =
      (physDmg + magDmg + params.damage_action_props.base_damage) *
      params.damage_action_props.total_damage_multiplier;

    const hitChance = Math.min(
      (unitStats.spec_defense / 2 + (100 - targetStats.speed)) * params.evasion_multiplier,
      100,
    );
    const critConstant = 40 / params.crit_chance_multiplier;
    const critChance = Math.floor(
      Math.min((unitStats.luck / (unitStats.luck + critConstant)) * 100, 100),
    );
    const critDamage = total * params.damage_action_props.crit_modifier;

    return {
      totalPhysAtk,
      basePhysDmgReduction,
      physDmgReduction,
      physDmg,
      totalMagAtk,
      baseSpecDmgReduction,
      specDmgReduction,
      magDmg,
      total,
      hitChance,
      critChance,
      critDamage,
    };
  }, [unitStats, targetStats, params]);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <CalculatorUnitForm title="Actor" setStats={setUnitStats} stats={unitStats} />
        <CalculatorActionForm params={params} setParams={setParams} />
        <CalculatorUnitForm title="Target" setStats={setTargetStats} stats={targetStats} />
      </div>
      {/* SUMMARY */}
      <div className="flex flex-col self-center gap-4">
        <div className="flex flex-row gap-2 font-bold text-2xl self-center">
          <LabeledValue label="Hit Chance" value={`${results.hitChance}%`} />
          <LabeledValue label="Damage" value={results.total} />
          <LabeledValue label="Crit Chance" value={`${results.critChance}%`} />
          <LabeledValue label="Crit Damage" value={results.critDamage} />
        </div>
        {/* PHYS */}
        <div className="flex flex-row gap-2 ">
          <LabeledValue label="Physical Attack" value={results.totalPhysAtk} />
          <Equals />
          <Parens>
            <LabeledValue label="Actor Strength" value={unitStats.strength} />
            <Mult />
            <LabeledValue
              label="Strength Modifier"
              value={params.damage_action_props.unit_strength_modifier}
            />
          </Parens>
          <Plus />
          <Parens>
            <LabeledValue label="Actor Speed" value={unitStats.speed} />
            <Mult />
            <LabeledValue
              label="Speed Modifier"
              value={params.damage_action_props.unit_speed_modifier}
            />
          </Parens>
          <Plus />
          <LabeledValue
            label="Base Physical Damage"
            value={params.damage_action_props.base_phys_damage}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Phys Dmg Reduction" value={results.physDmgReduction} />
          <Equals />
          <Brackets>
            <Parens>
              <LabeledValue label="Target Phys Defense" value={targetStats.phys_defense} />
              <Mult />
              <p className="font-bold">0.06</p>
            </Parens>
            <Divide />
            <Parens>
              <p className="font-bold">1</p>
              <Plus />
              <LabeledValue label="Target Phys Defense" value={targetStats.phys_defense} />
              <Mult />
              <p className="font-bold">0.06</p>
            </Parens>
          </Brackets>
          <Mult />
          <LabeledValue
            label="Defense Modifier"
            value={params.damage_action_props.target_phys_defense_modifier}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Physical Damage" value={results.physDmg} />
          <Equals />
          <LabeledValue label="Physical Attack" value={results.totalPhysAtk} />
          <Mult />
          <Parens>
            <p className="font-bold">1</p>
            <Minus />
            <LabeledValue label="Phys Dmg Reduction" value={results.physDmgReduction} />
          </Parens>
        </div>
        <br />
        {/* MAGIC */}
        <div className="flex flex-row gap-2 ">
          <LabeledValue label="Magic Attack" value={results.totalMagAtk} />
          <Equals />
          <Parens>
            <LabeledValue label="Actor Intelligence" value={unitStats.intelligence} />
            <Mult />
            <LabeledValue
              label="Intelligence Modifier"
              value={params.damage_action_props.unit_int_modifier}
            />
          </Parens>
          <Plus />
          <LabeledValue
            label="Base Magic Damage"
            value={params.damage_action_props.base_magic_damage}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Spec Dmg Reduction" value={results.specDmgReduction} />
          <Equals />
          <Brackets>
            <Parens>
              <LabeledValue label="Target Sp. Defense" value={targetStats.spec_defense} />
              <Mult />
              <p className="font-bold">0.06</p>
            </Parens>
            <Divide />
            <Parens>
              <p className="font-bold">1</p>
              <Plus />
              <LabeledValue label="Target Sp. Defense" value={targetStats.spec_defense} />
              <Mult />
              <p className="font-bold">0.06</p>
            </Parens>
          </Brackets>
          <Mult />
          <LabeledValue
            label="Sp. Defense Modifier"
            value={params.damage_action_props.target_spec_defense_modifier}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Magic Damage" value={results.magDmg} />
          <Equals />
          <LabeledValue label="Magic Attack" value={results.totalMagAtk} />
          <Mult />
          <Parens>
            <p className="font-bold">1</p>
            <Minus />
            <LabeledValue label="Spec Dmg Reduction" value={results.specDmgReduction} />
          </Parens>
        </div>
        <br />
        {/* TOTAL */}
        <div className="flex flex-row gap-2">
          <LabeledValue label="Total Damage" value={results.total} />
          <Equals />
          <Parens>
            <LabeledValue label="Physical Damage" value={results.physDmg} />
            <Plus />
            <LabeledValue label="Magic Damage" value={results.magDmg} />
            <Plus />
            <LabeledValue label="Base Damage" value={params.damage_action_props.base_damage} />
          </Parens>
          <Mult />
          <LabeledValue
            label="Total Damage Multiplier"
            value={params.damage_action_props.total_damage_multiplier}
          />
        </div>
        <br />
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
          <LabeledValue label="Evasion Multiplier" value={params.evasion_multiplier} />
        </div>
        <br />

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
                <LabeledValue label="Crit Chance Modifier" value={params.crit_chance_multiplier} />
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
            value={params.damage_action_props.crit_modifier}
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
    <p className="font-bold">{'{'}</p>
    {children}
    <p className="font-bold">{'}'}</p>
  </>
);
