import type { Vec3 } from '../../../../types/Vectors.ts';

export default function getCuboidVertices(width: number, height: number, length: number): Vec3[] {

    return [
        // Bottom
        [-0.5 * width, -0.5 * height, -0.5 * length],
        [0.5 * width, -0.5 * height, -0.5 * length],
        [0.5 * width, -0.5 * height, 0.5 * length],
        [-0.5 * width, -0.5 * height, 0.5 * length],
        // Top
        [-0.5 * width, 0.5 * height, -0.5 * length],
        [0.5 * width, 0.5 * height, -0.5 * length],
        [0.5 * width, 0.5 * height, 0.5 * length],
        [-0.5 * width, 0.5 * height, 0.5 * length]
    ];
}