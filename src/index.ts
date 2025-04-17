import { GameController } from "./GameController";
import { ConsoleUI, Server } from "./ui";

switch (process.env.NODE_ENV) {
  case "server":
    new Server(GameController);
    break;

  default:
    new GameController(new ConsoleUI()).start();
}
