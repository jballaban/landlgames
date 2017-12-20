// tslint:disable:comment-format
import { Scene } from "../../v1.1/Core/Scene";
import { Camera } from "../../v1.1/Core/Camera";
import { TransformComponent } from "../../v1.1/Components/TransformComponent";
import { Entity } from "../../v1.1/Core/Entity";
import { RenderComponent } from "../../v1.1/Components/RenderComponent";
import { Vector2D } from "../../v1.1/Core/Vector";
import { LogRenderComponent } from "../../v1.1/Components/LogRenderComponent";
import { RotateComponent } from "../../v1.1/Components/RotateComponent";
import { Color } from "../../v1.1/Textures/Color";
import { Gradient, GradientType } from "../../v1.1/Textures/Gradient";
import { PhysicsComponent } from "../../v1.1/Components/PhysicsComponent";
import { ShadowComponent } from "../../v1.1/Components/ShadowComponent";
import { Logger } from "../../v1.1/Utils/Logger";
import { Cursor, MouseHandler, CursorState, ButtonState } from "../../v1.1/Core/MouseHandler";
import { KeyboardHandler } from "../../v1.1/Core/KeyboardHandler";
import { Physics } from "../../v0/Core/Physics";
import { AlphaComponent } from "../../v1.1/Components/AlphaComponent";
import { Circle, Rectangle, Shape } from "../../v1.1/Core/Shape";
import { ShapeRenderComponent } from "../../v1.1/Components/ShapeRenderComponent";
import { PhysicsEngine } from "../../v1.1/Core/Physics/PhysicsEngine";
import { ImpulseMath } from "../../v1.1/Core/Physics/ImpulseMath";
import { PhysicalCircle } from "../../v1.1/Core/Physics/PhysicalShape";
import { Body } from "../../v1.1/Core/Physics/Body";
import { PhysicalPolygon } from "../../v1.1/Core/Physics/PhysicalPolygon";

export class Mirror extends Camera {
	constructor(source: Entity, width: number, height: number) {
		super([source], width, height);
		this.transform.rotate = 180;
		this.transform.scale = new Vector2D(-1, 1);
		this.registerEntity(new Entity())
			.registerComponent(new ShapeRenderComponent(new Rectangle(this.width, this.height), new Gradient([
				{ percent: 0, color: new Color(0, 0, 0, 1) },
				{ percent: 100, color: new Color(0, 0, 0, 0) }
			], GradientType.TopToDown)))
			.entity.transform.origin = new Vector2D(-this.width / 2, -this.height / 2);
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
		camerabox.transform.origin = new Vector2D(leftpanewidth * .1, 60);
		let minicamera: Camera = camerabox.registerEntity(
			new Camera([world], cameraboxsize * .9, cameraboxsize * .9)
		) as Camera;
		minicamera.transform.origin =
			new Vector2D(minicamera.width / 2 + cameraboxsize * .05, minicamera.height / 2 + cameraboxsize * .05);
		minicamera.transform.scale = new Vector2D(minicamera.width / world.width, minicamera.height / world.height);
		minicamera.renderer.offset =
			new Vector2D(-minicamera.width / 2 + world.width / 2, -minicamera.height / 2 + world.height / 2);
		let mirror: Camera = this.registerEntity(
			new Mirror(worldCamera, window.innerWidth - leftpanewidth, mirrorpaneheight)
		);
		mirror.transform.origin = new Vector2D(mirror.width / 2 + leftpanewidth, window.innerHeight - mirror.height / 2);
		mirror.renderer.offset = new Vector2D(leftpanewidth, worldCamera.height - mirrorpaneheight);
	}
}

export class World extends Entity {

	constructor(public width: number, public height: number, particles: number) {
		super();
		this.registerComponent(new ShadowComponent());
		this.registerEntity(new Entity())
			//.registerComponent(new ShadowComponent({ color: new Color(15, 150, 15), depth: 100 }))
			//.entity
			.registerComponent(new ShapeRenderComponent(new Rectangle(width, height), new Gradient([
				{ percent: 0, color: new Color(10, 100, 10) },
				{ percent: 100, color: new Color(200, 200, 200) }
			])));
		for (let i: number = 0; i < particles; i++) {
			let entity: Entity =
				this.registerEntity(new Entity())
					.registerComponent(new AlphaComponent({ alpha: 0.5 }))
					.entity;
			let radius: number = Math.random() * 25 + 25;
			let shape: Shape = Math.random() >= 0 ? new Circle(radius) : new Rectangle(radius * 2, radius);
			entity.registerComponent(
				new PhysicsComponent(shape, {
					maxX: width,
					maxY: height,
					force: new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1)
				}));

			entity.registerComponent(new RotateComponent(1));

			entity.transform.origin = new Vector2D(i * (width / particles) + radius, i * (height / particles) + radius);

			let renderEntity: Entity = entity.registerEntity(new Entity())
				.registerComponent(new ShapeRenderComponent(shape, new Gradient([
					{ percent: 0, color: Color.getRandom() },
					{ percent: 100, color: Color.getRandom() }
				]))).entity;
			if (shape instanceof Rectangle) {
				renderEntity.transform.origin = new Vector2D(-radius * 2 / 2, -radius / 2);
			}
		}
	}
}

