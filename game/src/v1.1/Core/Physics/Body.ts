import { Vector2D } from "../Vector";
import { IPhysicalShape } from "./PhysicalShape";
import { ImpulseMath } from "./ImpulseMath";

export class Body {

	public position: Vector2D = new Vector2D();
	public velocity: Vector2D = new Vector2D();
	public force: Vector2D = new Vector2D();
	public angularVelocity: number;
	public torque: number;
	public orient: number;
	public mass: number;
	public invMass: number;
	public inertia: number;
	public invInertia: number;
	public staticFriction: number;
	public dynamicFriction: number;
	public restitution: number;
	public shape: IPhysicalShape;

	constructor(shape: IPhysicalShape, x: number, y: number) {
		this.shape = shape;
		this.position.set(x, y);
		this.velocity.set(0, 0);
		this.angularVelocity = 0;
		this.torque = 0;
		this.orient = 0;
		this.force.set(0, 0);
		this.staticFriction = 0.5;
		this.dynamicFriction = 0.3;
		this.restitution = 0.2;
		shape.body = this;
		shape.initialize();
	}

	public applyForce(f: Vector2D): void {
		this.force.add(f);
	}

	public applyImpulse(impulse: Vector2D, contactVector: Vector2D): void {
		// velocity += im * impulse;
		// angularVelocity += iI * Cross( contactVector, impulse );
		this.velocity.addVectorWithScalar(impulse, this.invMass);
		this.angularVelocity += this.invInertia * contactVector.clone().cross(impulse);
	}

	public setStatic(): void {
		this.inertia = 0.0;
		this.invInertia = 0.0;
		this.mass = 0.0;
		this.invMass = 0.0;
	}

	public setOrient(radians: number): void {
		this.orient = radians;
		this.shape.setOrient(radians);
	}

}