import { Entity } from "./Entity";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "./EventHandler";

export abstract class Component {
	public entity: Entity;
	public onAttach(entity: Entity): void {
		this.entity = entity;
	}
}