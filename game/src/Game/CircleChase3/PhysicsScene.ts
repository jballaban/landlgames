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
import { PhysicalCircle, ShapeType } from "../../v1.1/Core/Physics/PhysicalShape";
import { Body } from "../../v1.1/Core/Physics/Body";
import { PhysicalPolygon } from "../../v1.1/Core/Physics/PhysicalPolygon";

export class PhysicsScene extends Scene {
	private physics: PhysicsEngine;

	constructor() {
		super();
		this.physics = new PhysicsEngine(ImpulseMath.DT, 10);
		let floor: PhysicalPolygon = PhysicalPolygon.rectangle(window.innerWidth, 20);
		floor.color = new Color(255, 255, 255).toString();
		let floorbody: Body = this.physics.add(floor, window.innerWidth / 2, window.innerHeight - 20);
		floorbody.setStatic();
		let wall: PhysicalPolygon = PhysicalPolygon.rectangle(20, window.innerHeight);
		wall.color = new Color(255, 255, 255).toString();
		let wallbody: Body = this.physics.add(wall, window.innerWidth - wall.width() / 2, window.innerHeight / 2);
		wallbody.setStatic();
		for (let c: number = 0; c < 0; c++) {
			for (let l: number = 0; l < 8; l++) {
				let box: PhysicalPolygon = PhysicalPolygon.rectangle(20, 20);
				box.color = new Color(0, 255, 255).toString();
				let boxbody = this.physics.add(
					box,
					800 + c * box.width(),
					floorbody.position.y - floor.height() / 2 - box.height() / 2 - box.height() * l
				);
				boxbody.restitution = 1;
				boxbody.staticFriction = 1;
				boxbody.dynamicFriction = 1;

			}
		}

		for (let c: number = 0; c < 1; c++) {
			for (let l: number = 0; l < 11; l++) {
				let box: PhysicalPolygon = PhysicalPolygon.rectangle(80, 40);
				box.color = new Color(0, 255, 255).toString();
				let boxbody = this.physics.add(
					box,
					500 + c * box.width() + c,
					floorbody.position.y - floor.height() / 2 - box.height() / 2 - box.height() * l - l
				);
				boxbody.restitution = 0;
				boxbody.staticFriction = 1;
				boxbody.dynamicFriction = 1;
				box.computeMass(1);
			}
		}

		for (let l: number = 0; l < 0; l++) {
			// falling objects
			for (let i: number = 10; i < window.innerWidth; i += 40) {
				let c: PhysicalPolygon = PhysicalPolygon.rectangle(Math.random() * 20 + 5, Math.random() * 20 + 5);
				//let c: PhysicalCircle = new PhysicalCircle(Math.random() * 20);
				c.color = Color.getRandom().toString();
				let a: Body = this.physics.add(c, i, 50 + l * 20);
				a.setOrient(ImpulseMath.random(-ImpulseMath.PI, ImpulseMath.PI, false));
				a.restitution = 0.2;
				a.dynamicFriction = 0.2;
				a.staticFriction = 0.4;
			}
		}

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
			/* 	if (b.shape.type === ShapeType.Polygon) {
					for (let i = 0; i < (b.shape as PhysicalPolygon).vertexCount; i++) {
						Logger.log(i + ":" + (b.shape as PhysicalPolygon).vertices[i]);
					}
				} */
			this.canvas.ctx.restore();
		}
		for (let m: number = 0; m < this.physics.contacts.size; m++) {
			for (let i: number = 0; i < this.physics.contacts[m].contactCount; i++) {
				let v: Vector2D = this.physics.contacts[m].contacts[i];
				//let n: Vector2D = this.physics.contacts[m].normal;
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
		if (MouseHandler.leftButton.state === ButtonState.pressed) {
			if (MouseHandler.leftButton.data == null) {
				let shape: PhysicalCircle = new PhysicalCircle(20);
				//let shape: PhysicalPolygon = PhysicalPolygon.rectangle(20, 20);
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
				obj.applyForce(new Vector2D(200 / ImpulseMath.DT * obj.mass, -50 / ImpulseMath.DT * obj.mass));
			}
		}
		let cursors: Cursor[] = Array.from(MouseHandler.cursors.values());
		for (var i: number = 0; i < cursors.length; i++) {
			switch (cursors[i].state) {
				case CursorState.added:

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