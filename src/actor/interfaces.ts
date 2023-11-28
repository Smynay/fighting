export enum ActorStatus {
  ATTACK = "ATTACK",
  BLOCK = "BLOCK",
  REST = "REST",
  IDLE = "IDLE",
}

export interface IActor {
  health: number;
  stamina: number;
  selectedAction: ActorStatus;
  executedAction: ActorStatus;
}
