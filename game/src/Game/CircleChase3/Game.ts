import { PlayScene } from "./PlayScene";
import { Game as BaseGame } from "../../v1.1/Core/Game";

export class Game extends BaseGame {

	constructor() {
		super();
		this.nextScene = new PlayScene();
	}

}