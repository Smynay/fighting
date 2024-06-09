import { ActorStatus, IActor } from "../actor";

export interface AI {
  getActor(): IActor;
  getAction(): ActorStatus;
}
