import { IGameInfo, IPresetAndDetails } from "../GameController";

export interface IUIOption<T> {
  name: T;
  message: string;
  hint?: string;
}

export interface IUserInterface {
  init(): void;

  chooseGameMode(availableModes: string[]): Promise<string | undefined>;

  chooseAi<T extends string>(availableAis: T[]): Promise<T | undefined>;

  createActor<T extends string>(
    options: IPresetAndDetails<T>[],
    id: string,
  ): Promise<T>;

  showStats(info: IGameInfo): void;

  showActionResults(info: IGameInfo): void;

  showRoundResults(info: IGameInfo): void;

  showMatchResults(info: IGameInfo): void;

  choseAction<T extends string>(options: T[], id: string): Promise<T>;

  confirmRetry(): Promise<boolean>;

  destroy(): void;
}
