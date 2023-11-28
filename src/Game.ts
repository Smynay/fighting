import { Actor, ActorStatus, IActor } from "./actor";
import { ActionCalculator, RoundBreakCalculator } from "./calculators";

function getRandomInt(max: number) {
  return Math.round(Math.random() * max);
}

const ACTIONS_FOR_AI = [
  ActorStatus.ATTACK,
  ActorStatus.BLOCK,
  ActorStatus.REST,
];

export interface IGameInfo {
  round: number;
  action: number;
  player: IActor;
  opponent: IActor;
}

export class Game {
  private round: number = 1;
  private action: number = 1;
  private opponent: IActor;

  static gameActions = [
    ActorStatus.ATTACK,
    ActorStatus.BLOCK,
    ActorStatus.REST,
  ];

  get isActionReady(): boolean {
    return (
      this.actor.selectedAction !== ActorStatus.IDLE &&
      this.opponent.selectedAction !== ActorStatus.IDLE
    );
  }

  get isGameEnd(): boolean {
    return this.opponent.health <= 0 || this.actor.health <= 0;
  }

  get info(): IGameInfo {
    return {
      round: this.round,
      action: this.action,
      player: this.actor,
      opponent: this.opponent,
    };
  }
  constructor(private actor: IActor) {
    this.opponent = new Actor(3, 3);
  }

  setAction(action: ActorStatus) {
    this.actor.selectedAction = action;
  }

  getRandomOpponentAction() {
    this.opponent.selectedAction = ACTIONS_FOR_AI[getRandomInt(2)];
  }

  executeAction() {
    this.action += 1;

    this.getRandomOpponentAction();

    new ActionCalculator().execute(this.actor, this.opponent);
  }

  roundBreak() {
    this.round++;

    new RoundBreakCalculator().execute(this.actor, this.opponent);
  }
}
