import { Entity } from "./Entity";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "./EventHandler";

export abstract class Component {
	public entity: Entity;
	public onAttach(entity: Entity) {
		this.entity = entity;
	}

	public abstract registerEvents(events: EventHandler): void;
}