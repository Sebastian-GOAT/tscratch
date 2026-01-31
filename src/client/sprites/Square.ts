import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';
import { ctx, canvas, penCtx } from '@main/canvas.ts';
import TSCMath from '@main/TSCMath.ts';

export interface SquareOptions extends SpriteOptions {
    sideLength?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class Square extends Sprite {

    public discriminant = 'square';
    public tags = new Set(['square']);

    public sideLength: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {

        const s = this.sideLength / 2;

        const cos = TSCMath.cos(this.dir);
        const sin = TSCMath.sin(this.dir);

        const size  = 2 * (Math.abs(s * cos) + Math.abs(s * sin)) * this.size;

        return {
            x: this.x,
            y: this.y,
            width: size,
            height: size
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();

        path.rect(
            -this.sideLength / 2 * this.size,
            -this.sideLength / 2 * this.size,
            this.sideLength * this.size,
            this.sideLength * this.size
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

    public create(options?: SquareOptions): this {
        return new Square(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            sideLength: this.sideLength,
            color: this.color,
            outlineColor: this.outlineColor,
            outlineWidth: this.outlineWidth
        };
    }

    public setSideLength(sideLength: number) {
        this.sideLength = sideLength;
        this.invalidatePath();
        this.invalidateBoundingBox();
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    constructor(options?: SquareOptions) {
        super(options);
        this.sideLength = options?.sideLength ?? 50;
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
        this.draw();
    }

}