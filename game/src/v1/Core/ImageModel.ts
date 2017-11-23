import { Model } from "./Model";
import { Logger } from "../Util/Logger";

export class ImageModel extends Model {
	private image: HTMLImageElement;

	constructor(src: string, private width: number, private height: number) {
		super();
		this.image = new Image(width, height);
		this.image.src = "./asset/" + src;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.drawImage(this.image, 0, 0, this.width, this.height);
	}

}