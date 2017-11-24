import { Entity } from "./Entity";

export abstract class Component {
	public entity: Entity;
	public onAttach(entity: Entity): void {
		this.entity = entity;
	}
}