import { Scene } from "./Scene";

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
			this.scene.fixedUpdate();
		}
	}

	public update(): void {
		if (this.scene != null) {
			this.scene.update();
		}
	}

	public changeScene(): void {
		if (this.nextScene != null) {
			if (this.scene != null) {
				this.scene.destroy();
			}
			this.scene = this.nextScene;
			this.nextScene = null;
		}
	}

	public render(): void {
		if (this.scene != null) {
			this.scene.render();
		}
	}


}