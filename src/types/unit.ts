export type UnitData = {
  guid: string;
  id: string;
  name: string;
  description: string;
  stats: UnitStats;
  isCommander: boolean;
  commanderData: CommanderData | null;
  actions: Actions;
};

export type MovementStrategy = "ADVANCE" | "KEEP_DISTANCE";

export type UnitStats = {
  maxHp: number;
  startingHp: number;
  maxMana: number;
  startingMana: number;
  manaGrowth: number;
  physDefense: number;
  specDefense: number;
  speed: number;
  strength: number;
  intelligence: number;
  luck: number;
  bravery: number;
  movement: number;
  pointValue: number;
  canFlee: boolean;
  faithful: boolean;
  movementStrategy: MovementStrategy;
  holdingDistance: number;
  inactionLimit: number;
};

export type CommanderData = {
  leadership: number;
  pointLimit: number;
  gridSizeX: number;
  gridSizeY: number;
  globalAugments: Array<any>;
  armyAugments: Array<any>;
  enemyArmyAugments: Array<any>;
  armyName: string;
};

export type Actions = {
  passiveAction: any;
  primaryAction: any;
  specialAction: any;
};
