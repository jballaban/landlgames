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
import { CircRenderComponent } from "../../v1.1/Components/CircRenderComponent";
import { PhysicsComponent } from "../../v1.1/Components/PhysicsComponent";
import { AlphaComponent } from "../../v1.1/Components/AlphaComponent";
import { ShadowComponent } from "../../v1.1/Components/ShadowComponent";
import { Logger } from "../../v1.1/Utils/Logger";
import { Cursor, MouseHandler, CursorState } from "../../v1.1/Core/MouseHandler";
import { ForcePhysicsComponent } from "../../v1.1/Components/ForcePhysicsComponent";

export class PlayScene extends Scene {
	private world: Entity;
	private worldCamera: Camera;

	constructor() {
		super();
		// panel
		let leftpanewidth = 200;
		// hud
		let hud = this.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(leftpanewidth, window.innerHeight, new Gradient([
				{ percent: 0, color: new Color(10, 10, 255) },
				{ percent: 100, color: new Color(10, 10, 100) }
			])))
			.entity;
		//	hud.transform.origin = new Vector3D(leftpanewidth / 2, window.innerHeight / 4, 0);

		// world
		let worldsize = 2000;
		this.world = this.registerEntity(new Entity())
		let objects = this.world.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(worldsize, worldsize / 2, new Gradient([
				{ percent: 0, color: new Color(10, 100, 10) },
				{ percent: 100, color: new Color(200, 200, 200) }
			])))
			.entity;
		let count: number = 1000;
		for (let i = 0; i < count; i++) {
			let entity =
				objects.registerEntity(new Entity())
			//.registerComponent(new LogRenderComponent(i.toString()))
			//	.registerComponent(new RotateComponent())
			//.entity;
			entity.registerComponent(new PhysicsComponent(
				new Vector3D(Math.random() * 2 - 1, Math.random() * 2 - 1, 0),
				new Vector3D(0, 0, 0),
				new Vector3D(worldsize, worldsize / 2, 0)
			))
			entity.registerComponent(new ShadowComponent());
			entity.registerComponent(new AlphaComponent(.5));
			entity.transform.origin = new Vector3D(i * ((worldsize / 2) / count) + 25, i * ((worldsize / 2) / count) + 25, 0);
			entity.registerEntity(new Entity())
				.registerComponent(new CircRenderComponent(25, new Gradient([
					{ percent: 0, color: Color.getRandom() },
					{ percent: 100, color: Color.getRandom() }
				])))

			//.entity.transform.origin = new Vector3D(-25, -25, 0);
		}
		let mirror: Camera = this.world.registerEntity<Camera>(new Camera([objects], worldsize, worldsize / 2))
			.registerComponent(new CircRenderComponent(10, new Color(255, 0, 0)))
			.entity as Camera;
		mirror.transform.origin = new Vector3D(mirror.width / 2, worldsize - mirror.height / 2, 0);
		//mirror.registerComponent(new RotateComponent(.2));
		//	mirror.renderer.offset.y += worldsize - 300;
		mirror.transform.rotate.z = 180;
		mirror.transform.scale = new Vector3D(-1, 1, 0);
		this.worldCamera = this.registerEntity<Camera>(new Camera([this.world], window.innerWidth - leftpanewidth, window.innerHeight));
		//this.worldCamera.registerComponent(new RotateComponent(.2));
		//	worldcamera.renderer.offset = new Vector3D(200, 0, 0);
		this.worldCamera.transform.origin = new Vector3D(this.worldCamera.width / 2 + leftpanewidth, this.worldCamera.height / 2, 0);
		this.worldCamera.transform.scale = new Vector3D(1, 1, 1);
		this.worldCamera.registerComponent(new ForcePhysicsComponent(0, .1, .01, new Vector3D(.1, .1, 0), this.worldCamera.transform.scale))
		//	this.worldCamera.registerComponent(new BounceComponent(.001, new Vector3D(.1, .1, 0)))
		this.worldCamera.registerEntity(new Entity())
			.registerComponent(new CircRenderComponent(10, new Color(255, 0, 0)))
		//	worldcamera.transform.rotate.z = 90;
		// hud camera
		let hudcamera: Camera = this.registerEntity(new Camera([hud], window.innerWidth, window.innerHeight)) as Camera;
		hudcamera.transform.origin = new Vector3D(window.innerWidth / 2, window.innerHeight / 2, 0);
		//hudcamera.transform.scale = new Vector3D(1, 1, 1);
		// mini cam
		let cameraboxsize = leftpanewidth * .8;
		//Logger.log("camerabox: " + cameraboxsize);
		let camerabox = hud.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(cameraboxsize, cameraboxsize, new Color(200, 200, 200)))
			.entity;
		//camerabox.registerComponent(new LogRenderComponent(function () { return camerabox.getComponent<RectRenderComponent>(RectRenderComponent).width; }))
		camerabox.transform.origin = new Vector3D(leftpanewidth * .1, 60, 0);
		let minicamera: Camera = camerabox.registerEntity(new Camera([this.world], cameraboxsize * .9, cameraboxsize * .9)) as Camera;
		minicamera.transform.origin = new Vector3D(minicamera.width / 2 + cameraboxsize * .05, minicamera.height / 2 + cameraboxsize * .05, 0);
		minicamera.transform.scale = new Vector3D(minicamera.width / worldsize, minicamera.height / worldsize, 0);
		minicamera.registerComponent(new CircRenderComponent(10, new Color(255, 0, 0)))
		minicamera.renderer.offset = new Vector3D(-minicamera.width / 2 + worldsize / 2, -minicamera.height / 2 + worldsize / 2, 0);
		//	minicamera.registerComponent(new RotateComponent())
	}

	public update(): void {
		let cursors: Cursor[] = Array.from(MouseHandler.cursors.values());
		for (var i: number = 0; i < cursors.length; i++) {
			switch (cursors[i].state) {
				case CursorState.added:
					/* let cursor: Entity = this.world.registerEntity(new Entity())
						.registerComponent(new CircRenderComponent(20, new Color(255, 255, 255)))
						.entity;
					cursor.transform.origin = new Vector3D(cursors[i].x, cursors[i].y, 0); */
					cursors[i].data = this.worldCamera;
					break;
				case CursorState.moved:
					if (cursors[i].data instanceof Camera) {
						(cursors[i].data as Camera).renderer.offset = new Vector3D(cursors[i].x, cursors[i].y, 0);
						if (cursors[i].wheelY != 0) {
							let scale: number = cursors[i].wheelY / (150 * 50);
							let force = (cursors[i].data as Entity).getComponent<ForcePhysicsComponent>(ForcePhysicsComponent);
							force.velocity.addScalars(scale, scale, 0);
							force.active = true;
						}
					} else {
						(cursors[i].data as Entity).transform.origin = new Vector3D(cursors[i].x, cursors[i].y, 0);
					}
					/* var x: number = Math.max(0, Math.min(this.camera.area.x2(), this.container.area.x2(), cursors[i].x));
					var y: number = Math.max(0, Math.min(this.camera.area.y2(), this.container.area.y2(), cursors[i].y));
					if (x !== cursors[i].x || y !== cursors[i].y) {
						MouseHandler.inc(cursors[i].id, x - cursors[i].x, y - cursors[i].y);
					}
					cursors[i].data.move("render", x, y);
					cursors[i].data.move("collision", x, y); */
					break;
				case CursorState.remove:
					/* 	this.container.deregister(cursors[i].data); */
					break;
			}
		}
	}
}