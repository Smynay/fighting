import { IAction } from "./interfaces";
import { ActorStatus, IActor } from "../actor";
import { BasicAction } from "./BasicAction";

export class IdleActon extends BasicAction implements IAction {
  constructor(
    protected actor: IActor,
    protected opponent: IActor,
  ) {
    super(actor, opponent);
  }

  private DAMAGE_TROUGH_IDLE = 2;
  private ENEMY_ACTIONS_FOR_SUCCESS = [
    ActorStatus.BLOCK,
    ActorStatus.REST,
    ActorStatus.IDLE,
  ];

  private checkSuccess(): boolean {
    return this.ENEMY_ACTIONS_FOR_SUCCESS.includes(
      this.opponent.executedAction,
    );
  }

  private fail() {
    this.actor.health = this.actor.health - this.DAMAGE_TROUGH_IDLE;
  }

  execute() {
    if (!this.checkSuccess()) {
      this.fail();
    }
  }
}
