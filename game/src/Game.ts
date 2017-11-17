import { Runtime } from "./Core/Runtime";
import { Logger, Level } from "./Util/logger";
import { Screen } from "./Core/Screen";
import { CircleScreen } from "./Game/CircleChase/CircleScreen";
import { LoadingScreen } from "./Screen/LoadingScreen";

export interface IGameOptions {
	version: string;
	debug: boolean;
	showRedraw: boolean;
	compiled: Date;
}

export class Game {
	public static init(game: string, options: IGameOptions): void {
		if (options.debug) {
			Logger.level = Level.Debug;
		}
		if (options.showRedraw) {
			Screen.debug_showRedraws = true;
		}
		var diff: number = (new Date()).valueOf() - (new Date(options.compiled)).valueOf();
		Logger.log("Compiled " + "Compiled " + Math.floor(diff / 1000) + " seconds ago");
		Logger.log("Game: Version " + options.version);
		Logger.log("Game: Log " + Level[Logger.level]);
		Runtime.init(options.debug);
		var screen: Screen;
		switch (game) {
			case "circlechase":
				screen = new CircleScreen();
				break;
			default:
				throw "Unknown game " + game;
		}
		var loadscreen: LoadingScreen = new LoadingScreen(screen);
		Runtime.nextScreen = loadscreen;
	}
}