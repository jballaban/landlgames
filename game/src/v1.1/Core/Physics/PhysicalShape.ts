import { Body } from "./Body";
import { Shape, Circle } from "../Shape";
import { ImpulseMath } from "./ImpulseMath";
import { Logger } from "../../Utils/Logger";

export enum ShapeType {
	Circle = 0,
	Polygon = 1
}

export interface IPhysicalShape {
	type: ShapeType;
	body: Body;
	initialize(): void;
	width(): number;
	height(): number;
	setOrient(radians: number): void;
	render(ctx: CanvasRenderingContext2D): void;
}

export class PhysicalCircle extends Circle implements IPhysicalShape {

	public body: Body;
	public type: ShapeType = ShapeType.Circle;

	public initialize(): void {
		this.computeMass(1);
	}

	public setOrient(radians: number): void {
		// do nothing
	}

	public computeMass(density: number): void {
		this.body.mass = ImpulseMath.PI * this.r * this.r * density;
		this.body.invMass = (this.body.mass !== 0.0) ? 1.0 / this.body.mass : 0.0;
		this.body.inertia = this.body.mass * this.r * this.r;
		this.body.invInertia = (this.body.inertia !== 0.0) ? 1.0 / this.body.inertia : 0.0;
	}
}