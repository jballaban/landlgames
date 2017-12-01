import { Texture } from "./Texture";
import { Color } from "./Color";

export interface GradientStop {
	percent: number,
	color: Color
}

export class Gradient extends Texture {
	constructor(private stops: GradientStop[]) {
		super();
	}

	public apply(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
		var grd = ctx.createLinearGradient(x, y, width, height);
		for (let i = 0; i < this.stops.length; i++) {
			grd.addColorStop(this.stops[i].percent / 100, this.stops[i].color.toString());
		}
		ctx.fillStyle = grd
		ctx.fillRect(x, y, width, height);
	}

}