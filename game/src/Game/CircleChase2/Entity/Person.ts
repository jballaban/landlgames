import { Entity, Composer } from "../../../v1/Core/Entity";
import { Model } from "../../../v1/Core/Model";
import { PrimitiveModel } from "../../../v1/Core/PrimitiveModel";
import { Circle } from "../../../v1/Foundation/Circle";
import { Color } from "../../../v1/Foundation/Color";
import { Vector3D } from "../../../v1/Core/Vector";
import { Rectangle } from "../../../v1/Foundation/Rectangle";
import { Component } from "../../../v1/Core/Component";
import { Logger } from "../../../v1/Util/Logger";
import { Viewport } from "../../../v1/Core/Viewport";
import { Time } from "../../../v1/Core/Time";

export class WalkComponent extends Component {
	constructor(private viewport: Viewport) {
		super();
	}

	public update(): void {
		this.entity.origin.x += 60 * Time.delta;
		if (this.entity.origin.x > this.viewport.width) {
			this.entity.origin.x = 0;
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
		this.velocity *= 60 * Time.delta;
	}
	public update(): void {
		this.entity.rotateZ += this.velocity;
		if (this.entity.rotateZ < this.minAngle) {
			this.entity.rotateZ = this.minAngle;
			this.velocity *= -1;
		}
		else if (this.entity.rotateZ > this.maxAngle) {
			this.entity.rotateZ = this.maxAngle;
			this.velocity *= -1;
		}
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

	public update(): void {
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
		face.origin = new Vector3D(0, -size / 2, 0.1);
		let lefteye = new PrimitiveModel(new Circle(size / 10), new Color(255, 0, 0));
		lefteye.origin = new Vector3D(-size * 1 / 4, -size / 4, 0.1);
		lefteye.registerComponent(new BlinkComponent(new Color(0, 0, 255)));
		face.registerEntity(lefteye);
		let righteye = new PrimitiveModel(new Circle(size / 10), new Color(255, 0, 0));
		righteye.origin = new Vector3D(size * 1 / 4, -size / 4, 0.1);
		face.registerEntity(righteye);
		this.registerEntity(face);
		let joint = new Joint(5);
		joint.origin.z += .1;
		this.registerEntity(joint);
		this.registerComponent(new WaveComponent(-15, 15, 1));
	}
}

export class Body extends Entity {
	constructor(width: number, height: number) {
		super();
		let body = new PrimitiveModel(new Rectangle(-width / 2, -height, width, height), new Color(200, 255, 255));
		this.registerEntity(body);
		this.registerEntity(new Arm(new Vector3D(-width / 2, -height * 3 / 4, 0.1), width / 3, height / 3, true));
		this.registerEntity(new Arm(new Vector3D(width / 2, -height * 3 / 4, 0.1), width / 3, height / 3, false));
	}
}

export class Joint extends PrimitiveModel {
	constructor(size: number) {
		super(new Circle(size), new Color(150, 150, 255));
		this.origin.addScalars(0, 0, .1);
	}
}

export class Leg extends PrimitiveModel {
	constructor(origin: Vector3D, thickness: number, length: number, left: boolean) {
		super(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 200, 255));
		this.registerComponent(new WaveComponent(left ? 0 : -90, left ? 90 : 0, 1));
		this.registerEntity(new Calf(new Vector3D(0, length, 0.1), thickness / 2, length * 2 / 3, left));
		this.origin = origin;
		this.registerEntity(new Joint(5));
	}
}

export class Calf extends PrimitiveModel {
	constructor(origin: Vector3D, thickness, length: number, left: boolean) {
		super(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 255, 255));
		this.origin = origin;
		this.registerEntity(new Foot(new Vector3D(0, length, 0.1), length / 2, left));
		this.registerComponent(new WaveComponent(left ? -90 : 0, left ? 0 : 90, Math.random()));
		this.registerEntity(new Joint(5));
	}
}

export class Foot extends PrimitiveModel {
	constructor(origin: Vector3D, length: number, left: boolean) {
		super(new Rectangle(left ? -length * 3 / 4 : -length / 4, 0, length, length / 2), new Color(200, 200, 200));
		this.origin = origin;
		this.registerEntity(new Joint(5));
	}
}

export class Arm extends PrimitiveModel {
	constructor(origin: Vector3D, thickness: number, length: number, left: boolean) {
		super(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 200, 255));
		this.registerComponent(new WaveComponent(left ? 0 : -135, left ? 135 : 0, 1));
		this.registerEntity(new Forearm(new Vector3D(0, length, 0.1), thickness / 2, length * 2 / 3, left));
		this.origin = origin;
		this.registerEntity(new Joint(5));
	}
}

export class Forearm extends PrimitiveModel {
	constructor(origin: Vector3D, thickness, length: number, left: boolean) {
		super(new Rectangle(-thickness / 2, 0, thickness, length), new Color(255, 255, 255));
		this.origin = origin;
		this.registerEntity(new Hand(new Vector3D(0, length, 0.1), length / 2));
		this.registerComponent(new WaveComponent(left ? 0 : -90, left ? 90 : 0, Math.random()));
		this.registerEntity(new Joint(5));
	}
}

export class Hand extends PrimitiveModel {
	constructor(origin: Vector3D, size: number) {
		super(new Rectangle(-size / 2, 0, size, size), new Color(200, 200, 200));
		this.origin = origin;
		this.registerEntity(new Joint(5));
	}
}

export class Person extends Entity {
	constructor(width: number, height: number, velocity: number, origin: Vector3D, viewport: Viewport) {
		super();
		let body = new Body(width, height);
		this.registerEntity(body);
		let head = new Head(height / 3);
		head.origin = new Vector3D(0, -height, 0.1);
		this.registerEntity(head);
		this.registerEntity(new Leg(new Vector3D(-width / 2, 0, 0.1), width / 2, height / 2, true));
		this.registerEntity(new Leg(new Vector3D(width / 2, 0, 0.1), width / 2, height / 2, false));
		this.registerComponent(new WalkComponent(viewport));
		this.registerComponent(new WaveComponent(0, 360, velocity));
		this.origin = origin;
		this.rotateZ = Math.floor(Math.random() * 360);
	}
}