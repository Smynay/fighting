import { IActor } from "../actor";

export class RoundBreakCalculator {
  execute(actor: IActor, opponent: IActor): void {
    this.makeBreakEffects(actor);
    this.makeBreakEffects(opponent);
  }

  private makeBreakEffects(actor: IActor) {
    actor.health += 2;
    actor.stamina += 2;
  }
}
