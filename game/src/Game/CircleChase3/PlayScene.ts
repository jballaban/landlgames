// tslint:disable:comment-format
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
import { Gradient, GradientType } from "../../v1.1/Textures/Gradient";
import { CircRenderComponent } from "../../v1.1/Components/CircRenderComponent";
import { PhysicsComponent } from "../../v1.1/Components/PhysicsComponent";
import { AlphaComponent } from "../../v1.1/Components/AlphaComponent";
import { ShadowComponent } from "../../v1.1/Components/ShadowComponent";
import { Logger } from "../../v1.1/Utils/Logger";
import { Cursor, MouseHandler, CursorState } from "../../v1.1/Core/MouseHandler";
import { ForcePhysicsComponent } from "../../v1.1/Components/ForcePhysicsComponent";

export class Mirror extends Camera {
	constructor(source: Entity, width: number, height: number) {
		super([source], width, height);
		this.transform.rotate.z = 180;
		this.transform.scale = new Vector3D(-1, 1, 0);
		this.registerEntity(new Entity()).registerComponent(new RectRenderComponent(this.width, this.height, new Gradient([
			{ percent: 0, color: new Color(0, 0, 0, 1) },
			{ percent: 90, color: new Color(0, 0, 0, 0) }
		], GradientType.TopToDown)))
			.entity.transform.origin = new Vector3D(-this.width / 2, -this.height / 2, 0);
	}
}

export class Hud extends Entity {
	constructor(leftpanewidth: number, mirrorpaneheight: number, world: World, worldCamera: WorldCamera) {
		super();
		this.registerComponent(new RectRenderComponent(leftpanewidth, window.innerHeight, new Gradient([
			{ percent: 0, color: new Color(10, 10, 255) },
			{ percent: 100, color: new Color(10, 10, 100) }
		])));
		let cameraboxsize: number = leftpanewidth * .8;
		let camerabox: Entity = this.registerEntity(new Entity())
			.registerComponent(new RectRenderComponent(cameraboxsize, cameraboxsize, new Color(200, 200, 200)))
			.entity;
		camerabox.transform.origin = new Vector3D(leftpanewidth * .1, 60, 0);
		let minicamera: Camera = camerabox.registerEntity(new Camera([world], cameraboxsize * .9, cameraboxsize * .9)) as Camera;
		minicamera.transform.origin = new Vector3D(minicamera.width / 2 + cameraboxsize * .05, minicamera.height / 2 + cameraboxsize * .05, 0);
		minicamera.transform.scale = new Vector3D(minicamera.width / world.width, minicamera.height / world.height, 0);
		minicamera.renderer.offset = new Vector3D(-minicamera.width / 2 + world.width / 2, -minicamera.height / 2 + world.height / 2, 0);
		let mirror: Camera = this.registerEntity(new Mirror(worldCamera, window.innerWidth - leftpanewidth, mirrorpaneheight));
		mirror.transform.origin = new Vector3D(mirror.width / 2 + leftpanewidth, window.innerHeight - mirror.height / 2, 0);
		mirror.renderer.offset = new Vector3D(leftpanewidth, worldCamera.height - mirrorpaneheight, 0);
	}
}

export class World extends Entity {

	constructor(public width: number, public height: number, particles: number) {
		super();
		this.registerComponent(new RectRenderComponent(width, height, new Gradient([
			{ percent: 0, color: new Color(10, 100, 10) },
			{ percent: 100, color: new Color(200, 200, 200) }
		])));
		for (let i: number = 0; i < particles; i++) {
			let entity: Entity =
				this.registerEntity(new Entity());
			entity.registerComponent(new PhysicsComponent(
				new Vector3D(Math.random() * 2 - 1, Math.random() * 2 - 1, 0),
				new Vector3D(0, 0, 0),
				new Vector3D(width, height, 0)
			));
			entity.registerComponent(new ShadowComponent());
			entity.registerComponent(new AlphaComponent(.5));
			entity.transform.origin = new Vector3D(i * (width / particles) + 25, i * (height / particles) + 25, 0);
			entity.registerEntity(new Entity())
				.registerComponent(new CircRenderComponent(25, new Gradient([
					{ percent: 0, color: Color.getRandom() },
					{ percent: 100, color: Color.getRandom() }
				])));
		}
	}
}

export class WorldCamera extends Camera {
	constructor(entities: Entity[], width: number, height: number) {
		super(entities, width, height);
		this.registerComponent(new ForcePhysicsComponent(0, .1, .01, new Vector3D(.1, .1, 0), this.transform.scale));
		this.registerEntity(new Entity())
			.registerComponent(new CircRenderComponent(Math.max(this.width, this.height),
				new Gradient(
					[{ percent: 50, color: new Color(0, 0, 0, 0) },
					{ percent: 60, color: new Color(0, 0, 0, 1) }],
					GradientType.MiddleToOutCircle)
			));
	}
}

export class PlayScene extends Scene {
	private world: World;
	private worldCamera: WorldCamera;
	private hud: Hud;
	private hudCamera: Camera;

	constructor() {
		super();
		let leftpanewidth: number = 200;
		let mirrorheight: number = 200;
		this.world = this.registerEntity(new World(2000, 2000, 100));
		this.worldCamera = this.registerEntity(new WorldCamera(
			[this.world],
			window.innerWidth - leftpanewidth,
			window.innerHeight - mirrorheight)
		);
		this.worldCamera.transform.origin = new Vector3D(
			this.worldCamera.width / 2 + leftpanewidth,
			this.worldCamera.height / 2,
			0
		);
		this.hud = this.registerEntity(new Hud(leftpanewidth, mirrorheight, this.world, this.worldCamera));
		this.hudCamera = this.registerEntity(new Camera([this.hud], window.innerWidth, window.innerHeight));
		this.hudCamera.transform.origin = new Vector3D(this.hudCamera.width / 2, this.hudCamera.height / 2, 0);
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
						if (cursors[i].wheelY !== 0) {
							let scale: number = cursors[i].wheelY / (150 * 50);
							let force: ForcePhysicsComponent = (cursors[i].data as Entity).getComponent<ForcePhysicsComponent>(ForcePhysicsComponent);
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