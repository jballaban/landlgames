import { Level } from "../../v1/Core/Level";
import { Viewport, FullscreenViewport } from "../../v1/Core/Viewport";
import { World } from "../../v1/Core/World";
import { PrimitiveModel } from "../../v1/Core/PrimitiveModel";
import { Circle } from "../../v1/Foundation/Circle";
import { Color } from "../../v1/Foundation/Color";
import { Vector3D, Vector2D } from "../../v1/Core/Vector";
import { FadeInComponent } from "../../v1/Component/FadeInComponent";
import { Person } from "./Entity/Person";

export class PlayLevel extends Level {

	private fullscreen: FullscreenViewport;

	constructor() {
		let viewport = new FullscreenViewport();
		super([viewport], new World(viewport.width, viewport.height));
		let thing = new PrimitiveModel(new Circle(10), new Color(255, 255, 255));
		thing.attributes.set("origin", new Vector2D(100, 100));
		thing.registerComponent(new FadeInComponent());
		let person = new Person(viewport);
		person.attributes.set("origin", new Vector2D(500, 500));
		this.world.registerEntity(person);
		this.world.registerEntity(thing);
		this.fullscreen = viewport;
	}

	public update(seconds: number): void {
		this.fullscreen.update(seconds);
		super.update(seconds);
	}

}