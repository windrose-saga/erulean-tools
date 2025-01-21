import { PropsWithChildren, useMemo, useState } from "react";
import UnitForm from "../components/UnitForm";
import LabeledValue from "../components/LabeledValue";
import ActionForm from "../components/ActionForm";
import { Unit } from "../types/unit";
import { DamageAction } from "../types/action";

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
  movement_strategy: "ADVANCE",
  holding_distance: 0,
  faithful: false,
  inaction_limit: 20,
} as Unit;

const DEFAULT_PARAMS: DamageAction = {
  action_type: "DAMAGE_ACTION",
  crit_chance_multiplier: 1,
  evasion_multiplier: 1,
  base_phys_damage: 0,
  unit_strength_modifier: 1,
  target_phys_defense_modifier: 1,
  base_magic_damage: 0,
  unit_int_modifier: 1,
  target_spec_defense_modifier: 1,
  base_dex_damage: 0,
  unit_speed_modifier: 1,
  target_speed_modifier: 1,
  crit_modifier: 1.5,
  base_damage: 0,
  total_damage_multiplier: 1,
  target_augment_self: false,
  augment: null,
  crit_augment: null,
} as DamageAction;

function DamageCalculator() {
  const [unitStats, setUnitStats] = useState<Unit>(DEFAULT_STATS);
  const [targetStats, setTargetStats] = useState<Unit>(DEFAULT_STATS);
  const [params, setParams] = useState<DamageAction>(DEFAULT_PARAMS);

  const results = useMemo(() => {
    const physAtk =
      unitStats.strength * params.unit_strength_modifier +
      params.base_phys_damage;
    const physDef =
      targetStats.phys_defense * params.target_phys_defense_modifier;
    const physDmg = Math.max(physAtk - physDef, 0);

    const magAtk =
      unitStats.intelligence * params.unit_int_modifier +
      params.base_magic_damage;
    const magDef =
      targetStats.spec_defense * params.target_spec_defense_modifier;
    const magDmg = Math.max(magAtk - magDef, 0);

    const dexAtk =
      unitStats.speed * params.unit_speed_modifier + params.base_dex_damage;
    const speedDef = targetStats.speed * params.target_speed_modifier;
    const dexDef = (physDef + speedDef) / 2;
    const dexDmg = Math.max(dexAtk - dexDef, 0);

    const total =
      (physDmg + magDmg + dexDmg + params.base_damage) *
      params.total_damage_multiplier;

    const hitChance = Math.min(
      (unitStats.spec_defense / 2 + (100 - targetStats.speed)) *
        params.evasion_multiplier,
      100
    );
    const critConstant = 40 / params.crit_chance_multiplier;
    const critChance = Math.floor(
      Math.min((unitStats.luck / (unitStats.luck + critConstant)) * 100, 100)
    );
    const critDamage = total * params.crit_modifier;

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
              value={params.unit_strength_modifier}
            />
          </Parens>
          <Plus />
          <LabeledValue
            label="Base Physical Damage"
            value={params.base_phys_damage}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Physical Defense" value={results.physDef} />
          <Equals />
          <LabeledValue
            label="Target Defense"
            value={targetStats.phys_defense}
          />
          <Mult />
          <LabeledValue
            label="Target Defense Modifier"
            value={params.target_phys_defense_modifier}
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
              value={params.unit_int_modifier}
            />
          </Parens>
          <Plus />
          <LabeledValue
            label="Base Magic Damage"
            value={params.base_magic_damage}
          />
        </div>
        <div className="flex flex-row gap-2">
          <LabeledValue label="Magic Defense" value={results.magDef} />
          <Equals />
          <LabeledValue
            label="Target Sp. Defense"
            value={targetStats.spec_defense}
          />
          <Mult />
          <LabeledValue
            label="Target Sp. Defense Modifier"
            value={params.target_spec_defense_modifier}
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
              value={params.unit_speed_modifier}
            />
          </Parens>
          <Plus />
          <LabeledValue
            label="Base Dexterity Damage"
            value={params.base_dex_damage}
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
                value={params.target_speed_modifier}
              />
            </Parens>
            <Plus />
            <Parens>
              <LabeledValue
                label="Target Defense"
                value={targetStats.phys_defense}
              />
              <Mult />
              <LabeledValue
                label="Target Defense Modifier"
                value={params.target_phys_defense_modifier}
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
            <LabeledValue label="Base Damage" value={params.base_damage} />
          </Parens>
          <Mult />
          <LabeledValue
            label="Total Damage Multiplier"
            value={params.total_damage_multiplier}
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
            value={params.evasion_multiplier}
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
                  value={params.crit_chance_multiplier}
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
            value={params.crit_modifier}
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
