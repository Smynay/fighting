import { ActorStatus, IActor } from "../actor";
import { IAction } from "./interfaces";
import { BasicAction } from "./BasicAction";

export class AttackAction extends BasicAction implements IAction {
  constructor(
    protected actor: IActor,
    protected opponent: IActor,
  ) {
    super(actor, opponent);
  }

  private DAMAGE = 2;
  private STAMINA_COST = 2;
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

  private checkPossibility(): boolean {
    if (this.actor.stamina - this.STAMINA_COST < 0) {
      return false;
    }

    return true;
  }

  private payForAction(): void {
    this.actor.stamina = this.actor.stamina - this.STAMINA_COST;
    this.actor.executedAction = this.actor.selectedAction;
  }

  prepare() {
    if (this.checkPossibility()) {
      this.payForAction();
      return;
    }

    this.fallback();
  }

  private success() {}

  private fail() {
    this.actor.health = this.actor.health - this.DAMAGE;
  }

  execute() {
    if (this.checkSuccess()) {
      this.success();
      return;
    }

    this.fail();
  }
}
