import { ICollisionCallback } from "./Collisions";
import { CollisionCirclePolygon } from "./CollisionCirclePolygon";
import { Manifold } from "./Manifold";
import { Body } from "./Body";


export class CollisionPolygonCircle implements ICollisionCallback {

	public static instance: CollisionPolygonCircle = new CollisionPolygonCircle();

	public handleCollision(m: Manifold, a: Body, b: Body): void {
		CollisionCirclePolygon.instance.handleCollision(m, b, a);

		if (m.contactCount > 0) {
			m.normal.negate();
		}
	}

}