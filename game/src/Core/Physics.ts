import { Vector } from "./Vector";
import { Collision } from "../Util/Collision";
import { Element } from "../Core/Element";
import { ElementType } from "./ElementType";

export class Physics {

	public static collide(el1: Element, el2: Element): void {
		var normal: Vector = Collision.getContactNormal(el1.collisionArea, el2.collisionArea);
		var relative: Vector = el2.vector.clone().subtract(el1.vector);
		var contactVelocity: number = relative.dot(normal);
		if (contactVelocity > 0)
			return;
		var restitution = 0.5;
		var j: number = -(1 + restitution) * contactVelocity;
		j /= (1 / Collision.getMass(el1.collisionArea)) + (1 / Collision.getMass(el2.collisionArea));
		var impulse: Vector = normal.clone().multiply(j);
		el1.vector.subtract(impulse.clone().multiply(1 / Collision.getMass(el1.collisionArea)));
		el2.vector.add(impulse.clone().multiply(1 / Collision.getMass(el2.collisionArea)));
	}
}