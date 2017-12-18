import { Body } from "./Body";
import { Vector2D } from "./Vector";
import { ImpulseMath } from "./ImpulseMath";

export class Manifold {

	public A: Body;
	public B: Body;
	public penetration: number;
	public normal: Vector2D = new Vector2D();
	public contacts: Vector2D[] = [new Vector2D(), new Vector2D()];
	public contactCount: number;
	public e: number;
	public df: number;
	public sf: number;

	public Manifold(a: Body, b: Body) {
		this.A = a;
		this.B = b;
	}

	public solve(): void {
		let ia: number = this.A.shape.type;
		let ib: number = this.B.shape.type;

		//	Collisions.dispatch[ia][ib].handleCollision(this, this.A, this.B);
	}

	public initialize(): void {
		// Calculate average restitution
		// e = std::min( A->restitution, B->restitution );
		this.e = Math.min(this.A.restitution, this.B.restitution);

		// Calculate static and dynamic friction
		// sf = std::sqrt( A->staticFriction * A->staticFriction );
		// df = std::sqrt( A->dynamicFriction * A->dynamicFriction );
		this.sf = Math.sqrt(this.A.staticFriction * this.A.staticFriction + this.B.staticFriction * this.B.staticFriction);
		this.df = Math.sqrt(this.A.dynamicFriction * this.A.dynamicFriction + this.B.dynamicFriction * this.B.dynamicFriction);

		for (let i: number = 0; i < this.contactCount; ++i) {
			// Calculate radii from COM to contact
			// Vec2 ra = contacts[i] - A->position;
			// Vec2 rb = contacts[i] - B->position;
			let ra: Vector2D = this.contacts[i].clone().subtract(this.A.position);
			let rb: Vector2D = this.contacts[i].clone().subtract(this.B.position);

			// Vec2 rv = B->velocity + Cross( B->angularVelocity, rb ) -
			// A->velocity - Cross( A->angularVelocity, ra );

			/* let rv: Vector2D = this.B.velocity.add(
				Vec2.cross(B.angularVelocity, rb, new Vec2()))
				.subi(A.velocity)
				.subi(Vec2.cross(A.angularVelocity, ra, new Vec2())
				); */

			let n: Vector2D = rb.crossScalar(this.B.angularVelocity);
			let m: Vector2D = ra.crossScalar(this.A.angularVelocity);
			let rv: Vector2D = this.B.velocity.add(n).subtract(this.A.velocity).subtract(m);

			// Determine if we should perform a resting collision or not
			// The idea is if the only thing moving this object is gravity,
			// then the collision should be performed without any restitution
			// if(rv.LenSqr( ) < (dt * gravity).LenSqr( ) + EPSILON)
			if (rv.lengthSquared() < ImpulseMath.RESTING) {
				this.e = 0.0;
			}
		}
	}

	public applyImpulse(): void {
		// Early out and positional correct if both objects have infinite mass
		// if(Equal( A->im + B->im, 0 ))
		if (ImpulseMath.equal(this.A.invMass + this.B.invMass, 0)) {
			this.infiniteMassCorrection();
			return;
		}

		for (let i: number = 0; i < this.contactCount; ++i) {
			// Calculate radii from COM to contact
			// Vec2 ra = contacts[i] - A->position;
			// Vec2 rb = contacts[i] - B->position;
			let ra: Vector2D = this.contacts[i].clone().subtract(this.A.position);
			let rb: Vector2D = this.contacts[i].clone().subtract(this.B.position);

			// Relative velocity
			// Vec2 rv = B->velocity + Cross( B->angularVelocity, rb ) -
			// A->velocity - Cross( A->angularVelocity, ra );
			/*  let rv:Vector2D = this.B.velocity.add(
				Vec2.cross(B.angularVelocity, rb, new Vec2()))
				.subi(A.velocity)
				.subi(Vec2.cross(A.angularVelocity, ra, new Vec2())); */
			let m: Vector2D = ra.crossScalar(this.A.angularVelocity);
			let n: Vector2D = rb.crossScalar(this.B.angularVelocity);
			let rv: Vector2D = this.B.velocity.clone().add(n).subtract(this.A.velocity).subtract(m);

			// Relative velocity along the normal
			// real contactVel = Dot( rv, normal );
			let contactVel: number = rv.dot(this.normal);

			// Do not resolve if velocities are separating
			if (contactVel > 0) {
				return;
			}

			// real raCrossN = Cross( ra, normal );
			// real rbCrossN = Cross( rb, normal );
			// real invMassSum = A->im + B->im + Sqr( raCrossN ) * A->iI + Sqr(
			// rbCrossN ) * B->iI;
			let raCrossN: number = ra.clone().cross(this.normal);
			let rbCrossN: number = rb.clone().cross(this.normal);
			let invMassSum: number = this.A.invMass +
				this.B.invMass +
				(raCrossN * raCrossN) * this.A.invInertia +
				(rbCrossN * rbCrossN) * this.B.invInertia;

			// Calculate impulse scalar
			let j: number = -(1.0 + this.e) * contactVel;
			j /= invMassSum;
			j /= this.contactCount;

			// Apply impulse
			let impulse: Vector2D = this.normal.clone().multiplyScalar(j);
			A.applyImpulse(impulse.neg(), ra);
			B.applyImpulse(impulse, rb);

			// Friction impulse
			// rv = B->velocity + Cross( B->angularVelocity, rb ) -
			// A->velocity - Cross( A->angularVelocity, ra );
			rv = B.velocity.add(Vec2.cross(B.angularVelocity, rb, new Vec2())).subi(A.velocity).subi(Vec2.cross(A.angularVelocity, ra, new Vec2()));

			// Vec2 t = rv - (normal * Dot( rv, normal ));
			// t.Normalize( );
			Vec2 t = new Vec2(rv);
			t.addsi(normal, -Vec2.dot(rv, normal));
			t.normalize();

			// j tangent magnitude
			float jt = -Vec2.dot(rv, t);
			jt /= invMassSum;
			jt /= contactCount;

			// Don't apply tiny friction impulses
			if (ImpulseMath.equal(jt, 0.0f)) {
				return;
			}

			// Coulumb's law
			Vec2 tangentImpulse;
			// if(std::abs( jt ) < j * sf)
			if (StrictMath.abs(jt) < j * sf) {
				// tangentImpulse = t * jt;
				tangentImpulse = t.mul(jt);
			}
			else {
				// tangentImpulse = t * -j * df;
				tangentImpulse = t.mul(j).muli(-df);
			}

			// Apply friction impulse
			// A->ApplyImpulse( -tangentImpulse, ra );
			// B->ApplyImpulse( tangentImpulse, rb );
			A.applyImpulse(tangentImpulse.neg(), ra);
			B.applyImpulse(tangentImpulse, rb);
		}
	}

	public void positionalCorrection()
{
	// const real k_slop = 0.05f; // Penetration allowance
	// const real percent = 0.4f; // Penetration percentage to correct
	// Vec2 correction = (std::max( penetration - k_slop, 0.0f ) / (A->im +
	// B->im)) * normal * percent;
	// A->position -= correction * A->im;
	// B->position += correction * B->im;

	float correction = StrictMath.max(penetration - ImpulseMath.PENETRATION_ALLOWANCE, 0.0f) / (A.invMass + B.invMass) * ImpulseMath.PENETRATION_CORRETION;

	A.position.addsi(normal, -A.invMass * correction);
	B.position.addsi(normal, B.invMass * correction);
}

	public void infiniteMassCorrection()
{
	A.velocity.set(0, 0);
	B.velocity.set(0, 0);
}

}