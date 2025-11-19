import Sprite, { type BoundingBox, type SpriteOptions } from '../Sprite.ts';
import { canvas, ctx, penCtx } from '../canvas.ts';
import type { Vec2 } from '../types/Vectors.ts';

export interface CustomPolygonOptions extends SpriteOptions {
    vertices?: Vec2[];
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class CustomPolygon extends Sprite {

    public discriminant = 'custompolygon';

    public vertices: Vec2[];
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {

        let furthestVertexSize = 0;

        for (const v of this.vertices) {

            const size = Math.hypot(v[0], v[1]);

            if (size > furthestVertexSize)
                furthestVertexSize = size;
        }

        return {
            x: this.x,
            y: this.y,
            width: furthestVertexSize,
            height: furthestVertexSize
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();
        const vertices = this.vertices;

        if (vertices.length < 2) return path;

        path.moveTo(vertices[0]![0], vertices[0]![1]);

        for (let i = 1; i < vertices.length; i++)
            path.lineTo(vertices[i]![0], vertices[i]![1]);

        path.closePath();

        return path;
    }

    public draw(stamping?: boolean): void {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        c.translate(cX, cY);

        c.rotate(this.toRadians(this.dir));

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