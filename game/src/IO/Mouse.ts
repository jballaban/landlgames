import { Element } from "../Core/Element";
import { Logger } from "../Util/Logger";
import { Camera } from "../Core/Camera";
import { ElementContainer } from "../Core/ElementContainer";
import { IShape } from "../Shape/IShape";
import { ElementType } from "../Core/ElementType";
import { Cursor } from "./MouseHandler";
import { SpritePool } from "../Core/SpritePool";

export abstract class Mouse extends Element {
	constructor(container: ElementContainer, spritePool: SpritePool, renderArea: IShape, collisionArea: IShape, zindex: number) {
		super(container, spritePool, ElementType.Mouse, renderArea, collisionArea, zindex, null);
	}

}