import { Runtime } from "./Core/Runtime";
import { Logger, Level } from "./Util/logger";
import { Screen } from "./Core/Screen";
import { CircleScreen } from "./Game/CircleChase/CircleScreen";
import { LoadingScreen } from "./Screen/LoadingScreen";

export class Game {
	public static init(game: string, ver: string): void {
		Logger.level = Level.Debug;
		Logger.log("Game: Version " + ver);
		Logger.log("Game: Log " + Level[Logger.level]);
		Runtime.init();
		var screen: Screen;
		switch (game) {
			case "circlechase":
				screen = new CircleScreen();
				break;
			default:
				throw "Unknown game " + game;
		}
		var loadscreen: LoadingScreen = new LoadingScreen(screen);
		// Screen.debug_showRedraws = true;
		Runtime.nextScreen = loadscreen;
	}
}