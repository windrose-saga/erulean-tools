/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DEFAULT_COMMANDER_DATA } from '../../constants/unit';
import { CommanderData, Unit } from '../../types/unit';

export const getUnitData = ({
  guid,
  id,
  name,
  presentation,
  is_commander,
  max_hp,
  starting_hp,
  max_mana,
  starting_mana,
  mana_growth,
  phys_defense,
  spec_defense,
  speed,
  strength,
  intelligence,
  luck,
  bravery,
  movement,
  point_value,
  can_flee,
  faithful,
  movement_strategy,
  holding_distance,
  inaction_limit,
  actions,
  commander_data: raw_commander_data,
}: any): Unit => {
  const commanderData = getCommanderData(
    is_commander ? (raw_commander_data as CommanderData) : DEFAULT_COMMANDER_DATA,
  );

  return {
    guid,
    id,
    name,
    description: presentation.description,
    is_commander,
    commander_data: commanderData,
    max_hp,
    starting_hp,
    max_mana,
    starting_mana,
    mana_growth,
    phys_defense,
    spec_defense,
    speed,
    strength,
    intelligence,
    luck,
    bravery,
    movement,
    point_value,
    can_flee,
    faithful,
    movement_strategy,
    holding_distance,
    inaction_limit,
    actions: getActions(actions),
  };
};

const getCommanderData = ({
  leadership,
  point_limit,
  grid_size_x,
  grid_size_y,
  global_augments,
  army_augments,
  enemy_army_augments,
  army_name,
}: CommanderData): CommanderData => ({
  leadership,
  point_limit,
  grid_size_x,
  grid_size_y,
  global_augments,
  army_augments,
  enemy_army_augments,
  army_name,
});

const getActions = (line: any) => ({
  passive_action: line.passive_action || null,
  primary_action: line.primary_action || null,
  special_action: line.special_action || null,
  primary_action_mana_delta: line.primary_action_mana_delta || 1,
  special_action_mana_delta: line.special_action_mana_delta || -5,
  passive_action_mana_delta: line.passive_action_mana_delta || 0,
});
