import { Level } from "../../v1/Core/Level";
import { Viewport, FullscreenViewport } from "../../v1/Core/Viewport";
import { World } from "../../v1/Core/World";
import { PrimitiveModel } from "../../v1/Core/PrimitiveModel";
import { Circle } from "../../v1/Foundation/Circle";
import { Color } from "../../v1/Foundation/Color";
import { Vector3D, Vector2D } from "../../v1/Core/Vector";
import { FadeInComponent } from "../../v1/Component/FadeInComponent";
import { Person } from "./Entity/Person";
import { ImageModel } from "../../v1/Core/ImageModel";

export class PlayLevel extends Level {

	constructor() {
		let viewport = new FullscreenViewport();
		super([viewport], new World(viewport.width, viewport.height));
		let background = new ImageModel("blackhole.png", 1024, 768);
		let scale = 2;
		background.attributes.set("origin", new Vector2D(viewport.width / 2 - (1024 * scale) / 2, viewport.height / 2 - (768 * scale) / 2));
		background.attributes.set("scale", scale);
		this.world.registerEntity(background);
		let thing = new PrimitiveModel(new Circle(10), new Color(255, 255, 255));
		thing.attributes.set("origin", new Vector2D(100, 100));
		thing.registerComponent(new FadeInComponent());
		for (let i = 0; i < 10; i++) {
			let scale = Math.random() * 3;
			let person = new Person(25, 150, Math.random(), new Vector2D(Math.random() * viewport.width, Math.random() * viewport.height + 150), viewport);
			person.attributes.set("scale", scale);
			this.world.registerEntity(person);
		}
		this.world.registerEntity(thing);
	}

}