import { Component } from "../Core/Component";
import { Logger } from "../Utils/Logger";
import { TransformComponent } from "./TransformComponent";
import { Vector3D } from "../Core/Vector";

export abstract class RenderComponent extends Component {

	public abstract render(ctx: CanvasRenderingContext2D, cameraOrigin: Vector3D, cameraScale: Vector3D);
}