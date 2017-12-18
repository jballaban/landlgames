import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";

export abstract class RenderComponent extends Component {

	public abstract render(ctx: CanvasRenderingContext2D);

}