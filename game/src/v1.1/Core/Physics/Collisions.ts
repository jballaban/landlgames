// tslint:disable:comment-format
import { Manifold } from "./Manifold";
import { PhysicalCircle } from "./PhysicalShape";
import { Body } from "./Body";
import { Vector2D } from "../Vector";

export interface ICollisionCallback {

	handleCollision(m: Manifold, a: Body, b: Body): void;
}

export class CollisionCircleCircle implements ICollisionCallback {

	public static instance: CollisionCircleCircle = new CollisionCircleCircle();

	public handleCollision(m: Manifold, a: Body, b: Body): void {
		let A: PhysicalCircle = a.shape as PhysicalCircle;
		let B: PhysicalCircle = b.shape as PhysicalCircle;

		// Calculate translational vector, which is normal
		// Vec2 normal = b->position - a->position;
		let normal: Vector2D = b.position.clone().subtract(a.position);

		// real dist_sqr = normal.LenSqr( );
		// real radius = A->radius + B->radius;
		let dist_sqr: number = normal.lengthSquared();
		let radius: number = A.r + B.r;

		// Not in contact
		if (dist_sqr >= radius * radius) {
			m.contactCount = 0;
			return;
		}

		let distance: number = Math.sqrt(dist_sqr);

		m.contactCount = 1;

		if (distance === 0.0) {
			// m->penetration = A->radius;
			// m->normal = Vec2( 1, 0 );
			// m->contacts [0] = a->position;
			m.penetration = A.r;
			m.normal.set(1.0, 0.0);
			m.contacts[0].set(a.position.x, a.position.y);
		} else {
			// m->penetration = radius - distance;
			// m->normal = normal / distance; // Faster than using Normalized since
			// we already performed sqrt
			// m->contacts[0] = m->normal * A->radius + a->position;
			m.penetration = radius - distance;
			m.normal.set(normal.x, normal.y).divideScalar(distance);
			m.contacts[0].set(m.normal.x, m.normal.y).multiplyScalar(A.r).add(a.position);
		}
	}

}

export class Collisions {

	public static dispatch: ICollisionCallback[][] =
		[
			[CollisionCircleCircle.instance]
			/* [CollisionCircleCircle.instance, CollisionCirclePolygon.instance],
			[CollisionPolygonCircle.instance, CollisionPolygonPolygon.instance] */
		];

}