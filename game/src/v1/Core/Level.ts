import { World } from "./World";
import { Viewport } from "./Viewport";
import { IUpdate, IPostUpdate, Entity } from "./Entity";
import { Model } from "./Model";

export class Level {

	constructor(
		public viewports: Viewport[],
		public world: World
	) { }

	public update(): void {
		this.world.update();
		for (let i: number = 0; i < this.viewports.length; i++) {
			this.viewports[i].update();
		}
	}

	public draw(): void {
		for (let i: number = 0; i < this.viewports.length; i++) {
			this.viewports[i].draw(this.world.getVisible(this.viewports[i]));
		}
	}

	public destroy(): void {
		for (let i: number = 0; i < this.viewports.length; i++) {
			this.viewports[i].destroy();
		}
	}


}