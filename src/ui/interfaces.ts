import { IGameInfo } from "../GameController";

export interface IUserInterface {
  init(): void;

  chooseGameMode(availableModes: string[]): Promise<string | undefined>;

  createActor(id: string): Promise<{ health: number; stamina: number }>;

  showStats(info: IGameInfo): void;

  showActionResults(info: IGameInfo): void;

  showRoundResults(info: IGameInfo): void;

  showMatchResults(info: IGameInfo): void;

  choseAction<T extends string>(options: T[], id: string): Promise<T>;

  confirmRetry(): Promise<boolean>;

  destroy(): void;
}
