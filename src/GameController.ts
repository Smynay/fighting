import { IUserInterface } from "./ui/interfaces";
import { Actor, ActorId, ActorStatus, IActor, IActorInfo } from "./actor";
import { RandomAI } from "./ai";
import { RoundActionCounter } from "./counters";
import { ActionCalculator, RoundBreakCalculator } from "./calculators";

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
  RETRY = "retry",
}

export interface IGameInfo {
  round: number;
  action: number;
  player: IActorInfo;
  opponent: IActorInfo;
  winnerId?: ActorId | null;
  state: GameState;
}

export class GameController {
  static MAX_ROUNDS = 3;
  static ACTIONS_PER_ROUND = 3;
  static AVAILABLE_MODES = [GameMode.PvE, GameMode.PvP];

  private actor: IActor = new Actor(0, 0);
  private opponent: IActor = new Actor(0, 0);
  private counter: RoundActionCounter = new RoundActionCounter(
    GameController.MAX_ROUNDS,
    GameController.ACTIONS_PER_ROUND,
  );
  private ai = new RandomAI();
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

    const { health, stamina } = await this.ui.createActor(id);

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

    if (this.isPvP) {
      this.gameMode = GameMode.PvP;
    }

    this.gameMode = gameMode || this.gameMode;

    console.log(this.gameMode, gameMode);

    if (this.gameMode === GameMode.PvP) {
      this.actors = [ActorId.FIRST, ActorId.SECOND];
    }

    await this.setActors();
  }

  private async askForRetry(): Promise<void> {
    this.state = GameState.RETRY;

    if (await this.ui.confirmRetry()) {
      this.counter.reset();
      await this.start();
      return;
    }

    this.counter.reset();
    this.ui.destroy();
  }
}
