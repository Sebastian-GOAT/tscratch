import { canvas } from '@main/canvas.ts';
import Sprite from '@main/Sprite.ts';
import Square from '@sprites/Square.ts';
import type { Vec2 } from '@ctypes/Vectors.ts';

export default class PathFinder {

    private obstacles: Sprite[];
    private target: Sprite;
    private tileSize = 50;
    private checking = new Square({ sideLength: this.tileSize, color: 'transparent' });
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

            // Current node
            const node = queue.shift()!;
            const [x, y] = node;
            const nodeKey = `${x},${y}`;

            this.checking.goTo(x, y);
            if (this.isColliding()) continue;
            if (this.checking.touching(this.target)) return this.buildPath(nodeKey, parents);

            // Neighbors

            const size = this.tileSize;
            const n1: Vec2 = [x, y + size];
            const n2: Vec2 = [x + size, y];
            const n3: Vec2 = [x, y - size];
            const n4: Vec2 = [x - size, y];

            for (const neighbor of [n1, n2, n3, n4]) {

                const key = `${neighbor[0]},${neighbor[1]}`;
                if (!this.isInBounds(neighbor[0], neighbor[1]) || visited.has(key)) continue;

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
        return x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height;
    }

    private isColliding() {
        for (const obstacle of this.obstacles)
            if (this.checking.touching(obstacle)) return true;

        return false;
    }

    // Setters

    public setTileSize(tileSize: number) {
        this.tileSize = tileSize;
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