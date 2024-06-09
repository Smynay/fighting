import { AI } from "./interfaces";
import { Actor, ActorStatus, IActor } from "../actor";
import { getRandomInt } from "../utils";

const ACTIONS_FOR_AI = [
  ActorStatus.ATTACK,
  ActorStatus.BLOCK,
  ActorStatus.REST,
  ActorStatus.DODGE,
];
export class RandomAI implements AI {
  actor: IActor = new Actor(0, 0);

  constructor() {
    this.actor = this.getActor();
  }

  getAction(): ActorStatus {
    return ACTIONS_FOR_AI[getRandomInt(ACTIONS_FOR_AI.length - 1, 0)];
  }

  getActor(): IActor {
    return new Actor(getRandomInt(5, 1), getRandomInt(5, 1));
  }
}
