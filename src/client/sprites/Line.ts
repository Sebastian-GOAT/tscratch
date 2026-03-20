import { canvas, ctx, penCtx } from '@main/canvas.ts';
import Sprite, { type SpriteOptions } from '@main/Sprite.ts';
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

    public getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.length * Math.abs(TSCMath.sin(this.dir)),
            height: this.length * Math.abs(TSCMath.cos(this.dir))
        };
    }

    public getPath(): Path2D {
        const path = new Path2D;

        path.rect(
            -this.width,
            -this.length / 2,
            this.width * 2, this.length
        );

        return path;
    }

    public draw(stamping?: true): void {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        c.translate(cX, cY);
        c.rotate(this.toRadians(this.dir));
        c.translate(-this.pivot[0] * this.size, this.pivot[1] * this.size);

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
        this.length = options?.length ?? 50;
        this.width = options?.width ?? 4;

        this.draw();
    }
}