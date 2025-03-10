import { ActorStatus, IActor } from "../../actor";
import { AIConfig, ConfigActions } from "./types";
import { ALLOWED_AI_MODES } from "./consts";
import { getRandomInt } from "../../utils";

export class AILogic {
  private readonly config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  getAction(actor: IActor): ActorStatus {
    const preparedConfigActions = this.prepareConfigActions(actor);
    const preparedActions = this.prepareActions(actor, preparedConfigActions);

    return this.getActionByChance(preparedActions);
  }
  private prepareConfigActions(actor: IActor): ConfigActions {
    const aiMode = ALLOWED_AI_MODES.find((key) => {
      return this.config[key].test ? this.config[key].test?.(actor) : true;
    });

    if (!aiMode) {
      throw new Error(
        `Check test functions in your configuration file of ${this.config.name}`,
      );
    }

    return this.config[aiMode].actions;
  }

  private prepareActions = (
    actor: IActor,
    configActions: ConfigActions,
  ): ConfigActions => {
    return configActions.filter((action) =>
      action.test ? action.test(actor) : true,
    );
  };

  private getActionByChance(actions: ConfigActions): ActorStatus {
    let booked = 0;

    const actionsWithChancesPeriods = actions.map((value) => {
      const start = booked;
      const end = booked + value.chance;
      booked = end + 1;

      return {
        ...value,
        start: start,
        end: end,
      };
    });

    const random = getRandomInt(booked - 1);

    const result = actionsWithChancesPeriods.find(
      (action) => action.start <= random && random <= action.end,
    );

    if (!result) {
      throw new Error(
        `Check actions chances in your configuration file of ${this.config.name}`,
      );
    }

    return result.action as ActorStatus;
  }
}
