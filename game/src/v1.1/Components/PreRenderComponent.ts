import { Component } from "../Core/Component";
import { Entity } from "../Core/Entity";
import { Logger } from "../Utils/Logger";
import { EventHandler } from "../Core/EventHandler";

export abstract class PreRenderComponent extends Component {

	public init(ctx: CanvasRenderingContext2D): void {
		// empty
	}

	public abstract apply(ctx: CanvasRenderingContext2D): void;

}