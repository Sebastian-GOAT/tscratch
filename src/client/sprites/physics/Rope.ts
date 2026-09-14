import type { Vec2 } from '@ctypes/Vectors.ts';
import type Sprite from '@main/Sprite.ts';
import Pen, { type PenOptions } from '@sprites/Pen.ts';

export interface RopeOptions {
    length: number;
    pointCount: number;
    lockStart: Vec2;
    lockEnd: Vec2;
    gravity: number;

    penOptions: PenOptions;
}

export default class Rope {

    private pen: Pen;

    public points: Vec2[];
    public prevPoints: Vec2[];
    public length: number;
    public lockStart: Vec2 | null;
    public lockEnd: Vec2 | null;
    public gravity: number;

    private attachedSprite: Sprite | null = null;

    public update() {
        const { gravity } = this;
        const iterations = 1.5 * this.points.length;

        // 1. Apply gravity and calculate velocity using your exact array indexing
        for (let i = 0; i < this.points.length; i++) {
            if (this.isLocked(i)) continue;

            // Calculate velocity vector: current minus previous
            const vx = this.points[i]![0] - this.prevPoints[i]![0];
            const vy = this.points[i]![1] - this.prevPoints[i]![1];

            // Save current position to the previous array
            this.prevPoints[i]![0] = this.points[i]![0];
            this.prevPoints[i]![1] = this.points[i]![1];

            // Move current position forward by velocity + gravity acceleration
            this.points[i]![0] += vx;
            this.points[i]![1] += vy + gravity;
        }

        // 2. Tie the links together (Constraint Step)
        for (let j = 0; j < iterations; j++) {
            for (let i = 0; i < this.points.length - 1; i++) {
                
                // Vector distance math between point i and point i+1
                const dx = this.points[i + 1]![0] - this.points[i]![0];
                const dy = this.points[i + 1]![1] - this.points[i]![1];
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance === 0) continue;

                const error = this.length / (this.points.length - 1) - distance;
                const percentage = (error / distance) * 0.5;
                
                const offsetX = dx * percentage;
                const offsetY = dy * percentage;

                // Adjust positions using array coordinates directly
                if (!this.isLocked(i)) {
                    this.points[i]![0] -= offsetX;
                    this.points[i]![1] -= offsetY;
                }
                if (!this.isLocked(i + 1)) {
                    this.points[i + 1]![0] += offsetX;
                    this.points[i + 1]![1] += offsetY;
                }
            }
        }

        // Attach the sprite
        const last = this.points[this.points.length - 1]!;
        this.attachedSprite?.goTo(...last);

        // 3. Draw the rope
        this.draw();
    }

    private isLocked(index: number) {
        return (index === 0 && this.lockStart !== null) ||
            (index === this.points.length - 1 && this.lockEnd !== null);
    }

    private limitEndpointDistance(start: Vec2 | null, end: Vec2): Vec2;
    private limitEndpointDistance(start: Vec2 | null, end: Vec2 | null): Vec2 | null;
    private limitEndpointDistance(start: Vec2 | null, end: Vec2 | null): Vec2 | null {
        if (start === null || end === null) return end;

        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.length || distance === 0) return end;

        return [
            start[0] + dx * this.length / distance,
            start[1] + dy * this.length / distance
        ];
    }

    private setEndpointPoint(index: number, position: Vec2) {
        if (this.points.length === 0) return;

        this.points[index] = [...position];
        this.prevPoints[index] = [...position];
    }

    // Attach a sprite to the end
    public attachSprite(sprite: Sprite) {
        this.attachedSprite = sprite;
    }

    // Setters
    public setLength(length: number) {
        this.length = length;
    }

    public setLockStart(position: Vec2) {
        this.lockStart = this.limitEndpointDistance(this.lockEnd, position);
        this.setEndpointPoint(0, this.lockStart);
    }

    public setLockEnd(position: Vec2 | null) {
        this.lockEnd = this.limitEndpointDistance(this.lockStart, position);
        if (this.lockEnd !== null)
            this.setEndpointPoint(this.points.length - 1, this.lockEnd);
    }

    // Draw method
    private draw() {
        const first = this.points[0]!;

        this.pen.goTo(first[0], first[1]);
        this.pen.down();

        for (const point of this.points) {
            this.pen.goTo(point[0], point[1])
        }

        this.pen.up();
    }

    // Initialization
    constructor(options?: Partial<RopeOptions>) {

        this.pen = new Pen(options?.penOptions);

        this.gravity = options?.gravity ?? -2;
        this.length = options?.length ?? 150;
        this.lockStart = options?.lockStart ?? [0, 0];
        this.lockEnd = null;
        this.setLockEnd(options?.lockEnd ?? null);
        this.points = [];

        const count = options?.pointCount ?? 25;
        const start: Vec2 = this.lockStart ?? [0, 0];
        const end: Vec2 = this.lockEnd ?? [0, -this.length];

        for (let i = 0; i < count; i++) {
            const progress = i / (count - 1);
            this.points.push([
                start[0] + (end[0] - start[0]) * progress,
                start[1] + (end[1] - start[1]) * progress
            ]);
        }

        this.prevPoints = this.points.map(p => [...p]);
        
        this.update();
        this.draw();
    }
}