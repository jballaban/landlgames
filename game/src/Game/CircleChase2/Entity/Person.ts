import { Entity, Composer } from "../../../v1/Core/Entity";
import { Model } from "../../../v1/Core/Model";
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
		face.attributes.set("origin", new Vector2D(0, -size / 2));
		let lefteye = new PrimitiveModel(new Circle(size / 10), new Color(255, 0, 0));
		lefteye.attributes.set("origin", new Vector2D(-size * 1 / 4, -size / 4));
		lefteye.registerComponent(new BlinkComponent(new Color(0, 0, 255)));
		lefteye.attributes.set("zIndex", 0.1);
		face.registerEntity(lefteye);
		let righteye = new PrimitiveModel(new Circle(size / 10), new Color(255, 0, 0));
		righteye.attributes.set("origin", new Vector2D(size * 1 / 4, -size / 4));
		righteye.attributes.set("zIndex", 0.1);
		face.registerEntity(righteye);
		this.registerEntity(face);
		let mouth = new PrimitiveModel(new Rectangle(-size / 4, size / 4, size / 2, size / 8), new Color(255, 255, 0));
		mouth.attributes.set("zIndex", 0.1);
		face.registerEntity(mouth);
		this.registerEntity(new Joint(5));
		this.registerComponent(new WaveComponent(-15, 15, 1));
	}

}

export class Body extends Entity {
	constructor(width: number, height: number) {
		super();
		let body = new PrimitiveModel(new Rectangle(-width / 2, -height, width, height), new Color(200, 255, 255));
		this.registerEntity(body);
		this.registerEntity(new Arm(new Vector2D(-width / 2, -height * 3 / 4), width / 3, height / 3, true));
		this.registerEntity(new Arm(new Vector2D(width / 2, -height * 3 / 4), width / 3, height / 3, false));
	}
}

export class Joint extends PrimitiveModel {
	constructor(size: number) {
		super(new Circle(size), new Color(150, 150, 255));
		this.attributes.set("zIndex", 0.1);
	}
}

export class Leg extends PrimitiveModel {
	constructor(origin: Vector2D, thickness: number, length: number, left: boolean) {
		super(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 200, 255));
		this.registerComponent(new WaveComponent(left ? 0 : -90, left ? 90 : 0, 1));
		this.registerEntity(new Calf(new Vector2D(0, length), thickness / 2, length * 2 / 3, left));
		this.attributes.set("origin", origin);
		this.registerEntity(new Joint(5));
	}
}

export class Calf extends PrimitiveModel {
	constructor(origin: Vector2D, thickness, length: number, left: boolean) {
		super(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 255, 255));
		this.attributes.set("origin", origin);
		this.registerEntity(new Foot(new Vector2D(0, length), length / 2, left));
		this.registerComponent(new WaveComponent(left ? -90 : 0, left ? 0 : 90, Math.random()));
		this.registerEntity(new Joint(5));
	}
}

export class Foot extends PrimitiveModel {
	constructor(origin: Vector2D, length: number, left: boolean) {
		super(new Rectangle(left ? -length * 3 / 4 : -length / 4, 0, length, length / 2), new Color(200, 200, 200));
		this.attributes.set("origin", origin);
		this.registerEntity(new Joint(5));
	}
}

export class Arm extends PrimitiveModel {
	constructor(origin: Vector2D, thickness: number, length: number, left: boolean) {
		super(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 200, 255));
		this.registerComponent(new WaveComponent(left ? 0 : -135, left ? 135 : 0, 1));
		this.registerEntity(new Forearm(new Vector2D(0, length), thickness / 2, length * 2 / 3, left));
		this.attributes.set("origin", origin);
		this.registerEntity(new Joint(5));
	}
}

export class Forearm extends PrimitiveModel {
	constructor(origin: Vector2D, thickness, length: number, left: boolean) {
		super(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 255, 255));
		this.attributes.set("origin", origin);
		this.registerEntity(new Hand(new Vector2D(0, length), length / 2));
		this.registerComponent(new WaveComponent(left ? 0 : -90, left ? 90 : 0, Math.random()));
		this.registerEntity(new Joint(5));
	}
}

export class Hand extends PrimitiveModel {
	constructor(origin: Vector2D, size: number) {
		super(new Rectangle(-size / 2, 0, size, size), new Color(200, 200, 200));
		this.attributes.set("origin", origin);
		this.registerEntity(new Joint(5));
	}
}

export class RightArm extends Entity {
	constructor(degrees: number, length: number, thickness: number) {
		super();
		let arm = new PrimitiveModel(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 200, 255));
		arm.registerComponent(new WaveComponent(-135, 0, 1));
		this.registerEntity(arm);
		arm.registerEntity(new Forearm(new Vector2D(0, length), thickness / 2, length * 2 / 3, false));
	}
}

export class LeftArm extends Entity {
	constructor(degrees: number, length: number, thickness: number) {
		super();
		let arm = new PrimitiveModel(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 200, 255));
		arm.registerComponent(new WaveComponent(0, 135, 1.1));
		this.registerEntity(arm);
		let forearm = new PrimitiveModel(new Rectangle(-thickness / 4, 0, thickness / 2, length * 2 / 3), new Color(255, 255, 255));
		forearm.attributes.set("origin", new Vector2D(0, length));
		forearm.registerComponent(new WaveComponent(0, 90, 0.4));
		let hand = new PrimitiveModel(new Rectangle(-10, 0, 20, 20), new Color(200, 200, 200));
		hand.attributes.set("origin", new Vector2D(0, length * 2 / 3));
		forearm.registerEntity(hand);
		arm.registerEntity(forearm);
	}
}

export class Person extends Entity {

	constructor(width: number, height: number, velocity: number, origin: Vector2D, viewport: Viewport) {
		super();
		let body = new Body(width, height);
		this.registerEntity(body);
		let head = new Head(height / 3);
		head.attributes.set("origin", new Vector2D(0, -height));
		this.registerEntity(head);
		this.registerEntity(new Leg(new Vector2D(-width / 2, 0), width / 2, height / 2, true));
		this.registerEntity(new Leg(new Vector2D(width / 2, 0), width / 2, height / 2, false));
		this.registerComponent(new WalkComponent(viewport));
		this.registerComponent(new WaveComponent(0, 360, velocity));
		this.attributes.set("origin", origin);
		this.attributes.set("rotateZ", Math.floor(Math.random() * 360));
	}

	public update(seconds: number): void {
		super.update(seconds);
		let scale = this.attributes.get("scale");
		scale -= .001 + (scale / 4) / 10;
		if (scale <= 0) {
			scale = 4;
		}
		this.attributes.set("scale", scale);
		this.attributes.set("zIndex", scale);
	}

}