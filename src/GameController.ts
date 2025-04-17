import { IUserInterface } from "./ui/interfaces";
import {
  Actor,
  ActorId,
  ActorStatus,
  IActor,
  IActorInfo,
  IActorParams,
} from "./actor";
import { RoundActionCounter } from "./counters";
import { ActionCalculator, RoundBreakCalculator } from "./calculators";
import { AIFactory, AI } from "./ai";

export interface IGameControllerConstructor {
  new (ui: IUserInterface, isPvP?: boolean): GameController;
}

export enum GameMode {
  PvP,
  PvE,
}

export enum GameState {
  PREPARE = "prepare",
  RUN = "run",
  END = "end",
}

export interface IGameInfo {
  round: number;
  action: number;
  player: IActorInfo;
  opponent: IActorInfo;
  winnerId?: ActorId | null;
  state: GameState;
}

export interface IPresetAndDetails<T extends string> {
  value: T;
  details: IActorParams;
}

export class GameController {
  static MAX_ROUNDS = 3;
  static ACTIONS_PER_ROUND = 3;
  static AVAILABLE_MODES = [GameMode.PvE, GameMode.PvP];
  static AVAILABLE_ACTOR_PRESETS = {
    light: {
      health: 2,
      stamina: 4,
    },
    medium: {
      health: 3,
      stamina: 3,
    },
    heavy: {
      health: 4,
      stamina: 2,
    },
  } as const;

  private actor: IActor = new Actor(0, 0);
  private opponent: IActor = new Actor(0, 0);
  private counter: RoundActionCounter = new RoundActionCounter(
    GameController.MAX_ROUNDS,
    GameController.ACTIONS_PER_ROUND,
  );
  private aiFactory = new AIFactory();
  private ai: AI = this.aiFactory.getAIByType();
  private isAIChosen = false;
  private gameMode: GameMode = GameMode.PvE;
  private actors: [ActorId, ActorId] = [ActorId.FIRST, ActorId.AI];
  private state: GameState = GameState.PREPARE;

  constructor(
    private ui: IUserInterface,
    private isPvP = false,
  ) {}

  private get info(): IGameInfo {
    return {
      round: this.counter.round,
      action: this.counter.action,
      player: this.actor.info,
      opponent: this.opponent.info,
      winnerId: this.isGameEnd ? this.gameWinnerId : undefined,
      state: this.state,
    };
  }

  private get isGameEnd(): boolean {
    return this.counter.isCounterEnd || this.isGameEndByHealth;
  }

  private get isGameEndByHealth(): boolean {
    return this.opponent.health <= 0 || this.actor.health <= 0;
  }

  private get gameWinnerId(): ActorId | null {
    if (this.actor.health > this.opponent.health) {
      return this.actor.id;
    }

    if (this.actor.health === this.opponent.health) {
      return null;
    }

    return this.opponent.id;
  }

  private get availableActorPresetsAndDetails(): IPresetAndDetails<
    keyof typeof GameController.AVAILABLE_ACTOR_PRESETS
  >[] {
    const presetNames = Object.keys(
      GameController.AVAILABLE_ACTOR_PRESETS,
    ) as (keyof typeof GameController.AVAILABLE_ACTOR_PRESETS)[];

    return presetNames.map((name) => ({
      value: name,
      details: GameController.AVAILABLE_ACTOR_PRESETS[name],
    }));
  }

  private getPresetByKey(
    key: keyof typeof GameController.AVAILABLE_ACTOR_PRESETS,
  ): { health: number; stamina: number } {
    return GameController.AVAILABLE_ACTOR_PRESETS[key];
  }

  async start(gameMode?: GameMode) {
    await this.prepareGame(gameMode);

    await this.playMatch();

    await this.askForRetry();
  }

  private async playMatch() {
    this.state = GameState.RUN;

    this.ui.showStats(this.info);

    while (!this.isGameEnd) {
      await this.playAction();

      if (this.isGameEndByHealth) {
        break;
      }

      if (this.counter.isRoundBreak) {
        this.roundBreak();
        this.ui.showRoundResults(this.info);
      }
    }

    this.state = GameState.END;
    this.ui.showMatchResults(this.info);
  }

  private async playAction() {
    this.counter.next();

    await this.setActions();

    this.executeAction();

    this.ui.showActionResults(this.info);
  }

  private async getActor(id: ActorId): Promise<IActor> {
    if (id === ActorId.AI) {
      return this.ai.getActor();
    }

    const preset = await this.ui.createActor(
      this.availableActorPresetsAndDetails,
      id,
    );
    const { health, stamina } = this.getPresetByKey(preset);

    return new Actor(health, stamina, id);
  }

  private async setActor(id: ActorId): Promise<void> {
    if (id === ActorId.FIRST) {
      this.actor = await this.getActor(id);
      return;
    }

    this.opponent = await this.getActor(id);
  }

  private async setActors(): Promise<void> {
    await Promise.all(this.actors.map((id) => this.setActor(id)));

    if (this.gameMode === GameMode.PvE) {
      this.ai.setOpponent(this.actor);
    }
  }

  private async getAction(id: ActorId): Promise<ActorStatus> {
    if (id === ActorId.AI) {
      return this.ai.getAction();
    }

    return this.ui.choseAction(Actor.ALLOWED_ACTIONS, id);
  }

  private async setAction(id: ActorId): Promise<void> {
    if (id === ActorId.FIRST) {
      this.actor.setAction(await this.getAction(id));
      return;
    }

    this.opponent.setAction(await this.getAction(id));
  }

  private async setActions(): Promise<void> {
    await Promise.all(this.actors.map((id) => this.setAction(id)));
  }

  private executeAction() {
    new ActionCalculator().execute(this.actor, this.opponent);
  }

  private roundBreak() {
    new RoundBreakCalculator().execute(this.actor, this.opponent);
  }

  private async prepareGame(gameMode?: GameMode): Promise<void> {
    this.state = GameState.PREPARE;

    this.ui.init();

    if (this.isPvP || gameMode === GameMode.PvP) {
      this.gameMode = GameMode.PvP;
    } else {
      this.gameMode = GameMode.PvE;
    }

    if (this.gameMode === GameMode.PvE) {
      await this.askForAi();
    }

    if (this.gameMode === GameMode.PvP) {
      this.actors = [ActorId.FIRST, ActorId.SECOND];
    }

    await this.setActors();
  }

  private async askForRetry(): Promise<void> {
    if (await this.ui.confirmRetry()) {
      this.counter.reset();
      await this.start();
      return;
    }

    this.counter.reset();
    this.ui.destroy();
  }

  private async askForAi(): Promise<void> {
    if (this.isAIChosen) {
      return;
    }

    const selectedAi = await this.ui.chooseAi(this.aiFactory.allowedAITypes);

    this.ai = this.aiFactory.getAIByType(selectedAi);
    this.isAIChosen = true;
  }
}
