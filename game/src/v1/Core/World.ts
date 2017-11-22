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
		this.registerModels(entity);
	}

	private registerModels(entity: Entity) {
		if (entity instanceof Model) {
			this.models.push(entity);
		}
		for (let i = 0; i < entity.entities.length; i++) {
			this.registerModels(entity.entities[i]);
		}
	}

}