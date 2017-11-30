export class Canvas {
	public ctx: CanvasRenderingContext2D;

	public constructor(public x: number, public y: number, public width: number, public height: number) {
		var canv: HTMLCanvasElement = document.createElement("canvas");
		document.body.appendChild(canv);
		canv.style.left = x + "px";
		canv.style.top = y + "px";
		this.ctx = canv.getContext("2d");
		this.resize(width, height);
	}

	public resize(width: number, height: number): void {
		this.ctx.canvas.width = width;
		this.ctx.canvas.height = height;
	}

	public destroy(): void {
		document.body.removeChild(this.ctx.canvas);
	}

}