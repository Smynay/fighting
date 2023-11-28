import { IUserInterface } from "../interfaces";
import { IO } from "./IO";
import { IGameInfo } from "../../Game";

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

  init(): void {
    IO.write("***************************");
    IO.write("**     Taste of IRON     **");
    IO.write("**                       **");
    IO.write("**    Its a game about   **");
    IO.write("**     crushing faces!   **");
    IO.write("***************************");
  }

  showActionResults(info: IGameInfo): void {
    IO.write("***************************");
    IO.write("***    ACTION RESULTS   ***");
    IO.write("***************************");
    IO.write(
      `* YOU * HP: ${info.player.health} SP: ${info.player.stamina} ${info.player.executedAction} *`,
    );
    IO.write("***************************");
    IO.write(
      `* EMY * HP: ${info.opponent.health} SP: ${info.opponent.stamina} ${info.opponent.executedAction} *`,
    );
    IO.write("***************************");
  }

  showMatchResults(info: IGameInfo): void {
    IO.write("***************************");
    IO.write("***    MATCH RESULTS    ***");
    IO.write("***************************");
    IO.write(`* YOU * HP: ${info.player.health} SP: ${info.player.stamina} *`);
    IO.write("***************************");
    IO.write(
      `* EMY * HP: ${info.opponent.health} SP: ${info.opponent.stamina} *`,
    );
    IO.write("***************************");
  }

  showRoundResults(info: IGameInfo): void {
    IO.write("***************************");
    IO.write("***    ROUND RESULTS    ***");
    IO.write("***************************");
    IO.write(
      `* YOU *  HP: ${info.player.health} SP: ${info.player.stamina}  *`,
    );
    IO.write("***************************");
    IO.write(
      `* EMY *  HP: ${info.opponent.health} SP: ${info.opponent.stamina}  *`,
    );
    IO.write("***************************");
  }

  showGameOver(): void {
    IO.write("***************************");
    IO.write("*****    GAME OVER    *****");
    IO.write("***************************");
  }

  showCongratulations(): void {
    IO.write("***************************");
    IO.write("**  CONGRATULATIONS !!!  **");
    IO.write("***************************");
  }

  showDraw(): void {
    IO.write("***************************");
    IO.write("******    DRAW !!!    *****");
    IO.write("***************************");
  }

  async confirmRetry(): Promise<boolean> {
    return IO.confirm("Ready for retry?");
  }
}
