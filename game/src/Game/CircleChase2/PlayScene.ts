import { Viewport, FullscreenViewport } from "../../v1/Core/Viewport";
import { World } from "../../v1/Core/World";
import { PrimitiveModel } from "../../v1/Core/PrimitiveModel";
import { Circle } from "../../v1/Foundation/Circle";
import { Color } from "../../v1/Foundation/Color";
import { Vector3D } from "../../v1/Core/Vector";
import { FadeInComponent } from "../../v1/Component/FadeInComponent";
import { Person } from "./Entity/Person";
import { ImageModel } from "../../v1/Core/ImageModel";
import { Camera } from "../../v1/Core/Camera";
import { Game } from "./Game";
import { Scene } from "../../v1/Core/Scene";
import { Rectangle } from "../../v1/Foundation/Rectangle";

export class PlayScene extends Scene {

	private world: World;

	constructor() {
		let viewport: Viewport = new FullscreenViewport();
		super([viewport]);
		this.world = new World(viewport.width, viewport.height, this);
		let camera: Camera = new Camera();
		let topmask: PrimitiveModel = new PrimitiveModel(new Rectangle(0, 0, viewport.width, 10), new Color(255, 55, 55));
		topmask.origin = new Vector3D(0, 0, 1000);
		camera.registerEntity(topmask);
		camera.origin = new Vector3D(viewport.width / 2, viewport.height / 2, 0);
		this.world.registerEntity(camera);
		viewport.camera = camera;
		let background: ImageModel = new ImageModel("blackhole.png", 1024, 768);
		let scale: number = 2;
		background.origin =
			new Vector3D(
				viewport.width / 2 - (1024 * scale) / 2,
				viewport.height / 2 - (768 * scale) / 2,
				0
			);
		background.scale = scale;
		//this.world.registerEntity(background);
		let thing: PrimitiveModel = new PrimitiveModel(new Circle(10), new Color(255, 255, 255));
		thing.origin = new Vector3D(100, 100, 100);
		thing.registerComponent(new FadeInComponent());
		for (let i: number = 0; i < 10; i++) {
			let scale: number = 1;
			let person: Person = new Person(
				25,
				150,
				Math.random(),
				new Vector3D(Math.random() * viewport.width, Math.random() * viewport.height + 150, 1 + i),
				viewport
			);
			person.scale = scale;
			this.world.registerEntity(person);
		}
		this.world.registerEntity(thing);
	}

}