import { CommanderData, Unit } from "../../types/unit";

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
  const commanderData = is_commander
    ? getCommanderData(raw_commander_data)
    : null;

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
    actions,
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
}: any): CommanderData => {
  return {
    leadership,
    point_limit,
    grid_size_x,
    grid_size_y,
    global_augments,
    army_augments,
    enemy_army_augments,
    army_name,
  };
};
