import { Scene } from "./Scene";
import { Model } from "./Model";
import { IFrameStart, IPreUpdate, IPostUpdate, IUpdate, Entity } from "./Entity";

export class Game {
	public scene: Scene;
	public nextScene: Scene;

	public frame(): void {
		if (this.scene != null) {
			this.scene.frame();
		}
	}

	public update(): void {
		if (this.nextScene != null) {
			if (this.scene != null) {
				this.scene.destroy();
			}
			this.scene = this.nextScene;
			this.nextScene = null;
		}
		if (this.scene != null) {
			this.scene.update();
		}
	}

	public draw(): void {
		if (this.scene != null) {
			this.scene.draw();
		}
	}


}