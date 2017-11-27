import { Entity } from "./Entity";

export class Layer {
	public entities: Entity[] = new Array<Entity>();
	constructor(public cameraIndependent: boolean) { }
}