import { IUserInterface } from "../interfaces";
import { IO } from "./IO";
import { IGameInfo } from "../../GameController";

export class ConsoleUI implements IUserInterface {
  async choseAction<T extends string>(options: T[]): Promise<T> {
    return await IO.select("Chose your action:", options);
  }

  async createActor(): Promise<{ health: number; stamina: number }> {
    return await IO.scale("Complete your stats:", { health: 2, stamina: 2 }, [
      { name: 1, message: "extra light" },
      { name: 2, message: "light" },
      { name: 3, message: "medium" },
      { name: 4, message: "heavy" },
      { name: 5, message: "extra heavy" },
    ]);
  }

  async chooseGameMode(availableModes: string[]): Promise<string | undefined> {
    return;
  }

  init(): void {
    IO.writeDivider();
    IO.write("Taste of IRON");
    IO.writeEmpty();
    IO.write("Its a game about");
    IO.write("crushing faces!");
    IO.writeDivider();
  }

  private showResult(title: string, info: IGameInfo, statsOnly = false): void {
    IO.writeDivider();
    IO.write(title);
    IO.writeDivider(true);
    IO.write(
      [
        "YOU",
        `HP: ${info.player.health} SP: ${info.player.stamina} ${
          statsOnly ? "" : info.player.executedAction
        }`,
      ],
      false,
    );
    IO.writeDivider(true);
    IO.write(
      [
        "EMY",
        `HP: ${info.opponent.health} SP: ${info.opponent.stamina} ${
          statsOnly ? "" : info.opponent.executedAction
        }`,
      ],
      false,
    );
    IO.writeDivider();
  }

  private showBox(title: string): void {
    IO.writeDivider();
    IO.write(title);
    IO.writeDivider();
  }

  showStats(info: IGameInfo): void {
    this.showResult("FIGHTERS STATS", info, true);
  }

  showActionResults(info: IGameInfo): void {
    this.showResult("ACTION RESULTS", info);
  }

  showMatchResults(info: IGameInfo): void {
    this.printGameStatus(info.winnerId);
    this.showResult("MATCH RESULTS", info);
  }

  showRoundResults(info: IGameInfo): void {
    this.showBox("BREAK");
    this.showResult("ROUND RESULTS", info, true);
  }

  private printGameStatus(winnerId?: string | null): void {
    if (winnerId === "0") {
      this.showCongratulations();
      return;
    }

    if (winnerId === "1" || winnerId === "2") {
      this.showGameOver();
      return;
    }

    this.showDraw();
  }

  private showGameOver(): void {
    this.showBox("GAME OVER");
  }

  private showCongratulations(): void {
    this.showBox("CONGRATULATIONS !!!");
  }

  private showDraw(): void {
    this.showBox("DRAW");
  }

  async confirmRetry(): Promise<boolean> {
    return IO.confirm("Ready for retry?");
  }

  destroy() {}
}
