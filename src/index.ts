import { GameController } from "./GameController";
import { ConsoleUI } from "./ui";

const ui = new ConsoleUI();

new GameController(ui).start();
