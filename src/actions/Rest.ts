import { ActorStatus, IActor } from "../actor";
import { IAction } from "./interfaces";
import { BasicAction } from "./BasicAction";

export class RestActon extends BasicAction implements IAction {
  constructor(
    protected actor: IActor,
    protected opponent: IActor,
  ) {
    super(actor, opponent);
  }

  private DAMAGE_TROUGH_REST = 2;
  private STAMINA_TO_REGENERATE = 2;
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

  prepare() {
    this.actor.executedAction = ActorStatus.REST;
  }

  private success() {
    this.actor.stamina = this.actor.stamina + this.STAMINA_TO_REGENERATE;
  }

  private fail() {
    this.actor.health = this.actor.health - this.DAMAGE_TROUGH_REST;
  }

  execute() {
    if (this.checkSuccess()) {
      this.success();
      return;
    }

    this.fail();
  }
}
