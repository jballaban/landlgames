import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";
import { AlphaComponent } from "./AlphaComponent";

export abstract class RenderComponent extends Component {

	public abstract render(ctx: CanvasRenderingContext2D);

}