import { IAction } from "./interfaces";
import { ActorStatus, IActor } from "../actor";

export class BasicAction implements IAction {
  constructor(
    protected actor: IActor,
    protected opponent: IActor,
  ) {}

  protected fallback(): void {
    this.actor.executedAction = ActorStatus.IDLE;
  }

  prepare() {}

  execute() {}

  end() {
    this.actor.selectedAction = ActorStatus.IDLE;
  }
}
