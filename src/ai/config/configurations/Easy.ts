import { ActorStatus } from "../../../actor";
import { AttackAction, BlockAction, DodgeAction } from "../../../actions";
import { AIConfig, AIMode, ConfigActions } from "../types";

const convincedActions: ConfigActions = [
  {
    action: ActorStatus.ATTACK,
    chance: 60,
    test: (actor) => actor.stamina >= AttackAction.STAMINA_COST,
  },
  {
    action: ActorStatus.DODGE,
    chance: 10,
    test: (actor) => actor.stamina >= DodgeAction.STAMINA_COST,
  },
  { action: ActorStatus.REST, chance: 20 },
  { action: ActorStatus.IDLE, chance: 10 },
];

const scaredActions: ConfigActions = [
  { action: ActorStatus.REST, chance: 30 },
  {
    action: ActorStatus.DODGE,
    chance: 50,
    test: (actor) => actor.stamina >= DodgeAction.STAMINA_COST,
  },
  {
    action: ActorStatus.BLOCK,
    chance: 10,
    test: (actor) => actor.stamina >= BlockAction.STAMINA_COST,
  },
  { action: ActorStatus.IDLE, chance: 10 },
];

const normalActions: ConfigActions = [
  {
    action: ActorStatus.ATTACK,
    chance: 30,
    test: (actor) => actor.stamina >= AttackAction.STAMINA_COST,
  },
  {
    action: ActorStatus.DODGE,
    chance: 20,
    test: (actor) => actor.stamina > DodgeAction.STAMINA_COST,
  },
  {
    action: ActorStatus.BLOCK,
    chance: 20,
    test: (actor) => actor.stamina > BlockAction.STAMINA_COST,
  },
  { action: ActorStatus.REST, chance: 20 },
  { action: ActorStatus.IDLE, chance: 10 },
];

export const easyConfig: AIConfig = {
  name: "easyConfig",
  modes: {
    [AIMode.CONVINCED]: {
      test: (actor) => actor.health > 2 && actor.stamina > 2,
      actions: convincedActions,
    },
    [AIMode.SCARED]: {
      test: (actor) => actor.health < 2 && actor.stamina <= 2,
      actions: scaredActions,
    },
    [AIMode.DEFAULT]: {
      actions: normalActions,
    },
  },
};
