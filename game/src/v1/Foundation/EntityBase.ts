import { Layer } from "../Core/Layer";
import { Entity, IPreUpdate, IFrameStart, IPostUpdate, IUpdate } from "../Core/Entity";
import { Model } from "../Core/Model";

export class EntityBase extends Entity {
	public modelLayers: Layer[] = new Array<Layer>();
	private frameStarts: IFrameStart[] = new Array<IFrameStart>();
	private preUpdates: IPreUpdate[] = new Array<IPreUpdate>();
	private postUpdates: IPostUpdate[] = new Array<IPostUpdate>();
	private updates: IUpdate[] = new Array<IUpdate>();

	public registerEvents(obj: any): void {
		// tslint:disable-next-line:no-string-literal
		if (obj instanceof Model) {
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