export class WorldCamera extends Camera {
	constructor(entities: Entity[], width: number, height: number) {
		super(entities, width, height);
	}
}

export class PlayScene extends Scene {
	private world: World;
	private worldCamera: WorldCamera;
	private hud: Hud;
	private hudCamera: Camera;
	private physics: PhysicsEngine;

	constructor() {
		super();
		let leftpanewidth: number = 200;
		let mirrorheight: number = 100;
		this.world = this.root.registerEntity(new World(3000, 3000, 200));
		this.worldCamera = this.root.registerEntity(new WorldCamera(
			[],
			window.innerWidth - leftpanewidth,
			window.innerHeight - mirrorheight)
		);
		this.worldCamera.transform.origin = new Vector2D(
			this.worldCamera.width / 2 + leftpanewidth,
			this.worldCamera.height / 2
		);
		this.hud = this.root.registerEntity(new Hud(leftpanewidth, mirrorheight, this.world, this.worldCamera));
		this.hudCamera = this.root.registerEntity(new Camera([this.hud], window.innerWidth, window.innerHeight));
		this.hudCamera.transform.origin = new Vector2D(this.hudCamera.width / 2, this.hudCamera.height / 2);
		this.physics = new PhysicsEngine(ImpulseMath.DT, 10);
		/* // floor
		for (let w: number = 0 + 25; w < window.innerWidth; w += 300) {
			let c: PhysicalCircle = new PhysicalCircle(50);
			c.color = new Color(0, 0, 255).toString();
			let b: Body = this.physics.add(c, w, window.innerHeight - 25);
			b.setStatic();
			b.setOrient(ImpulseMath.random(-ImpulseMath.PI, ImpulseMath.PI, false));
			b.restitution = 0.2;
			b.dynamicFriction = 0.2;
			b.staticFriction = 0.4;
		}
		// barriers
		for (let i: number = 0; i < 200; i++) {
			let c: PhysicalCircle = new PhysicalCircle(Math.random() * 25);
			c.color = new Color(0, 255, 255).toString();
			let b: Body = this.physics.add(
				c, Math.random() * window.innerWidth, Math.random() * (window.innerHeight - 200) + 200);
			b.setStatic();
			b.setOrient(ImpulseMath.random(-ImpulseMath.PI, ImpulseMath.PI, false));
			b.restitution = 0.2;
			b.dynamicFriction = 0.2;
			b.staticFriction = 0.4;
		} */
		let floor: PhysicalPolygon = PhysicalPolygon.rectangle(window.innerWidth, 20);
		floor.color = new Color(255, 255, 255).toString();
		let boxbody: Body = this.physics.add(floor, window.innerWidth / 2, window.innerHeight - 200);
		boxbody.setStatic();
		boxbody.setOrient(0);

		for (let c: number = 0; c < 10; c++) {
			for (let x: number = 500; x < 520; x += 20) {
				let box: PhysicalPolygon = PhysicalPolygon.rectangle(20, 10);
				box.color = new Color(0, 255, 255).toString();
				let boxbody: Body = this.physics.add(box, x + 10, floor.body.position.y - floor.height() / 2 - c * 10);
			}
		}

		for (let l: number = 0; l < 0; l++) {
			// falling objects
			for (let i: number = 10; i < window.innerWidth; i += 40) {
				let c: PhysicalPolygon = PhysicalPolygon.rectangle(Math.random() * 20, Math.random() * 20);
				//let c: PhysicalCircle = new PhysicalCircle(Math.random() * 20);
				c.color = Color.getRandom().toString();
				let a: Body = this.physics.add(c, i, 50 + l * 20);
				a.setOrient(ImpulseMath.random(-ImpulseMath.PI, ImpulseMath.PI, false));
				a.restitution = 0.2;
				a.dynamicFriction = 0.2;
				a.staticFriction = 0.4;
			}
		}
		//ImpulseMath.GRAVITY = new Vector2D(0, 10);
	}

	public render(): void {
		super.render();
		for (let i: number = 0; i < this.physics.bodies.size; i++) {
			let b: Body = this.physics.bodies[i];
			this.canvas.ctx.save();

			this.canvas.ctx.translate(b.position.x, b.position.y);
			if (b.shape.centered()) {
				this.canvas.ctx.translate(-b.shape.width() / 2, - b.shape.height() / 2);
			}
			b.shape.render(this.canvas.ctx);
			this.canvas.ctx.restore();
		}
		for (let m: number = 0; m < this.physics.contacts.size; m++) {
			for (let i: number = 0; i < this.physics.contacts[m].contactCount; i++) {
				let v: Vector2D = this.physics.contacts[m].contacts[i];
				let n: Vector2D = this.physics.contacts[m].normal;
				this.canvas.ctx.fillStyle = "rgb(255,0,0)";
				this.canvas.ctx.fillRect(v.x - 1, v.y - 1, 3, 3);
			}
		}
	}

