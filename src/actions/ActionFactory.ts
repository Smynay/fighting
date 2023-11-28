import { ActorStatus, IActor } from "../actor";
import { AttackAction } from "./Attack";
import { BlockAction } from "./Block";
import { RestActon } from "./Rest";
import { IAction, IActionConstructor, IActionFactory } from "./interfaces";
import { IdleActon } from "./Idle";

export class ActionFactory implements IActionFactory {
  static actionsByStatus: Record<keyof typeof ActorStatus, IActionConstructor> =
    {
      [ActorStatus.ATTACK]: AttackAction,
      [ActorStatus.BLOCK]: BlockAction,
      [ActorStatus.REST]: RestActon,
      [ActorStatus.IDLE]: IdleActon,
    };

  constructor(
    private actor: IActor,
    private opponent: IActor,
  ) {}

  getActionBySelected(): IAction {
    return new ActionFactory.actionsByStatus[this.actor.selectedAction](
      this.actor,
      this.opponent,
    );
  }

  getActionByExecuted(): IAction {
    return new ActionFactory.actionsByStatus[this.actor.executedAction](
      this.actor,
      this.opponent,
    );
  }
}
