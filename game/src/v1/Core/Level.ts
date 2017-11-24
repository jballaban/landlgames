import { World } from "./World";
import { Viewport } from "./Viewport";

export class Level {

	constructor(
		public viewports: Viewport[],
		public world: World
	) { }

	public update(): void {
		this.world.update();
		for (var i = 0; i < this.viewports.length; i++) {
			this.viewports[i].update();
		}
	}

	public draw(): void {
		for (let i = 0; i < this.viewports.length; i++) {
			this.viewports[i].draw(this.world.models);
		}
	}

	public destroy(): void {
		for (let i = 0; i < this.viewports.length; i++) {
			this.viewports[i].destroy();
		}
	}
}