export interface IShape {
	draw(ctx: CanvasRenderingContext2D, colour: string, x: number, y: number): void;
}