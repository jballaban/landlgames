import { Scene } from "./Scene";
import { MouseHandler } from "./MouseHandler";
import { KeyboardHandler } from "./KeyboardHandler";

export class Game {
	public scene: Scene;
	public nextScene: Scene;

	public fixedUpdate(): void {
		if (this.scene != null) {
			this.scene.fixedUpdate();
		}
	}

	public lateUpdate(): void {
		if (this.scene != null) {
			this.scene.lateUpdate();
		}
	}

	public update(): void {
		if (this.scene != null) {
			MouseHandler.update();
			KeyboardHandler.update();
			this.scene.update();
			MouseHandler.cleanup();
		}
	}

	public changeScene(): void {
		if (this.nextScene != null) {
			if (this.scene != null) {
				this.scene.destroy();
			}
			this.scene = this.nextScene;
			this.nextScene = null;
			MouseHandler.reset();
		}
	}

	public render(): void {
		if (this.scene != null) {
			this.scene.render();
		}
	}


}