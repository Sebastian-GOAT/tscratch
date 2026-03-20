import { describe, it, expect } from 'vitest';
import InverseKinematics from '@tech/ik/InverseKinematics.ts';
import testRange from './range.ts';
import TSCMath from '@main/TSCMath.ts';
import type { Vec2 } from '@ctypes/Vectors.ts';

describe('Inverse Kinematics', () => {

    it('2-link IK angles', () => {
        for (let i = 0; i < testRange; i++) {

            const L = TSCMath.pickRandom(1, 20);
            const target: Vec2 = [TSCMath.pickRandom(1, L), TSCMath.pickRandom(1, L)];
            const ik = new InverseKinematics([L, L], target);
    
            // Compute with IK
            ik.computeApproximateAngles(1000, 0.001);
    
            const points = ik.getPoints();
            const endPoint = points[points.length - 1]!;
    
            expect(endPoint[0]).toBeCloseTo(target[0]);
            expect(endPoint[1]).toBeCloseTo(target[1]);
        } 
    });

    it('2-link IK points', () => {
        for (let i = 0; i < testRange; i++) {

            const L = TSCMath.pickRandom(1, 20);
            const target: Vec2 = [TSCMath.pickRandom(1, L), TSCMath.pickRandom(1, L)];
            const ik = new InverseKinematics([L, L], target);
    
            // Analytical calculation
            const r = Math.sqrt(target[0] ** 2 + target[1] ** 2);
            const cos_beta = (r ** 2 - L ** 2 - L ** 2) / (2 * L * L);
            const beta = Math.acos(cos_beta);
            const alpha = Math.atan2(target[1], target[0]) - Math.atan2(L * Math.sin(beta), L + L * Math.cos(beta));
    
            // Set angles manually
            ik.angles[0] = alpha;
            ik.angles[1] = beta;
    
            const points = ik.getPoints();
            const endPoint = points[points.length - 1]!;
    
            expect(endPoint[0]).toBeCloseTo(target[0], 3);
            expect(endPoint[1]).toBeCloseTo(target[1], 3);
        }
    });
});