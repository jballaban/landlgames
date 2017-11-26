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
		this.world = new World(1024 * 10, 768 * 10, this);
		let camera: Camera = new Camera();
		let dot: PrimitiveModel = new PrimitiveModel(new Circle(10), new Color(255, 55, 55));
		camera.registerEntity(dot);
		let mask: PrimitiveModel = new PrimitiveModel(new Rectangle(-viewport.width / 2, -viewport.height / 2, viewport.width, 10), new Color(20, 199, 0));
		camera.registerEntity(mask);
		camera.origin = new Vector3D(this.world.width / 2, this.world.height / 2, 0);
		camera.cameraScale = .1;//viewport.height / this.world.height;
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
		let thing: PrimitiveModel = new PrimitiveModel(new Rectangle(0, 0, this.world.width, this.world.height), new Color(10, 23, 2));
		thing.registerComponent(new FadeInComponent());
		this.world.registerEntity(thing);
		for (let i: number = 0; i < 10; i++) {
			let scale: number = 1;
			let person: Person = new Person(
				25,
				150,
				Math.random(),
				new Vector3D(Math.random() * this.world.width, Math.random() * this.world.height + 150, 1 + i),
				this.world
			);
			person.scale = scale;
			this.world.registerEntity(person);
		}
		this.world.registerEntity(camera);
	}

}