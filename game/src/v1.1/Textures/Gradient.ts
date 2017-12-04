import { Texture } from "./Texture";
import { Color } from "./Color";

export interface IGradientStop {
	percent: number;
	color: Color;
}

export enum GradientType {
	TopToDown,
	TopLeftToBottomRight,
	MiddleToOutCircle
}

export class Gradient extends Texture {
	constructor(private stops: IGradientStop[], public type: GradientType = GradientType.TopLeftToBottomRight) {
		super();
	}

	public apply(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
		x = Math.floor(x); y = Math.floor(y); width = Math.floor(width); height = Math.floor(height);
		var grd: CanvasGradient;
		switch (this.type) {
			case GradientType.TopToDown:
				grd = ctx.createLinearGradient(x, y, x, height);
				break;
			case GradientType.TopLeftToBottomRight:
				grd = ctx.createLinearGradient(x, y, width, height);
				break;
			case GradientType.MiddleToOutCircle:
				grd = ctx.createRadialGradient(x + width / 2, y + height / 2, 1, x + width / 2, y + height / 2, Math.max(width / 2, height / 2));
				break;
		}
		for (let i: number = 0; i < this.stops.length; i++) {
			grd.addColorStop(this.stops[i].percent / 100, this.stops[i].color.toString());
		}
		ctx.fillStyle = grd;
		ctx.fillRect(x, y, width, height);
	}

}