import { Texture } from "./Texture";

export class Color extends Texture {
	constructor(
		public red: number,
		public green: number,
		public blue: number
	) {
		super();
	}

	public apply(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
		ctx.fillStyle = this.toString();
		ctx.fillRect(x, y, width, height);
	}

	public toString() {
		return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
	}

	public static getRandom() {
		return new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
	}
}