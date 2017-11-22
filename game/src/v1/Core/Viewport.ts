import { Canvas } from "./Canvas";
import { Camera } from "./Camera";
import { Model } from "./Model";
import { Logger } from "../Util/Logger";

export class Viewport {

	public canvas: Canvas;
	public camera: Camera;

	public constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number
	) {
		this.canvas = new Canvas(x, y, this.width, this.height);
		this.camera = new Camera();
	}

	public destroy() {
		this.canvas.destroy();
	}

	public resize(width: number, height: number): void {
		this.width = width;
		this.height = height;
		this.canvas.resize(width, height);
	}

	public draw(models: Model[]): void {
		this.canvas.ctx.clearRect(this.x, this.y, this.width, this.height);
		this.camera.draw(this.canvas.ctx, models);
	}

}

export class FullscreenViewport extends Viewport {

	private _width: number;
	private _height: number;

	public constructor() {
		super(0, 0, window.innerWidth, window.innerHeight);
		this._width = this.width;
		this._height = this.height;
		window.onresize = this.resizeWindow.bind(this);
	}

	public destroy() {
		window.onresize = null;
		super.destroy();
	}

	public update(seconds: number): void {
		if (this.width !== this._width || this.height !== this._height) {
			this.resize(this._width, this._height);
			this._width = this.width;
			this._height = this.height;
		}
	}

	private resizeWindow(): void {
		this._width = window.innerWidth;
		this._height = window.innerHeight;
	}

}