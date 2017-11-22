import { Game as BaseGame } from "../../v1/Core/Game";
import { PlayLevel } from "./PlayLevel";

export class Game extends BaseGame {

	constructor() {
		super();
		this.nextLevel = new PlayLevel();
	}

}