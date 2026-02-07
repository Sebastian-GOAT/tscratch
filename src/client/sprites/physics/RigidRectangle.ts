import Rectangle, { type RectangleOptions } from '@sprites/Rectangle.ts';
import type { RigidBody, RigidBodyOptions } from './RigidBody.ts';
import type { Vec2 } from '@ctypes/Vectors.ts';
import TSCMath from '@main/TSCMath.ts';

export interface RigidRectangleOptions extends RectangleOptions, Partial<RigidBodyOptions> {}

export default class RigidRectangle extends Rectangle implements RigidBodyOptions {

    public tags = new Set(['rectangle', 'rigidbody']);

    public obstacles: RigidBody[];

    public isStatic: boolean;

    public gravity: number;
    public drag: number;
    public bounceLoss: number;
    public velocity: Vec2;
    public angularVelocity: number;
    public inertia: number;

    public addObstacles(...obstacles: RigidBody[]) {
        this.obstacles.push(...obstacles);
    }

    public update(stepFactor = 1): void {

        if (this.isStatic) return;
        
        // 1. Apply Basic Forces
        this.velocity[1] += this.gravity * stepFactor;
        this.velocity[0] *= this.drag;
        this.velocity[1] *= this.drag;

        // 2. Integration (Movement)
        this.changeX(this.velocity[0] * stepFactor);
        this.changeY(this.velocity[1] * stepFactor);
        this.turn(-TSCMath.toDegrees(this.angularVelocity) * stepFactor);

        // 3. Collision Detection & Resolution
        for (const target of this.obstacles) {

            const collisionData = this.touching(target);

            if (collisionData) {
                const { contact, normal, displacement } = collisionData;

                // --- POSITIONAL CORRECTION (Anti-clipping) ---
                const slop = 0.05; // Allowance to prevent jitter
                const distance = Math.max(displacement - slop, 0);

                // If target is static, 'this' moves the full distance.
                // If target is dynamic, we only move 'this' to avoid the "double-push" 
                // that happens when both objects run their update loops.
                const ratio = target.isStatic ? 1.0 : 0.5;

                const pushX = normal[0] * distance * ratio;
                const pushY = normal[1] * distance * ratio;

                this.changeX(pushX);
                this.changeY(pushY);
                
                if (!target.isStatic) {
                    target.changeX(-pushX);
                    target.changeY(-pushY);
                }

                // --- IMPULSE SETUP ---
                const r1: Vec2 = [contact[0] - this.x, contact[1] - this.y];
                const r2: Vec2 = [contact[0] - target.x, contact[1] - target.y];

                // Velocity at the exact point of contact
                const v1: Vec2 = [
                    this.velocity[0] - this.angularVelocity * r1[1],
                    this.velocity[1] + this.angularVelocity * r1[0]
                ];
                
                const targetVel = target.velocity;
                const targetAV = target.angularVelocity;
                
                const v2: Vec2 = [
                    targetVel[0] - targetAV * r2[1],
                    targetVel[1] + targetAV * r2[0]
                ];

                const relVel: Vec2 = [v1[0] - v2[0], v1[1] - v2[1]];
                const velAlongNormal = relVel[0] * normal[0] + relVel[1] * normal[1];

                // Only resolve if objects are moving towards each other
                if (velAlongNormal < 0) {
                    const friction = 0.3;

                    // --- NORMAL IMPULSE ---
                    const r1n = r1[0] * normal[1] - r1[1] * normal[0];
                    const r2n = r2[0] * normal[1] - r2[1] * normal[0];
                    
                    // Proper inverse mass calculation
                    const invMass1 = 1;
                    const invMass2 = target.isStatic ? 0 : 1;
                    const r1nSq = r1n * r1n;
                    const r2nSq = r2n * r2n;
                    
                    const invMassSum = invMass1 + invMass2 + (r1nSq / this.inertia) + (target.isStatic ? 0 : r2nSq / target.inertia);
                    
                    const j = -(1 + this.bounceLoss) * velAlongNormal / invMassSum;
                    const impulse: Vec2 = [normal[0] * j, normal[1] * j];

                    // --- TANGENT IMPULSE ---
                    const tangent: Vec2 = [-normal[1], normal[0]];
                    const velAlongTangent = relVel[0] * tangent[0] + relVel[1] * tangent[1];
                    
                    const r1t = r1[0] * tangent[1] - r1[1] * tangent[0];
                    const r2t = r2[0] * tangent[1] - r2[1] * tangent[0];
                    const r1tSq = r1t * r1t;
                    const r2tSq = r2t * r2t;
                    
                    const invMassSumT = invMass1 + invMass2 + (r1tSq / this.inertia) + (target.isStatic ? 0 : r2tSq / target.inertia);
                    
                    const jt = -velAlongTangent * friction / invMassSumT;
                    const fImpulse: Vec2 = [tangent[0] * jt, tangent[1] * jt];

                    const totalImpX = impulse[0] + fImpulse[0];
                    const totalImpY = impulse[1] + fImpulse[1];

                    // Update Self
                    this.velocity[0] += totalImpX;
                    this.velocity[1] += totalImpY;
                    this.angularVelocity += (r1[0] * totalImpY - r1[1] * totalImpX) / this.inertia;

                    // Update Obstacle only if NOT static
                    if (!target.isStatic) {
                        target.velocity[0] -= totalImpX;
                        target.velocity[1] -= totalImpY;
                        target.angularVelocity -= (r2[0] * totalImpY - r2[1] * totalImpX) / target.inertia;
                    }
                }
            }
        }

        // 4. Apply Drag (velocity dampening)
        this.velocity[0] *= this.drag;
        this.velocity[1] *= this.drag;
        this.angularVelocity *= this.drag;
    }

    constructor(options?: RigidRectangleOptions) {
        super(options);

        this.obstacles = options?.obstacles ?? [];

        this.isStatic = options?.isStatic ?? false;

        this.gravity = options?.gravity ?? -1.8;
        this.drag = options?.drag ?? 0.96;
        this.bounceLoss = options?.bounceLoss ?? 0.92;
        this.velocity = options?.velocity ?? [0, 0];
        this.angularVelocity = options?.angularVelocity ?? 0;
        this.inertia = options?.inertia ?? 700;

        this.invalidatePath();
    }
}