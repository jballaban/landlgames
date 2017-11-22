import { Level } from "../../v1/Core/Level";
import { Viewport, FullscreenViewport } from "../../v1/Core/Viewport";
import { World } from "../../v1/Core/World";
import { PrimitiveModel } from "../../v1/Core/PrimitiveModel";
import { Circle } from "../../v1/Foundation/Circle";
import { Color } from "../../v1/Foundation/Color";
import { Vector, Vector2D } from "../../v1/Core/Vector";
import { FadeInComponent } from "../../v1/Component/FadeInComponent";

export class PlayLevel extends Level {

	private fullscreen: FullscreenViewport;

	constructor() {
		let viewport = new FullscreenViewport();
		super([viewport], new World(viewport.width, viewport.height));
		let thing = new PrimitiveModel(new Circle(10), new Color("rgb(255,255,255)"));
		thing.attributes.set("origin", new Vector2D(100, 100));
		thing.registerComponent(new FadeInComponent());
		this.world.registerEntity(thing);
		this.fullscreen = viewport;
	}

	public update(seconds: number): void {
		this.fullscreen.update(seconds);
		super.update(seconds);
	}

}