import Engine from '../Engine.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '../Sprite.ts';
import { canvas, ctx, penCtx } from '../canvas.ts';

export interface ArcOptions extends SpriteOptions {
    radius?: number;
    angle?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class Arc extends Sprite {

    public discriminant = 'arc';
    public tags = new Set(['arc']);

    public radius: number;
    public angle: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {
        return {
            x: this.x,
            y: this.y,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();

        path.arc(
            0, 0,
            this.radius,
            this.toRadians(this.angle / 2 - 90),
            this.toRadians(-this.angle / 2 - 90)
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

    public create(options?: ArcOptions): this {
        return new Arc(options) as this;
    }

    public setRadius(radius: number) {
        this.radius = radius;
        this.invalidatePath();
        this.refresh();
    }

    public setAngle(angle: number) {
        this.angle = angle;
        this.invalidatePath();
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    constructor(options?: ArcOptions) {
        super(options);

        this.radius = options?.radius ?? 25;
        this.angle = options?.angle ?? 270;
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;

        this.draw();
    }

}