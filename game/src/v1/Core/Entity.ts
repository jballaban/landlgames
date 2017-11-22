import { Component } from "./Component";
import { ManagedCollection } from "../Foundation/ManagedCollection";
import { Vector } from "./Vector";

export class Entity {

	public parent: Entity = null;
	public components: Component[] = new Array<Component>();
	public entities: ManagedCollection<Entity> = new ManagedCollection<Entity>();
	public origin: Vector = new Vector(0, 0, 0);
	public scaleX: number = 1;
	public scaleY: number = 1;
	public rotateZ: number = 0;
	public alpha: number = 1;

	public update(seconds: number): void { }

	public registerEntity(entity: Entity): void {
		this.entities.add(entity);
		entity.parent = this;
	}

	public calc(name: string): any {
		if (this.parent == null) {
			return this[name];
		}
		switch (name) {
			case "origin":
				return this.origin.clone().add(this.parent.calc("origin"));
			case "alpha":
				return this.alpha * this.parent.calc("alpha");
		}
	}

}