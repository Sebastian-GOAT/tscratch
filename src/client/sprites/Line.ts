import { ctx, penCtx } from '@main/canvas.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';
import TSCMath from '@main/TSCMath.ts';

export interface LineOptions extends SpriteOptions {
    color?: string;
    length?: number;
    width?: number;
}

export default class Line extends Sprite {

    public discriminant = 'line';
    public tags = new Set(['line']);

    public color: string;
    public length: number;
    public width: number;

    public getBoundingBox(): BoundingBox {

        const w = this.width / 2;   // half-width
        const h = this.length / 2;  // half-height

        const cos = TSCMath.cos(this.dir);
        const sin = TSCMath.sin(this.dir);

        const width  = 2 * (Math.abs(w * cos) + Math.abs(h * sin)) * this.size;
        const height = 2 * (Math.abs(w * sin) + Math.abs(h * cos)) * this.size;

        const off = this.getDrawOffset();

        return {
            x: this.x + off[0],
            y: this.y + off[1],
            width, height
        };
    }

    public getPath(): Path2D {
        const path = new Path2D;

        path.rect(
            -this.width / 2 * this.size,
            -this.length / 2 * this.size,
            this.width * this.size,
            this.length * this.size
        );

        return path;
    }

    public draw(stamping?: true): void {
        const c = stamping ? penCtx : ctx;

        c.save();

        this.applyDrawTransform(c);

        const path = this.getCachedPath();

        c.fillStyle = this.color;
        c.fill(path);

        c.restore();
    }

    public create(options?: LineOptions): this {
        return new Line(options) as this;
    }

    protected getCreateOptions(): LineOptions {
        return {
            ...super.getCreateOptions(),
            color: this.color,
            length: this.length,
            width: this.width
        };
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    public setLength(length: number) {
        this.length = length;
        this.invalidatePath();
        this.refresh();
    }

    public setWidth(width: number) {
        this.width = width;
        this.invalidatePath();
        this.refresh();
    }

    constructor(options?: LineOptions) {
        super(options);

        this.color = options?.color ?? 'black';
        this.length = options?.length ?? 75;
        this.width = options?.width ?? 2;
        if (options?.tags)
            this.tags = new Set([...this.tags, ...options.tags]);

        if (!this.hidden) this.draw();
    }
}