	public checkCollisions(): void {
		super.checkCollisions();
		this.physics.step();
	}

	public update(): void {
		for (let i: number = 0; i < this.physics.bodies.size; i++) {
			if (this.physics.bodies[i].position.y > window.innerHeight) {
				this.physics.bodies[i].position.y = 0;
			}
			if (this.physics.bodies[i].position.x < 0 || this.physics.bodies[i].position.x > window.innerWidth) {
				this.physics.bodies[i].position.x = Math.random() * window.innerWidth;
				this.physics.bodies[i].position.y = 0;
			}
		}
		if (KeyboardHandler.state.down.has("q")) {
			this.worldCamera.transform.rotate++;
		}
		if (KeyboardHandler.state.down.has("e")) {
			this.worldCamera.transform.rotate--;
		}
		if (MouseHandler.leftButton.state === ButtonState.pressed) {
			if (MouseHandler.leftButton.data == null) {
				//let shape: PhysicalCircle = new PhysicalCircle(1);
				let shape: PhysicalPolygon = PhysicalPolygon.rectangle(20, 20);
				shape.color = "rgb(255,255,0)";
				let obj: Body = this.physics.add(
					shape,
					MouseHandler.cursors.get(MouseHandler.MOUSECURSOR).x,
					MouseHandler.cursors.get(MouseHandler.MOUSECURSOR).y
				);
				//obj.setOrient(ImpulseMath.random(-ImpulseMath.PI, ImpulseMath.PI, false));
				obj.restitution = 0.2;
				obj.dynamicFriction = 0.2;
				obj.staticFriction = 0.4;
				Logger.log(obj.position.x + "," + MouseHandler.leftButton.x);
				obj.applyImpulse(new Vector2D(5200, -500), obj.position);
				MouseHandler.leftButton.data = obj;
			} else {
				if (MouseHandler.leftButton.data instanceof Body) {
					((MouseHandler.leftButton.data as Body).shape as PhysicalCircle).r++;
				}

			}
		}
		if (MouseHandler.leftButton.state === ButtonState.released && MouseHandler.leftButton.data != null) {
			MouseHandler.leftButton.data = null;
		}
		let cursors: Cursor[] = Array.from(MouseHandler.cursors.values());
		for (var i: number = 0; i < cursors.length; i++) {
			switch (cursors[i].state) {
				case CursorState.added:
					/* let cursor: Entity = this.world.registerEntity(new Entity())
						.registerComponent(new CircRenderComponent(20, new Color(255, 255, 255)))
						.entity;
					cursor.transform.origin = new Vector3D(cursors[i].x, cursors[i].y, 0); */
					//cursors[i].data = this.worldCamera;
					/* 	let shape: PhysicalCircle = new PhysicalCircle(20);
						shape.color = "rgb(255,255,255)";
						let obj: Body = this.physics.add(
							shape,
							cursors[i].x,
							cursors[i].y
						);
						obj.setStatic();
						obj.setOrient(ImpulseMath.random(-ImpulseMath.PI, ImpulseMath.PI, false));
						obj.restitution = 0.2;
						obj.dynamicFriction = 0.2;
						obj.staticFriction = 0.4;
						cursors[i].data = obj; */
					break;
				case CursorState.moved:
					//	(cursors[i].data as Body).position.set(cursors[i].x, cursors[i].y);
					/* if (cursors[i].data instanceof Camera) {
						cursors[i].data.renderer.offset.add(
							cursors[i].data.transform.project(new Vector2D(cursors[i].diffX, cursors[i].diffY))
						);
						if (cursors[i].wheelY !== 0) {
							//	let scale: number = cursors[i].wheelY / (150 * 50);
							//	let force: ForcePhysicsComponent = (cursors[i].data as Entity).getComponent<ForcePhysicsComponent>(ForcePhysicsComponent);
							//	force.velocity.addScalars(scale, scale, 0);
							//	force.active = true;
						}
					} else {
						(cursors[i].data as Entity).transform.origin = new Vector2D(cursors[i].x, cursors[i].y);
					} */
					/* var x: number = Math.max(0, Math.min(this.camera.area.x2(), this.container.area.x2(), cursors[i].x));
					var y: number = Math.max(0, Math.min(this.camera.area.y2(), this.container.area.y2(), cursors[i].y));
					if (x !== cursors[i].x || y !== cursors[i].y) {
						MouseHandler.inc(cursors[i].id, x - cursors[i].x, y - cursors[i].y);
					}
					cursors[i].data.move("render", x, y);
					cursors[i].data.move("collision", x, y); */
					break;
				case CursorState.remove:
					//this.physics.remove(cursors[i].data);
					/* 	this.container.deregister(cursors[i].data); */
					break;
			}
		}
	}
}