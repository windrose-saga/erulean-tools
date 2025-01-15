import * as React from "react";
import { CommanderData, UnitData, UnitStats } from "../types/unit";
import useDataContext from "../context/DataContext/useDataContext";

const Upload: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);

  const { setUnits } = useDataContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          try {
            const data = JSON.parse(fileReader.result as string);
            setUnits(getUnitLines(data.sheets).map(getUnitData));
            console.log(getUnitLines(data.sheets).map(getUnitData));
          } catch (error) {
            console.warn("Failed to parse JSON:", error);
          }
        }
      };
    }
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
    </div>
  );
};

export default Upload;

const getUnitLines = (data: Array<any>) => {
  return data.find(
    (sheet: any) => sheet.guid === "c4ca663f-445a-4bcb-bf4e-4cd51455c0a5"
  ).lines;
};

const getUnitData = (line: any): UnitData => {
  const stats: UnitStats = {
    maxHp: line.max_hp,
    startingHp: line.starting_hp,
    maxMana: line.max_mana,
    startingMana: line.starting_mana,
    manaGrowth: line.mana_growth,
    physDefense: line.phys_defense,
    specDefense: line.spec_defense,
    speed: line.speed,
    strength: line.strength,
    intelligence: line.intelligence,
    luck: line.luck,
    bravery: line.bravery,
    movement: line.movement,
    pointValue: line.point_value,
    canFlee: line.can_flee,
    faithful: line.faithful,
    movementStrategy: line.movement_strategy,
    holdingDistance: line.holding_distance,
    inactionLimit: line.inaction_limit,
  };

  const commanderData: CommanderData = {
    leadership: line.commander_data.leadership,
    pointLimit: line.commander_data.point_limit,
    gridSizeX: line.commander_data.grid_size_x,
    gridSizeY: line.commander_data.grid_size_y,
    globalAugments: line.commander_data.global_augments,
    armyAugments: line.commander_data.army_augments,
    enemyArmyAugments: line.commander_data.enemy_army_augments,
    armyName: line.commander_data.army_name,
  };

  return {
    guid: line.guid,
    id: line.id,
    name: line.name,
    description: line.presentation.description,
    isCommander: line.is_commander,
    commanderData,
    stats,
    actions: line.actions,
  };
};
