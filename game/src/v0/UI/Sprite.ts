export class Sprite {
	private image: HTMLImageElement;
	public loaded: boolean = false;

	constructor(src: string, public width: number, public height: number) {
		this.image = new Image(width, height);
		this.image.src = "./asset/" + src;
		this.image.onload = this.onLoad.bind(this);
	}

	public render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
		ctx.drawImage(this.image, 0, 0, this.width, this.height, x, y, width, height);
	}

	private onLoad(): void {
		this.loaded = true;
	}
}