import Sprite, { type BoundingBox, type SpriteOptions } from '../Sprite.ts';
import { canvas, ctx, penCtx } from '../canvas.ts';

export interface OvalOptions extends SpriteOptions {
    radX?: number;
    radY?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class Oval extends Sprite {

    public discriminant = 'circle';

    public radX: number;
    public radY: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {
        return {
            x: this.x,
            y: this.y,
            width: Math.hypot(this.radX * 2, this.radY * 2),
            height: Math.hypot(this.radX * 2, this.radY * 2)
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();

        path.ellipse(
            0, 0,
            this.radX,
            this.radY,
            0, 0,
            Math.PI * 2
        );

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

    public setRadX(radX: number) {
        this.radX = radX;
        this.invalidatePath();
        this.refresh();
    }

    public setRadY(radY: number) {
        this.radY = radY;
        this.invalidatePath();
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    constructor(options?: OvalOptions) {
        super(options);
        this.radX = options?.radX ?? 25;
        this.radY = options?.radY ?? 25;
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
        this.draw();
    }

}