import { World } from "./World";
import { Viewport } from "./Viewport";
import { IUpdate, IPostUpdate, Entity, IFrameStart, IPreUpdate, IRender } from "./Entity";
import { Model } from "./Model";
import { Layer } from "./Layer";
import { Vector3D } from "./Vector";
import { Camera } from "./Camera";

export class Scene {
	public modelLayers: Layer[] = new Array<Layer>();
	//public models: Model[] = new Array<Model>();
	private frameStarts: IFrameStart[] = new Array<IFrameStart>();
	private preUpdates: IPreUpdate[] = new Array<IPreUpdate>();
	private postUpdates: IPostUpdate[] = new Array<IPostUpdate>();
	private updates: IUpdate[] = new Array<IUpdate>();

	constructor(
		public viewports: Viewport[]
	) { }


	public destroy(): void {
		for (let i: number = 0; i < this.viewports.length; i++) {
			this.viewports[i].destroy();
		}
	}

	public frame(): void {
		for (let i: number = 0; i < this.frameStarts.length; i++) {
			this.frameStarts[i].frameStart();
		}
	}

	public update(): void {
		for (let i: number = 0; i < this.preUpdates.length; i++) {
			this.preUpdates[i].preUpdate();
		}
		for (let i: number = 0; i < this.updates.length; i++) {
			this.updates[i].update();
		}
		for (let i: number = 0; i < this.postUpdates.length; i++) {
			this.postUpdates[i].postUpdate();
		}
	}

	public draw(): void {
		for (let i: number = 0; i < this.viewports.length; i++) {
			this.viewports[i].clear();
		}
		for (let layer: number = 0; layer < this.modelLayers.length; layer++) {
			for (let i: number = 0; i < this.viewports.length; i++) {
				this.viewports[i].draw(this.modelLayers[layer].entities as Model[]);
			}
		}
	}

	public registerEvents(obj: any): void {
		// tslint:disable-next-line:no-string-literal
		if (obj instanceof Model) {
			while (this.modelLayers.length <= obj.layerIndex) {
				this.modelLayers.push(new Layer());
			}
			this.modelLayers[obj.layerIndex].entities.push(obj);
		}
		// tslint:disable-next-line:no-string-literal
		if (obj["update"]) {
			this.updates.push(obj);
		}
		// tslint:disable-next-line:no-string-literal
		if (obj["postUpdate"]) {
			this.postUpdates.push(obj);
		}
		// tslint:disable-next-line:no-string-literal
		if (obj["preUpdate"]) {
			this.preUpdates.push(obj);
		}
		if (obj instanceof Entity) {
			for (let i: number = 0; i < obj.entities.length; i++) {
				this.registerEvents(obj.entities[i]);
			}
			for (let i: number = 0; i < obj.components.length; i++) {
				this.registerEvents(obj.components[i]);
			}
		}

	}

}