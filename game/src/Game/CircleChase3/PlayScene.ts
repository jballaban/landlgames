// tslint:disable:comment-format
import { Scene } from "../../v1.1/Core/Scene";
import { Camera } from "../../v1.1/Core/Camera";
import { TransformComponent } from "../../v1.1/Components/TransformComponent";
import { Entity } from "../../v1.1/Core/Entity";
import { RenderComponent } from "../../v1.1/Components/RenderComponent";
import { Vector3D } from "../../v1.1/Core/Vector";
import { LogRenderComponent } from "../../v1.1/Components/LogRenderComponent";
import { RotateComponent } from "../../v1.1/Components/RotateComponent";
import { Color } from "../../v1.1/Textures/Color";
import { Gradient, GradientType } from "../../v1.1/Textures/Gradient";
import { PhysicsComponent } from "../../v1.1/Components/PhysicsComponent";
import { ShadowComponent } from "../../v1.1/Components/ShadowComponent";
import { Logger } from "../../v1.1/Utils/Logger";
import { Cursor, MouseHandler, CursorState } from "../../v1.1/Core/MouseHandler";
import { KeyboardHandler } from "../../v1.1/Core/KeyboardHandler";
import { Physics } from "../../v0/Core/Physics";
import { AlphaComponent } from "../../v1.1/Components/AlphaComponent";
import { Circle, Rectangle } from "../../v1.1/Core/Shape";
import { ShapeRenderComponent } from "../../v1.1/Components/ShapeRenderComponent";

export class Mirror extends Camera {
	constructor(source: Entity, width: number, height: number) {
		super([source], width, height);
		this.transform.rotate.z = 180;
		this.transform.scale = new Vector3D(-1, 1, 0);
		this.registerEntity(new Entity()).registerComponent(new ShapeRenderComponent(new Rectangle(this.width, this.height), new Gradient([
			{ percent: 0, color: new Color(0, 0, 0, 1) },
			{ percent: 100, color: new Color(0, 0, 0, 0) }
		], GradientType.TopToDown)))
			.entity.transform.origin = new Vector3D(-this.width / 2, -this.height / 2, 0);
	}
}

export class Hud extends Entity {
	constructor(leftpanewidth: number, mirrorpaneheight: number, world: World, worldCamera: WorldCamera) {
		super();
		this.registerComponent(new ShapeRenderComponent(new Rectangle(leftpanewidth, window.innerHeight), new Gradient([
			{ percent: 0, color: new Color(10, 10, 255) },
			{ percent: 100, color: new Color(10, 10, 100) }
		])));
		let cameraboxsize: number = leftpanewidth * .8;
		let camerabox: Entity = this.registerEntity(new Entity())
			.registerComponent(new ShapeRenderComponent(new Rectangle(cameraboxsize, cameraboxsize), new Color(200, 200, 200)))
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
		let alpha: AlphaComponent = this.registerComponent(new AlphaComponent()) as AlphaComponent;
		alpha.alpha = 0.5;
		this.registerComponent(new ShapeRenderComponent(new Rectangle(width, height), new Gradient([
			{ percent: 0, color: new Color(10, 100, 10) },
			{ percent: 100, color: new Color(200, 200, 200) }
		])));
		for (let i: number = 0; i < particles; i++) {
			let entity: Entity =
				this.registerEntity(new Entity());
			let physics: PhysicsComponent = entity.registerComponent(new PhysicsComponent()) as PhysicsComponent;
			physics.force = new Vector3D(Math.random() * 2 - 1, Math.random() * 2 - 1, 0);
			physics.maxX = width;
			physics.maxY = height;
			entity.registerComponent(new ShadowComponent());
			entity.registerComponent(new RotateComponent(1));
			let radius = Math.random() * 25 + 25;
			entity.transform.origin = new Vector3D(i * (width / particles) + radius, i * (height / particles) + radius, 0);
			if (Math.random() > 0.5) {
				entity.registerEntity(new Entity())
					.registerComponent(new ShapeRenderComponent(new Circle(radius), new Gradient([
						{ percent: 0, color: Color.getRandom() },
						{ percent: 100, color: Color.getRandom() }
					])))
			} else {
				entity.registerEntity(new Entity())
					.registerComponent(new ShapeRenderComponent(new Rectangle(radius * 2, radius), new Gradient([
						{ percent: 0, color: Color.getRandom() },
						{ percent: 100, color: Color.getRandom() }
					])))
					.entity.transform.origin = new Vector3D(-radius * 2 / 2, -radius / 2, 0);
			}
		}
	}
}

export class WorldCamera extends Camera {
	constructor(entities: Entity[], width: number, height: number) {
		super(entities, width, height);
		//	this.registerComponent(new ForcePhysicsComponent(0, .1, .01, new Vector3D(.1, .1, 0), this.transform.scale));
		//this.registerEntity(new Entity())
		/* this.registerComponent(new CircRenderComponent(Math.max(this.width, this.height),
			new Gradient(
				[{ percent: 50, color: new Color(0, 0, 0, 0) },
				{ percent: 60, color: new Color(0, 0, 0, 1) }],
				GradientType.MiddleToOutCircle)
		)); */
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
		let mirrorheight: number = 100;
		this.world = this.root.registerEntity(new World(3000, 3000, 200));
		this.worldCamera = this.root.registerEntity(new WorldCamera(
			[this.world],
			window.innerWidth - leftpanewidth,
			window.innerHeight - mirrorheight)
		);
		this.worldCamera.transform.origin = new Vector3D(
			this.worldCamera.width / 2 + leftpanewidth,
			this.worldCamera.height / 2,
			0
		);
		this.hud = this.root.registerEntity(new Hud(leftpanewidth, mirrorheight, this.world, this.worldCamera));
		this.hudCamera = this.root.registerEntity(new Camera([this.hud], window.innerWidth, window.innerHeight));
		this.hudCamera.transform.origin = new Vector3D(this.hudCamera.width / 2, this.hudCamera.height / 2, 0);
	}

	public update(): void {
		if (KeyboardHandler.state.down.has("q")) {
			this.worldCamera.transform.rotate.add(new Vector3D(0, 0, 1));
		}
		if (KeyboardHandler.state.down.has("e")) {
			this.worldCamera.transform.rotate.add(new Vector3D(0, 0, -1));
		}
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
						cursors[i].data.renderer.offset.add(
							cursors[i].data.transform.project(new Vector3D(cursors[i].diffX, cursors[i].diffY, 0))
						);
						if (cursors[i].wheelY !== 0) {
							//	let scale: number = cursors[i].wheelY / (150 * 50);
							//	let force: ForcePhysicsComponent = (cursors[i].data as Entity).getComponent<ForcePhysicsComponent>(ForcePhysicsComponent);
							//	force.velocity.addScalars(scale, scale, 0);
							//	force.active = true;
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