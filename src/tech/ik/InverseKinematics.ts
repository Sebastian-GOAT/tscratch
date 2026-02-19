import TSCMath from '@main/TSCMath.ts';
import type { Vec2 } from '@ctypes/Vectors.ts';

export default class InverseKinematics {

    public links: [number, number, ...number[]];
    public angles: [number, number, ...number[]];
    public target: Vec2;

    constructor(links: [number, number, ...number[]], target: Vec2) {
        this.links = links;
        this.target = target;
        this.angles = links.map(() => 0) as typeof this.angles;
    }

    // Angle getter
    public getAngles() {
        let cumulative = 0;

        return this.angles.map(a => {
            cumulative += a;
            return 90 - TSCMath.toDegrees(cumulative); // World space
        });
    }

    // Vertex getter
    public getPoints(): Vec2[] {

        let x = 0;
        let y = 0;

        const points: Vec2[] = [];

        for (let i = 0; i < this.links.length; i++) {

            let theta = 0;

            for (let j = 0; j <= i; j++)
                theta += this.angles[j]!;

            x += this.links[i]! * Math.cos(theta);
            y += this.links[i]! * Math.sin(theta);
            points.push([x, y]);
        }

        return points;
    }

    // -------------------
    // Calculations
    // -------------------

    // Dot product helper
    private static dot(v1: number[], v2: number[]): number {
        let s = 0;

        for (let i = 0; i < v1.length; i++)
            s += v1[i]! * v2[i]!;

        return s;
    }

    // Full camputation
    public computeApproximateAngles(iterations: number, error: number, adjustmentRate = 0.25) {

        // If the point is out of reach, the best we can do, is fully extend in that direction
        if (TSCMath.magnitude(this.target) >= this.links.reduce((a, b) => a + b, 0)) {

            const targetAngle = Math.atan2(this.target[1], this.target[0]);
            this.angles[0] = targetAngle;

            for (let i = 1; i < this.angles.length; i++)
                this.angles[i] = 0;

            return;
        }

        // Compute
        this.angles = Array(this.links.length).fill(0) as typeof this.angles;

        for (let i = 0; i < iterations; i++) {

            this.updateAngles(adjustmentRate);
            if (TSCMath.magnitude(this.computeError()) < error) return;
        }
    }

    // Forward kinematics
    private forwardKinematicsPass(): Vec2 {
        const points = this.getPoints();
        return points[points.length - 1]!;
    }

    // Error vector
    private computeError(): Vec2 {
        const [x, y] = this.forwardKinematicsPass();
        return [this.target[0] - x, this.target[1] - y];
    }

    // Jacobian
    private computeJacobian(): [number[], number[]] {

        const J: [number[], number[]] = [[], []];

        for (let k = 0; k < this.angles.length; k++) {
            let dx = 0;
            let dy = 0;

            for (let i = k; i < this.links.length; i++) {

                let theta = 0;
                for (let j = 0; j <= i; j++)
                    theta += this.angles[j]!;

                dx += -this.links[i]! * Math.sin(theta);
                dy += this.links[i]! * Math.cos(theta);
            }

            J[0].push(dx);
            J[1].push(dy);
        }

        return J;
    }

    // Pseudoinverse
    private computePseudoinverse(): Vec2[] {

        const J = this.computeJacobian();

        const transpose: Vec2[] = [];
        for (let i = 0; i < J[0].length; i++)
            transpose.push([J[0][i]!, J[1][i]!]);

        const v1_a = J[0];
        const v1_b = J[1];

        const v2_a: number[] = [];
        const v2_b: number[] = [];

        for (let i = 0; i < transpose.length; i++) {
            v2_a.push(transpose[i]![0]);
            v2_b.push(transpose[i]![1]);
        }

        const product: [Vec2, Vec2] = [
            [InverseKinematics.dot(v1_a, v2_a), InverseKinematics.dot(v1_a, v2_b)],
            [InverseKinematics.dot(v1_b, v2_a), InverseKinematics.dot(v1_b, v2_b)]
        ];

        const lam = 0.01;
        const a = product[0][0] + lam;
        const b = product[0][1];
        const c = product[1][0];
        const d = product[1][1] + lam;

        const det = a * d - b * c;
        const mul = 1 / det;

        const inverse: [Vec2, Vec2] = [
            [d * mul, -b * mul],
            [-c * mul, a * mul]
        ];

        const v2_a_vec = inverse[0];
        const v2_b_vec = inverse[1];

        const result: Vec2[] = [];
        for (const v1 of transpose) {
            result.push([
                InverseKinematics.dot(v1, v2_a_vec),
                InverseKinematics.dot(v1, v2_b_vec)
            ]);
        }

        return result;
    }

    // Compute joint updates
    private computeJointUpdate(): number[] {

        const err = this.computeError();
        const result: number[] = [];

        for (const row of this.computePseudoinverse())
            result.push(InverseKinematics.dot(err, row));
        
        return result;
    }

    // Update angles
    private updateAngles(adjustmentRate: number): void {

        const delta = this.computeJointUpdate();

        for (let i = 0; i < this.angles.length; i++)
            this.angles[i]! += delta[i]! * adjustmentRate;
    }
}