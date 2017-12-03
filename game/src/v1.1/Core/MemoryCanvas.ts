export class MemoryCanvas {
	public ctx: CanvasRenderingContext2D;

	public constructor(public width: number, public height: number) {
		var canv: HTMLCanvasElement = document.createElement("canvas");
		canv.setAttribute("display", "none");
		canv.width = width;
		canv.height = height;
		this.ctx = canv.getContext("2d");
	}

}