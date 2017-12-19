// tslint:disable:comment-format
import { Manifold } from "./Manifold";
import { Body } from "./Body";
import { EnhancedArray } from "../../Utils/Array";
import { IPhysicalShape } from "./PhysicalShape";
import { ImpulseMath } from "./ImpulseMath";
import { Logger } from "../../Utils/Logger";

export class PhysicsEngine {

	public dt: number;
	public iterations: number;
	public bodies: EnhancedArray<Body> = new EnhancedArray<Body>();
	public contacts: EnhancedArray<Manifold> = new EnhancedArray<Manifold>();

	constructor(dt: number, iterations: number) {
		this.dt = dt;
		this.iterations = iterations;
	}

	public step(): void {
		// Generate new collision info
		this.contacts.clear();
		for (let i: number = 0; i < this.bodies.size; ++i) {
			let A: Body = this.bodies[i];

			for (let j: number = i + 1; j < this.bodies.size; ++j) {
				let B: Body = this.bodies[j];

				if (A.invMass === 0 && B.invMass === 0) {
					continue;
				}

				let m: Manifold = new Manifold(A, B);
				m.solve();

				if (m.contactCount > 0) {
					this.contacts.add(m);
				}
			}
		}

		// Integrate forces
		for (let i: number = 0; i < this.bodies.size; ++i) {
			this.integrateForces(this.bodies[i], this.dt);
		}

		// Initialize collision
		for (let i: number = 0; i < this.contacts.size; ++i) {
			this.contacts[i].initialize();
		}

		// Solve collisions
		for (let j: number = 0; j < this.iterations; ++j) {
			for (let i: number = 0; i < this.contacts.size; ++i) {
				this.contacts[i].applyImpulse();
			}
		}

		// Integrate velocities
		for (let i: number = 0; i < this.bodies.size; i++) {
			this.integrateVelocity(this.bodies[i], this.dt);
		}

		// Correct positions
		for (let i: number = 0; i < this.contacts.size; ++i) {
			this.contacts[i].positionalCorrection();
		}

		// Clear all forces
		for (let i: number = 0; i < this.bodies.size; ++i) {
			let b: Body = this.bodies[i];
			b.force.set(0, 0);
			b.torque = 0;
		}
	}

	public add(shape: IPhysicalShape, x: number, y: number): Body {
		return this.bodies.add(new Body(shape, x, y));
	}

	public remove(body: Body): void {
		this.bodies.removeAt(this.bodies.indexOf(body));
	}

	public clear(): void {
		this.contacts.clear();
		this.bodies.clear();
	}

	// Acceleration
	// F = mA
	// => A = F * 1/m

	// Explicit Euler
	// x += v * dt
	// v += (1/m * F) * dt

	// Semi-Implicit (Symplectic) Euler
	// v += (1/m * F) * dt
	// x += v * dt

	// see http://www.niksula.hut.fi/~hkankaan/Homepages/gravity.html
	public integrateForces(b: Body, dt: number): void {
		//		if(b->im == 0.0f)
		//			return;
		//		b->velocity += (b->force * b->im + gravity) * (dt / 2.0f);
		//		b->angularVelocity += b->torque * b->iI * (dt / 2.0f);

		if (b.invMass === 0.0) {
			return;
		}

		let dts: number = dt * 0.5;

		b.velocity.addVectorWithScalar(b.force, b.invMass * dts);
		b.velocity.addVectorWithScalar(ImpulseMath.GRAVITY, dts);
		b.angularVelocity += b.torque * b.invInertia * dts;
	}

	public integrateVelocity(b: Body, dt: number): void {
		//		if(b->im == 0.0f)
		//			return;
		//		b->position += b->velocity * dt;
		//		b->orient += b->angularVelocity * dt;
		//		b->SetOrient( b->orient );
		//		IntegrateForces( b, dt );

		if (b.invMass === 0.0) {
			return;
		}
		b.position.addVectorWithScalar(b.velocity, dt);
		b.orient += b.angularVelocity * dt;
		b.setOrient(b.orient);

		this.integrateForces(b, dt);
	}

}