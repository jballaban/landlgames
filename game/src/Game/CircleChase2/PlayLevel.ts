import { Level } from "../../v1/Core/Level";
import { Viewport, FullscreenViewport } from "../../v1/Core/Viewport";
import { World } from "../../v1/Core/World";
import { PrimitiveModel } from "../../v1/Core/PrimitiveModel";
import { Circle } from "../../v1/Foundation/Circle";
import { Color } from "../../v1/Foundation/Color";
import { Vector } from "../../v1/Core/Vector";

export class PlayLevel extends Level {

	private fullscreen: FullscreenViewport;

	constructor() {
		let viewport = new FullscreenViewport();
		super([viewport], new World(viewport.width, viewport.height));
		let thing = new PrimitiveModel(new Circle(10), new Color("rgb(255,255,255)"));
		thing.origin = new Vector(100, 100, 0);
		this.world.registerEntity(thing);
		this.world.alpha = 0;
		this.fullscreen = viewport;
	}

	public update(seconds: number): void {
		this.fullscreen.update(seconds);
		super.update(seconds);
		this.world.alpha += 0.01;
		if (this.world.alpha >= 1) {
			this.world.alpha = 0;
		}
	}

}