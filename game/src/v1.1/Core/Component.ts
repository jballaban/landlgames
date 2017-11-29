import { Entity } from "./Entity";
import { Logger } from "../Utils/Logger";

export class Component {
	public entity: Entity;
	public onAttach(entity: Entity) {
		this.entity = entity;
	}
}