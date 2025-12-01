import Engine from '../Engine.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '../Sprite.ts';
import { canvas, ctx, penCtx } from '../canvas.ts';

export interface CircleOptions extends SpriteOptions {
    radius?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class Circle extends Sprite {

    public discriminant = 'circle';
    public tags = new Set(['circle']);

    public radius: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {
        return {
            x: this.x,
            y: this.y,
            width: this.radius * 2 * this.size,
            height: this.radius * 2 * this.size
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();

        path.ellipse(
            0, 0,
            this.radius * this.size,
            this.radius * this.size,
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

    public create(options?: CircleOptions): this {
        return new Circle(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            radius: this.radius,
            color: this.color,
            outlineColor: this.outlineColor,
            outlineWidth: this.outlineWidth
        };
    }

    public setRadius(radius: number) {
        this.radius = radius;
        this.invalidatePath();
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    constructor(options?: CircleOptions) {
        super(options);

        this.radius = options?.radius ?? 25;
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
        
        this.draw();
    }

}