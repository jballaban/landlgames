import { Manifold } from "./Manifold";
import { PhysicalCircle } from "./PhysicalShape";
import { Body } from "./Body";
import { Vector2D } from "../Vector";
import { CollisionCircleCircle } from "./CollisionCircleCircle";
import { CollisionCirclePolygon } from "./CollisionCirclePolygon";
import { CollisionPolygonPolygon } from "./CollisionPolygonPolygon";
import { CollisionPolygonCircle } from "./CollisionPolygonCircle";

export interface ICollisionCallback {
	handleCollision(m: Manifold, a: Body, b: Body): void;
}

export class Collisions {

	public static dispatch: ICollisionCallback[][] =
		[
			[CollisionCircleCircle.instance, CollisionCirclePolygon.instance],
			[CollisionPolygonCircle.instance, CollisionPolygonPolygon.instance]
		];
}