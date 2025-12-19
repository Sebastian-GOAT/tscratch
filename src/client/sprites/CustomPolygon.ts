import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';
import { canvas, ctx, penCtx } from '@main/canvas.ts';
import type { Vec2 } from '@ctypes/Vectors.ts';
import TSCMath from '@main/TSCMath.ts';
import Engine from '@main/Engine.ts';

export interface CustomPolygonOptions extends SpriteOptions {
    vertices?: Vec2[];
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class CustomPolygon extends Sprite {

    public discriminant = 'custompolygon';
    public tags = new Set(['custompolygon']);

    public vertices: Vec2[];
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {

        const cos = TSCMath.cos(this.dir);
        const sin = TSCMath.sin(this.dir);

        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        if (this.vertices.length === 0) {
            return {
                x: this.x,
                y: this.y,
                width: 0,
                height: 0
            };
        }

        for (const v of this.vertices) {

            // Rotate
            const rx = v[0] * cos - v[1] * sin;
            const ry = v[0] * sin + v[1] * cos;

            // Translate
            const fx = this.x + rx;
            const fy = this.y + ry;

            if (fx < minX) minX = fx;
            if (fx > maxX) maxX = fx;
            if (fy < minY) minY = fy;
            if (fy > maxY) maxY = fy;
        }

        const width = maxX - minX;
        const height = maxY - minY;
        const x = minX + width / 2;
        const y = minY + height / 2;

        return {
            x: x * this.size,
            y: y * this.size,
            width: width * this.size,
            height: height * this.size
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();
        
        if (this.vertices.length < 2) return path;

        const vertices = this.vertices as [Vec2, Vec2, ...Vec2[]];
        const [first, ...rest] = vertices;

        path.moveTo(first[0] * this.size, -first[1] * this.size);
        for (const v of rest) path.lineTo(v[0] * this.size, -v[1] * this.size);

        path.closePath();

        return path;
    }

    public draw(stamping?: true): void {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        c.translate(cX, cY);
        c.rotate(this.toRadians(this.dir));
        c.translate(-this.pivot[0], this.pivot[1]);

        const path = this.getCachedPath();

        c.fillStyle = this.color;
        c.strokeStyle = this.outlineColor;
        c.lineWidth = this.outlineWidth;
        c.fill(path)
        if (this.outlineWidth)
            c.stroke(path);

        c.restore();
    }

    public create(options?: CustomPolygonOptions): this {
        return new CustomPolygon(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            vertices: this.vertices,
            color: this.color,
            outlineColor: this.outlineColor,
            outlineWidth: this.outlineWidth
        };
    }

    public setVertices(vertices: Vec2[]) {
        this.vertices = vertices;
        this.invalidatePath();
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    constructor(options?: CustomPolygonOptions) {
        super(options);

        this.vertices = options?.vertices ?? [];
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;

        this.draw();
    }

}