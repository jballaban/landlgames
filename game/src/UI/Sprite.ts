export class Sprite {
	private image: HTMLImageElement;
	public loaded: boolean = false;

	constructor(src: string, width: number, height: number) {
		this.image = new Image(width, height);
		this.image.src = "./asset/" + src;
		this.image.onload = this.onLoad.bind(this);
	}

	public render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
		ctx.drawImage(this.image, x, y, width, height);
	}

	private onLoad(): void {
		this.loaded = true;
	}
}