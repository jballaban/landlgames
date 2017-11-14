import { Point } from "./Point";

export enum ShapeType {
	Circle = 1,
	Rectangle = 2,
	Shadow = 4
}

export interface IShape {
	type: ShapeType;
	intersects(shape: IShape): boolean;
	render(ctx: CanvasRenderingContext2D, color: string): void;
	changed(): boolean;
	clearChanged(): void;
	origin: Point;
}