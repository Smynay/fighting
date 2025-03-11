import { AI } from "./interfaces";
import { Actor, ActorStatus, IActor } from "../actor";
import { AILogic, hardConfig } from "./config";
import { getRandomInt } from "../utils";

export class Hard implements AI {
  private actor: IActor = new Actor(0, 0);
  private opponent: IActor = new Actor(0, 0);
  private readonly logic: AILogic;

  constructor() {
    this.logic = new AILogic(hardConfig);
  }

  getAction(): ActorStatus {
    return this.logic.getAction(this.actor, this.opponent);
  }

  getActor(): IActor {
    this.actor = new Actor(getRandomInt(5, 1), getRandomInt(5, 1));

    return this.actor;
  }

  setOpponent(actor: IActor) {
    this.opponent = actor;
  }
}
