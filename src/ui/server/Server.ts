import { IUserInterface } from "../interfaces";
import WebSocket, { WebSocketServer } from "ws";
import {
  GameController,
  GameMode,
  IGameControllerConstructor,
  IGameInfo,
} from "../../GameController";

const LOOPTIME = 1000;
const SERVER_PORT = 3000;

enum EServerEvents {
  INIT = "fighting/init",
  CHOOSE_GAME_MODE = "fighting/chooseGameMode",
  CHOOSE_AI = "fighting/chooseAi",
  CREATE_ACTOR = "fighting/createActor",
  SHOW_STATS = "fighting/showStats",
  CHOOSE_ACTION = "fighting/chooseAction",
  SHOW_ACTION_RESULTS = "fighting/showActionResults",
  SHOW_ROUND_RESULTS = "fighting/showRoundResults",
  SHOW_MATCH_RESULTS = "fighting/showMatchResults",
  SHOW_GAME_RESULTS = "fighting/showGameResuts",
  CONFIRM_RETRY = "fighting/confirmRetry",
}

enum EServerRunCodes {
  INIT = "init",
  RUN = "run",
  PAUSE = "pause",
  STOP = "stop",
}

interface IMessage {
  type: EServerEvents;
  payload: IMessagePayload;
}

interface IMessagePayload {
  id: string;
}

export class Server implements IUserInterface {
  private server: WebSocketServer;
  private serverRunCode: EServerRunCodes = EServerRunCodes.INIT;
  private currentGameRequest: EServerEvents = EServerEvents.INIT;
  private callbackQueue: Record<string, ((arg: any) => void) | undefined> = {};
  private members = new Set<WebSocket>();
  private ids: Record<string, WebSocket | undefined> = {};
  private controller: GameController;
  private gameMode?: GameMode;

  constructor(private ControllerConstructor: IGameControllerConstructor) {
    this.controller = new ControllerConstructor(this);

    this.server = new WebSocketServer({ port: SERVER_PORT });

    this.server.on("connection", (ws) => {
      if (this.members.size >= 2) {
        ws.close();
      }

      const userId = this.members.size === 1 ? "1" : "0";

      for (let member of this.members) {
        // TODO: change impl of event
        member.send(JSON.stringify({ type: "newUser" }));
      }

      this.members.add(ws);
      this.ids[userId] = ws;

      ws.on("message", (data: Buffer) => {
        console.log(data.toString());
        const message: IMessage = JSON.parse(data.toString());
        console.log("message", message);

        if (!this.callbackQueue[userId]) {
          ws.send(JSON.stringify({ type: "error" }));
          return;
        }

        this.callbackQueue[userId]?.(message.payload);

        ws.send(JSON.stringify({ type: "ok" }));
        return;
      });

      ws.on("close", () => {
        this.serverRunCode = EServerRunCodes.STOP;
        this.members.delete(ws);
        this.ids[userId] = undefined;
      });

      if (this.members.size === 1) {
        this.run();
      }
    });

    console.log(`Server has been started on port ${SERVER_PORT}`);
  }

  private async run(): Promise<void> {
    let interval = setInterval(async () => {
      console.log("interval");

      if (this.serverRunCode === EServerRunCodes.RUN) {
        clearInterval(interval);
      }

      if (
        this.members.size === 1 &&
        this.serverRunCode === EServerRunCodes.INIT
      ) {
        this.serverRunCode = EServerRunCodes.PAUSE;

        this.gameMode = await this.runRequest<GameMode>(
          EServerEvents.CHOOSE_GAME_MODE,
          "0",
          { modes: { PvP: GameMode.PvP, PvE: GameMode.PvE } },
        );
        return;
      }

      if (this.gameMode === GameMode.PvE) {
        this.serverRunCode = EServerRunCodes.RUN;

        this.controller.start(this.gameMode);
        clearInterval(interval);
      }

      if (this.gameMode === GameMode.PvP && this.members.size === 2) {
        this.serverRunCode = EServerRunCodes.RUN;

        this.controller.start(this.gameMode);
        clearInterval(interval);
      }
    }, LOOPTIME);
  }

  private notify(event: EServerEvents, arg?: unknown, id?: string): void {
    const msg = JSON.stringify({ type: event, payload: arg });

    if (id) {
      this.ids[id]?.send(msg);
      return;
    }

    this.members.forEach((ws) => {
      ws.send(msg);
    });
  }

  private runRequest<T>(
    event: EServerEvents,
    id: string,
    arg?: unknown,
  ): Promise<T> {
    console.log("request", event);

    this.ids[id]?.send(JSON.stringify({ type: event, payload: arg }));

    return new Promise<T>((resolve) => {
      this.callbackQueue[id] = resolve;
    });
  }

  choseAction<T extends string>(options: T[], id: string): Promise<T> {
    this.currentGameRequest = EServerEvents.CHOOSE_ACTION;

    return this.runRequest(EServerEvents.CHOOSE_ACTION, id, {
      actions: options,
    });
  }

  chooseAi<T extends string>(availableAis: T[]): Promise<T | undefined> {
    this.currentGameRequest = EServerEvents.CHOOSE_AI;

    return this.runRequest(EServerEvents.CHOOSE_AI, "0", {
      options: availableAis,
    });
  }

  confirmRetry(): Promise<boolean> {
    this.currentGameRequest = EServerEvents.CONFIRM_RETRY;

    // TODO: check retry for MP
    return this.runRequest<boolean>(EServerEvents.CONFIRM_RETRY, "0");
  }

  createActor<T extends string>(options: T[], id: string): Promise<T> {
    console.log("createActor", id);

    this.currentGameRequest = EServerEvents.CREATE_ACTOR;

    // TODO: add frontend support
    return this.runRequest(EServerEvents.CREATE_ACTOR, id, {
      options,
    });
  }

  async chooseGameMode(availableModes: string[]): Promise<string | undefined> {
    return;
  }

  init(): void {
    this.notify(EServerEvents.INIT, { id: "0" }, "0");
    this.notify(EServerEvents.INIT, { id: "1" }, "1");
  }

  showStats(info: IGameInfo) {
    this.notify(EServerEvents.SHOW_STATS, { results: info });
  }

  showActionResults(info: IGameInfo): void {
    this.notify(EServerEvents.SHOW_ACTION_RESULTS, { results: info });
  }

  showMatchResults(info: IGameInfo): void {
    this.notify(EServerEvents.SHOW_MATCH_RESULTS, { results: info });
  }

  showRoundResults(info: IGameInfo): void {
    this.notify(EServerEvents.SHOW_ROUND_RESULTS, { results: info });
  }

  destroy() {
    console.log("destroy");
    this.members.forEach((member) => {
      member.close();
    });
  }
}
