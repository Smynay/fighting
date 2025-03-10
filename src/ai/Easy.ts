import { AI } from "./interfaces";
import { Actor, ActorStatus, IActor } from "../actor";
import { AILogic } from "./config";
import { easyConfig } from "./config";
import { getRandomInt } from "../utils";

export class Easy implements AI {
  private actor: IActor = new Actor(0, 0);
  private readonly logic: AILogic;

  constructor() {
    this.logic = new AILogic(easyConfig);
  }

  getAction(): ActorStatus {
    console.log("ai", this.actor.health, this.actor.stamina);

    return this.logic.getAction(this.actor);
  }

  getActor(): IActor {
    this.actor = new Actor(getRandomInt(5, 1), getRandomInt(5, 1));

    return this.actor;
  }
}
