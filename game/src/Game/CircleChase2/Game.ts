import { Game as BaseGame } from "../../v1/Core/Game";
import { PlayScene } from "./PlayScene";

export class Game extends BaseGame {

	constructor() {
		super();
		this.nextScene = new PlayScene();
	}

}