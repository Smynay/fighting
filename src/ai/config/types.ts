import { ActorStatus, IActor } from "../../actor";

type ConfigAction = {
  action: ActorStatus;
  chance: number;
  test?: (actor: IActor, opponent?: IActor) => boolean;
};

export type ConfigActions = ConfigAction[];

export enum AIMode {
  CONVINCED = "convinced",
  NORMAL = "normal",
  SCARED = "scared",
}

type ModeConfig = {
  test?: (actor: IActor, opponent?: IActor) => boolean;
  actions: ConfigActions;
};

type ConfigAdditions = {
  name: string;
};

export type AIConfig = Record<AIMode, ModeConfig> & ConfigAdditions;
