import { IGameInfo } from "../Game";

export interface IUserInterface {
  init(): void;

  createActor(): Promise<{ health: number; stamina: number }>;

  showActionResults(info: IGameInfo): void;

  showRoundResults(info: IGameInfo): void;

  showMatchResults(info: IGameInfo): void;

  choseAction<T extends string>(options: T[]): Promise<T>;

  showGameOver(): void;

  showCongratulations(): void;

  showDraw(): void;

  confirmRetry(): Promise<boolean>;
}
