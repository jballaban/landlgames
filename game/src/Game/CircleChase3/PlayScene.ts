import { Scene } from "../../v1.1/Core/Scene";
import { Camera } from "../../v1.1/Core/Camera";
import { TransformComponent } from "../../v1.1/Components/TransformComponent";
import { Entity } from "../../v1.1/Core/Entity";
import { RenderComponent } from "../../v1.1/Components/RenderComponent";
import { Vector3D } from "../../v1.1/Core/Vector";
import { RectRenderComponent } from "../../v1.1/Components/RectRenderComponent";
import { LogRenderComponent } from "../../v1.1/Components/LogRenderComponent";

export class PlayScene extends Scene {
	constructor() {
		super();
		// panel
		let leftpanewidth = 200;
		// hud
		let hud = this.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(leftpanewidth, window.innerHeight, "rgba(100,100,255,0.5)"))
			.entity;

		// world
		let worldsize = window.innerHeight;
		let world = this.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(worldsize, worldsize, "rgba(100,200,100,0.5)"))
			.entity;
		for (let i = 0; i < 10; i++) {
			world.registerEntity(new Entity())
				.registerComponent(new RectRenderComponent(100, 100, "rgba(255,255,255,0.5)"))
				.entity.transform.origin = new Vector3D(Math.random() * (worldsize - 100), Math.random() * (worldsize - 100), 0);
		}
		let worldcamera = this.registerEntity(new Camera([world], window.innerWidth - leftpanewidth, window.innerHeight)) as Camera;
		worldcamera.transform.origin = new Vector3D(worldcamera.width / 2 + leftpanewidth, worldcamera.height / 2, 0);
		//	worldcamera.transform.scale = new Vector3D(1, 1, 1);
		// hud camera
		let hudcamera: Camera = this.registerEntity(new Camera([hud], window.innerWidth, window.innerHeight)) as Camera;
		hudcamera.transform.origin = new Vector3D(window.innerWidth / 2, window.innerHeight / 2, 0);
		//hudcamera.transform.scale = new Vector3D(1, 1, 1);
		// mini cam
		let cameraboxsize = 200;
		let camerabox = hud.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(cameraboxsize, cameraboxsize, "rgb(100,100,100)"))
			.entity;
		camerabox.transform.origin = new Vector3D(0, 100, 0);
		let minicamera: Camera = camerabox.registerEntity(new Camera([world], 100, 100)) as Camera;
		minicamera.transform.origin = new Vector3D(cameraboxsize / 2, cameraboxsize / 2, 0);
		minicamera.transform.scale = new Vector3D(minicamera.width / worldsize, minicamera.height / worldsize, 0);
	}
}