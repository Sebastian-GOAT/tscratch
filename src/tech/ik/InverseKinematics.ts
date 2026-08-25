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
    public getAngles(): number[] {
        let cumulative = 0;

        return this.angles.map(a => {
            cumulative += a;
            return TSCMath.toDegrees(cumulative);
        });
    }

    // Point getter
    public getPoints(): Vec2[] {
        let x = 0;
        let y = 0;

        const points: Vec2[] = [];
        let cumulativeTheta = 0;

        for (let i = 0; i < this.links.length; i++) {
            cumulativeTheta += this.angles[i]!;
            x += this.links[i]! * Math.sin(cumulativeTheta);
            y += this.links[i]! * Math.cos(cumulativeTheta);
            points.push([x, y]);
        }

        return points;
    }

    // Target setter
    public setTarget(x: number, y: number) {
        this.target = [x, y];
    }

    // -------------------
    // FABRIK Algorithm
    // -------------------

    public computeApproximateAngles(iterations: number, error: number) {
        const totalLength = this.links.reduce((a, b) => a + b, 0);

        // Out of reach: fully extend directly toward target in Scratch space
        if (TSCMath.magnitude(this.target) >= totalLength) {
            // In Scratch space, angle to (x, y) is atan2(x, y)
            const targetAngle = Math.atan2(this.target[0], this.target[1]);
            this.angles[0] = targetAngle;
            for (let i = 1; i < this.angles.length; i++) {
                this.angles[i] = 0;
            }
            return;
        }

        // Initialize positions: origin [0,0] + end points of each link
        let workingPoints: Vec2[] = [[0, 0], ...this.getPoints()];

        for (let iteration = 0; iteration < iterations; iteration++) {
            const endEffector = workingPoints[workingPoints.length - 1]!;
            const distToTarget = Math.hypot(
                this.target[0] - endEffector[0],
                this.target[1] - endEffector[1]
            );

            if (distToTarget < error) break;

            // Forward Pass: Move end effector to target
            workingPoints[workingPoints.length - 1] = [...this.target];

            for (let i = workingPoints.length - 2; i >= 0; i--) {
                const current = workingPoints[i]!;
                const next = workingPoints[i + 1]!;
                const distance = this.links[i]!;

                const dx = current[0] - next[0];
                const dy = current[1] - next[1];
                const mag = Math.hypot(dx, dy);

                if (mag > 1e-6) {
                    workingPoints[i] = [
                        next[0] + (dx / mag) * distance,
                        next[1] + (dy / mag) * distance
                    ];
                }
            }

            // Backward Pass: Root fixed at [0, 0]
            workingPoints[0] = [0, 0];

            for (let i = 0; i < workingPoints.length - 1; i++) {
                const current = workingPoints[i]!;
                const next = workingPoints[i + 1]!;
                const distance = this.links[i]!;

                const dx = next[0] - current[0];
                const dy = next[1] - current[1];
                const mag = Math.hypot(dx, dy);

                if (mag > 1e-6) {
                    workingPoints[i + 1] = [
                        current[0] + (dx / mag) * distance,
                        current[1] + (dy / mag) * distance
                    ];
                }
            }
        }

        // Extract Scratch joint angles from final solved positions
        this.updateAnglesFromPoints(workingPoints);
    }

    private updateAnglesFromPoints(points: Vec2[]): void {
        let prevWorldAngle = 0;

        for (let i = 0; i < this.links.length; i++) {
            const pStart = points[i]!;
            const pEnd = points[i + 1]!;

            const dx = pEnd[0] - pStart[0];
            const dy = pEnd[1] - pStart[1];

            // Scratch angle from (dx, dy): atan2(dx, dy)
            const worldAngle = Math.atan2(dx, dy);

            // Local angle delta relative to previous link
            let delta = worldAngle - prevWorldAngle;

            // Normalize delta to [-π, π]
            delta = Math.atan2(Math.sin(delta), Math.cos(delta));

            this.angles[i] = delta;
            prevWorldAngle = worldAngle;
        }
    }
}