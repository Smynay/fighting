import { IUIOption, IUserInterface } from "../interfaces";
import { IO } from "./IO";
import { IGameInfo, IPresetAndDetails } from "../../GameController";

export class ConsoleUI implements IUserInterface {
  async choseAction<T extends string>(options: T[]): Promise<T> {
    return await IO.select("Chose your action:", options);
  }

  async createActor<T extends string>(
    options: IPresetAndDetails<T>[],
    id: string,
  ): Promise<T> {
    const prepared = options.reduce(
      (arr, { value, details }) => [
        ...arr,
        {
          name: value,
          message: value.toUpperCase(),
          hint: `(HP:${details.health} SP:${details.stamina})`,
        },
      ],
      [] as IUIOption<T>[],
    );

    return await IO.select<T>("Chose your actor type:", prepared);
  }

  async chooseGameMode(availableModes: string[]): Promise<string | undefined> {
    return;
  }

  async chooseAi<T extends string>(availableAis: T[]): Promise<T | undefined> {
    return await IO.select("Chose your ai opponent difficulty:", availableAis);
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
