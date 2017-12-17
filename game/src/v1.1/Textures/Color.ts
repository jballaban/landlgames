import { Texture } from "./Texture";

export class Color extends Texture {

	constructor(
		public red: number,
		public green: number,
		public blue: number,
		public alpha: number = 1
	) {
		super();
	}

	public apply(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
		x = Math.floor(x); y = Math.floor(y); width = Math.floor(width); height = Math.floor(height);
		ctx.fillStyle = this.toString();
		ctx.fillRect(x, y, width, height);
	}

	public toString(): string {
		return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
	}

	public static Black: Color = new Color(0, 0, 0);
	public static White: Color = new Color(255, 255, 255);

	public static getRandom(): Color {
		return new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1);
	}
}