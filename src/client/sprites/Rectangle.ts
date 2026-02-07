import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';
import { ctx, canvas, penCtx } from '@main/canvas.ts';
import TSCMath from '@main/TSCMath.ts';

export interface RectangleOptions extends SpriteOptions {
    width?: number;
    height?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class Rectangle extends Sprite {

    public discriminant = 'rectangle';
    public tags = new Set(['rectangle']);

    public width: number;
    public height: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {

        const w = this.width / 2;   // half-width
        const h = this.height / 2;  // half-height

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
        const path = new Path2D();

        path.rect(
            -this.width / 2 * this.size,
            -this.height / 2 * this.size,
            this.width * this.size,
            this.height * this.size
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
        c.strokeStyle = this.outlineColor;
        c.lineWidth = this.outlineWidth;
        c.fill(path)
        if (this.outlineWidth)
            c.stroke(path);

        c.restore();
    }

    public create(options?: RectangleOptions): this {
        return new Rectangle(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            width: this.width,
            height: this.height,
            color: this.color,
            outlineColor: this.outlineColor,
            outlineWidth: this.outlineWidth
        };
    }

    public setWidth(width: number) {
        this.width = width;
        this.invalidatePath();
        this.refresh();
    }

    public setHeight(height: number) {
        this.height = height;
        this.invalidatePath();
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    constructor(options?: RectangleOptions) {
        super(options);

        this.width = options?.width ?? 50;
        this.height = options?.height ?? 50;
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
        
        this.draw();
    }

}