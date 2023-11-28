import { IUserInterface } from "./ui/interfaces";
import { Game, IGameInfo } from "./Game";
import { Actor, IActor } from "./actor";

export class GameController {
  actor: IActor = new Actor(0, 0);
  game: Game = new Game(this.actor);
  maxRounds = 3;
  actionsPerRound = 3;

  constructor(private ui: IUserInterface) {}

  async start() {
    this.ui.init();

    const { health, stamina } = await this.ui.createActor();

    this.actor = new Actor(health, stamina);

    this.game = new Game(this.actor);

    await this.playMatch();

    if (await this.ui.confirmRetry()) {
      this.start();
    }
  }

  private async playMatch() {
    while (!this.game.isGameEnd && this.game.info.round <= this.maxRounds) {
      await this.playRound(this.game.info.round);
    }

    this.showGameResult(this.game.info);
  }

  private async playRound(round: number) {
    while (
      !this.game.isGameEnd &&
      this.game.info.action <= this.actionsPerRound * round
    ) {
      await this.playAction();

      if (this.game.isGameEnd) {
        break;
      }

      if (this.checkRoundEnd()) {
        this.game.roundBreak();
        this.ui.showRoundResults(this.game.info);
      }
    }
  }

  private checkRoundEnd(): boolean {
    return !((this.game.info.action - 1) % this.actionsPerRound);
  }

  private async playAction() {
    const action = await this.ui.choseAction(Game.gameActions);

    console.clear();

    this.game.setAction(action);

    this.game.executeAction();

    const info = this.game.info;

    this.ui.showActionResults(info);
  }

  private showGameResult(info: IGameInfo) {
    if (info.player.health > info.opponent.health) {
      this.ui.showCongratulations();
      return;
    }

    if (info.player.health === info.opponent.health) {
      this.ui.showDraw();
      return;
    }

    this.ui.showGameOver();
  }
}
