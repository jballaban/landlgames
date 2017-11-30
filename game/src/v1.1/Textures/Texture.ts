export abstract class Texture {
	public abstract apply(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number);
}