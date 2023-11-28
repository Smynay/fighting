import { ActorStatus, IActor } from "./interfaces";

export class Actor implements IActor {
  get health(): number {
    return this._health;
  }

  get stamina(): number {
    return this._stamina;
  }

  get selectedAction(): ActorStatus {
    return this._selectedAction;
  }

  get executedAction(): ActorStatus {
    return this._executedAction;
  }

  _health: number = 0;
  _stamina: number = 0;
  _selectedAction: ActorStatus = ActorStatus.IDLE;
  _executedAction: ActorStatus = ActorStatus.IDLE;

  set health(value) {
    this._health = value;
  }

  set stamina(value) {
    this._stamina = value;
  }

  set selectedAction(value) {
    this._selectedAction = value;
  }

  set executedAction(value) {
    this._executedAction = value;
  }

  constructor(health: number, stamina: number) {
    this._health = health;
    this._stamina = stamina;
  }
}
