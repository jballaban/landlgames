import { PlayScene } from "./PlayScene";
import { Game as BaseGame } from "../../v1.1/Core/Game";
import { PhysicsScene } from "./PhysicsScene";

export class Game extends BaseGame {

	constructor() {
		super();
		this.nextScene = new PhysicsScene();
	}

}