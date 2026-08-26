import { ctx, penCtx } from '@main/canvas.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';

export interface RegularPolygonOptions extends SpriteOptions {
    sides?: number;
    radius?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
}

export default class RegularPolygon extends Sprite {

    public discriminant = 'regularpolygon';
    public tags = new Set(['regularpolygon']);

    public sides: number;
    public radius: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {
        const off = this.getDrawOffset();
        return {
            x: this.x + off[0],
            y: this.y + off[1],
            width: this.radius * 2 * this.size,
            height: this.radius * 2 * this.size
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();

        path.moveTo(0, -(this.radius * this.size));

        for (let k = 1; k < this.sides; k++) {
            const theta = (2 * k * Math.PI) / this.sides - (Math.PI / 2);
            path.lineTo(
                this.radius * Math.cos(theta) * this.size,
                this.radius * Math.sin(theta) * this.size
            );
        }

        path.closePath();
        return path;
    }

    public draw(stamping?: true) {
        const c = stamping ? penCtx : ctx;

        c.save();

        this.applyDrawTransform(c);

        const path = this.getCachedPath();

        c.fillStyle = this.color;
        c.strokeStyle = this.outlineColor;
        c.lineWidth = this.outlineWidth;
        c.fill(path)
        if (this.outlineWidth)
            c.stroke(path);

        c.restore();
    }

    public create(options?: RegularPolygonOptions): this {
        return new RegularPolygon(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            sides: this.sides,
            radius: this.radius,
            color: this.color,
            outlineColor: this.outlineColor,
            outlineWidth: this.outlineWidth
        };
    }

    public setSides(sides: number) {
        this.sides = sides;
        this.invalidatePath();
        this.refresh();
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

    constructor(options?: RegularPolygonOptions) {
        super(options);

        this.sides = options?.sides ?? 5;
        this.radius = options?.radius ?? 50;
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
        
        if (!this.hidden) this.draw();
    }

}