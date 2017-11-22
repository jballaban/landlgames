import { Entity, Composer } from "../../../v1/Core/Entity";
import { Model, RenderOptions } from "../../../v1/Core/Model";
import { PrimitiveModel } from "../../../v1/Core/PrimitiveModel";
import { Circle } from "../../../v1/Foundation/Circle";
import { Color } from "../../../v1/Foundation/Color";
import { Vector2D } from "../../../v1/Core/Vector";
import { Rectangle } from "../../../v1/Foundation/Rectangle";
import { Component } from "../../../v1/Core/Component";
import { Logger } from "../../../v1/Util/Logger";
import { Viewport } from "../../../v1/Core/Viewport";

export class WalkComponent extends Component {

	constructor(private viewport: Viewport) {
		super();
	}

	public update(seconds: number): void {
		let origin: Vector2D = this.entity.attributes.get("origin");
		origin.x += 1;
		if (origin.x > this.viewport.width) {
			origin.x = 0;
		}
	}

}

export class WaveComponent extends Component {
	constructor(
		private minAngle: number,
		private maxAngle: number,
		private velocity: number
	) {
		super();
	}
	public update(seconds: number): void {
		let angle = this.entity.attributes.get("rotateZ");
		angle += this.velocity;
		if (angle < this.minAngle) {
			angle = this.minAngle;
			this.velocity *= -1;
		}
		else if (angle > this.maxAngle) {
			angle = this.maxAngle;
			this.velocity *= -1;
		}
		this.entity.attributes.set("rotateZ", angle);
	}

}

export class BlinkComponent extends Component {
	private originalColor: Color;
	private blinking: boolean = false;

	constructor(private blinkColor: Color) {
		super();
	}

	public onAttach(entity: PrimitiveModel): void {
		super.onAttach(entity);
		this.originalColor = entity.color;
		this.blinking = false;
	}

	public update(seconds: number): void {
		let rnd = this.blinking ? 20 : 400;
		if (Math.floor(Math.random() * rnd) === 1) {
			(this.entity as PrimitiveModel).color = this.blinking ? this.originalColor : this.blinkColor;
			this.blinking = !this.blinking;
		}
	}

}

export class Head extends Entity {

	constructor(size: number) {
		super();
		let face = new PrimitiveModel(new Circle(size / 2), new Color(255, 255, 255));
		let lefteye = new PrimitiveModel(new Circle(5), new Color(255, 0, 0));
		lefteye.attributes.set("origin", new Vector2D(-15, -size / 4));
		lefteye.registerComponent(new BlinkComponent(new Color(0, 0, 255)));
		face.registerEntity(lefteye);
		let righteye = new PrimitiveModel(new Circle(5), new Color(255, 0, 0));
		righteye.attributes.set("origin", new Vector2D(15, -size / 4));
		face.registerEntity(righteye);
		this.registerEntity(face);
		let mouth = new PrimitiveModel(new Rectangle(-size / 4, size / 4, size / 2, size / 8), new Color(255, 255, 0));
		face.registerEntity(mouth);
	}

}

export class Body extends Entity {

	constructor(width: number, height: number) {
		super();
		let body = new PrimitiveModel(new Rectangle(-width / 2, -height, width, height), new Color(200, 255, 255));
		this.registerEntity(body);
	}

}

export class Arm extends Entity {
	constructor(degrees: number, length: number, thickness: number) {
		super();
		let arm = new PrimitiveModel(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 200, 255));
		arm.registerComponent(new WaveComponent(-135, 0, 1));
		this.registerEntity(arm);
		let forearm = new PrimitiveModel(new Rectangle(-thickness / 4, length, thickness / 2, length / 2), new Color(255, 255, 255));
		//	forearm.registerComponent(new WaveComponent(-90, 0, 1));
		this.registerEntity(forearm);
	}
}

export class Person extends Entity {

	constructor(viewport: Viewport) {
		super();
		let body = new Body(75, 200);
		this.registerEntity(body);
		let head = new Head(50);
		head.attributes.set("origin", new Vector2D(0, -225));
		this.registerEntity(head);
		let arm = new Arm(45, 70, 20);
		arm.attributes.set("origin", new Vector2D(75 / 2, -180));
		this.registerEntity(arm);
		//this.registerComponent(new WalkComponent(viewport));
		//this.registerComponent(new WaveComponent(-45, 45, 1));

	}

}