import { Scene } from "../../v1.1/Core/Scene";
import { Camera } from "../../v1.1/Core/Camera";
import { TransformComponent } from "../../v1.1/Components/TransformComponent";
import { Entity } from "../../v1.1/Core/Entity";
import { RenderComponent } from "../../v1.1/Components/RenderComponent";
import { Vector3D } from "../../v1.1/Core/Vector";
import { RectRenderComponent } from "../../v1.1/Components/RectRenderComponent";
import { LogRenderComponent } from "../../v1.1/Components/LogRenderComponent";
import { RotateComponent } from "../../v1.1/Components/RotateComponent";
import { Color } from "../../v1.1/Textures/Color";
import { Gradient } from "../../v1.1/Textures/Gradient";

export class PlayScene extends Scene {
	constructor() {
		super();
		// panel
		let leftpanewidth = 200;
		// hud
		let hud = this.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(leftpanewidth, window.innerHeight / 2, new Gradient([
				{ percent: 0, color: new Color(10, 10, 255) },
				{ percent: 100, color: new Color(10, 10, 100) }
			])))
			.entity;

		// world
		let worldsize = window.innerWidth;
		let world = this.registerEntity(new Entity())
		let objects = world.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(worldsize, worldsize, new Gradient([
				{ percent: 0, color: new Color(10, 100, 10) },
				{ percent: 100, color: new Color(0, 0, 0) }
			])))
			.entity;
		for (let i = 0; i < 10; i++) {
			let entity =
				objects.registerEntity(new Entity())
					.registerComponent(new RotateComponent())
					.entity;
			entity.transform.origin = new Vector3D(i * (worldsize / 10) + 25, i * (worldsize / 10) + 25, 0);
			entity.registerEntity(new Entity())
				.registerComponent(new RectRenderComponent(50, 50, Color.getRandom()))
				.entity.transform.origin = new Vector3D(-25, -25, 0);
		}
		let mirror: Camera = world.registerEntity<Camera>(new Camera([objects], worldsize, 300));
		mirror.transform.origin = new Vector3D(worldsize / 2, worldsize + 150, 0);
		//	mirror.renderer.offset.y += worldsize - 300;
		//mirror.transform.rotate.z = 180;
		mirror.transform.scale = new Vector3D(-1, 1, 0);
		let worldcamera: Camera = this.registerEntity<Camera>(new Camera([world], window.innerWidth - leftpanewidth, window.innerHeight))
		//	.registerComponent(new RotateComponent())
		//	.entity as Camera;
		//	worldcamera.renderer.offset = new Vector3D(400, 100, 0);
		worldcamera.transform.origin = new Vector3D(worldcamera.width / 2 + leftpanewidth, worldcamera.height / 2, 0);
		worldcamera.transform.scale = new Vector3D(.3, .3, 1);
		//	worldcamera.transform.rotate.z = 90;
		// hud camera
		//	let hudcamera: Camera = this.registerEntity(new Camera([hud], window.innerWidth, window.innerHeight)) as Camera;
		//	hudcamera.transform.origin = new Vector3D(window.innerWidth / 2, window.innerHeight / 2, 0);
		//hudcamera.transform.scale = new Vector3D(1, 1, 1);
		// mini cam
		let cameraboxsize = 200;
		let camerabox = hud.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(cameraboxsize, cameraboxsize, new Color(200, 200, 200)))
			.entity;
		camerabox.transform.origin = new Vector3D(0, 100, 0);
		let minicamera: Camera = camerabox.registerEntity(new Camera([world], cameraboxsize * .9, cameraboxsize * .9)) as Camera;
		minicamera.transform.origin = new Vector3D(cameraboxsize / 2, cameraboxsize / 2, 0);
		minicamera.transform.scale = new Vector3D(minicamera.width / worldsize, minicamera.height / worldsize, 0);
		minicamera.registerComponent(new RotateComponent())
	}
}