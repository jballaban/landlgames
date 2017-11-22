import { Entity } from "./Entity";
import { Model } from "./Model";

export class World extends Entity {

	public models: Model[] = new Array<Model>();

	public constructor(
		public width: number,
		public height: number
	) {
		super();
	}

	public registerEntity(entity: Entity) {
		super.registerEntity(entity);
		if (entity instanceof Model) {
			this.models.push(entity);
		}
	}

	public update(seconds: number): void {

	}

}