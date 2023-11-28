import { IActor } from "../actor";

export interface IAction {
  prepare(): void;
  execute(): void;
  end(): void;
}

export interface IActionConstructor {
  new (actor: IActor, target: IActor): IAction;
}

export interface IActionFactory {
  getActionBySelected(): IAction;
  getActionByExecuted(): IAction;
}
