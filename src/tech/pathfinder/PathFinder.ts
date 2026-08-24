import { canvas } from '@main/canvas.ts';
import Sprite from '@main/Sprite.ts';
import Square from '@sprites/Square.ts';
import type { Vec2 } from '@ctypes/Vectors.ts';

export default class PathFinder {

    private obstacles: Sprite[];
    private target: Sprite;
    private tileSize = 50;
    private checking = new Square({ sideLength: this.tileSize, color: 'rgba(255, 255, 255, 0.01)' });
    private maxNodes = (Math.floor(canvas.width / this.tileSize) + 1) * (Math.floor(canvas.height / this.tileSize) + 1);

    // Main BFS method

    public search(startX: number, startY: number): Vec2[] | null {

        const queue: Vec2[] = [[startX, startY]];
        const visited = new Set<string>();
        const parents = new Map<string, string | null>();

        const startKey = `${startX},${startY}`;

        visited.add(startKey);
        parents.set(startKey, null);

        let i = 1;

        while (queue.length > 0 && i <= this.maxNodes) {

            const node = queue.shift()!;
            const [x, y] = node;
            const nodeKey = `${x},${y}`;

            this.checking.goTo(x, y);

            // Can't walk through an obstacle
            if (this.isColliding()) continue;

            // Reached the target
            if (this.checking.touching(this.target))
                return this.buildPath(nodeKey, parents);

            const size = this.tileSize;

            const neighbors: Vec2[] = [
                [x, y + size],
                [x + size, y],
                [x, y - size],
                [x - size, y]
            ];

            for (const neighbor of neighbors) {

                const [nx, ny] = neighbor;
                const key = `${nx},${ny}`;

                if (!this.isInBounds(nx, ny) || visited.has(key))
                    continue;

                visited.add(key);
                parents.set(key, nodeKey);
                queue.push(neighbor);

                i++;
            }
        }

        return null;
    }

    private buildPath(endKey: string, parents: Map<string, string | null>): Vec2[] {

        const path: Vec2[] = [];
        let current: string | null = endKey;

        while (current) {
            const [x, y] = current.split(',').map(Number) as [number, number];
            path.unshift([x, y]);
            current = parents.get(current) ?? null;
        }

        return path;
    }

    private isInBounds(x: number, y: number) {
        return (
            x >= -canvas.width / 2 &&
            x <= canvas.width / 2 &&
            y >= -canvas.height / 2 &&
            y <= canvas.height / 2
        );
    }

    private isColliding() {
        for (const obstacle of this.obstacles)
            if (this.checking.touching(obstacle)) return true;

        return false;
    }

    // Setters

    public setTileSize(tileSize: number) {
        this.tileSize = tileSize;
        this.checking.setSideLength(tileSize);
        this.maxNodes = (Math.floor(canvas.width / tileSize) + 1) * (Math.floor(canvas.height / tileSize) + 1);
    }
    public setObstacles(obstacles: Sprite[]) {
        this.obstacles = obstacles;
    }
    public setTarget(target: Sprite) {
        this.target = target;
    }

    constructor(target: Sprite, obstacles?: Sprite[]) {
        this.target = target;
        this.obstacles = obstacles ?? [];
    }
}