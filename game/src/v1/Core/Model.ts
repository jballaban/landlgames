import { Entity } from "./Entity";

export abstract class Model extends Entity {

	public abstract draw(ctx: CanvasRenderingContext2D): void;

}