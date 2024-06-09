export enum ActorStatus {
  ATTACK = "ATTACK",
  BLOCK = "BLOCK",
  REST = "REST",
  IDLE = "IDLE",
  DODGE = "DODGE",
}

export interface IActorInfo {
  health: number;
  stamina: number;
  selectedAction: ActorStatus;
  executedAction: ActorStatus;
}

export enum ActorId {
  FIRST = "0",
  SECOND = "1",
  AI = "2",
}

export interface IActor {
  id: ActorId;
  health: number;
  stamina: number;
  selectedAction: ActorStatus;
  executedAction: ActorStatus;
  info: IActorInfo;
  setAction(action: ActorStatus): void;
  prepareAction(health: number, stamina: number, action: ActorStatus): void;
  producePoints(health: number, stamina: number): void;
  reducePoints(health: number, stamina: number): void;
}
