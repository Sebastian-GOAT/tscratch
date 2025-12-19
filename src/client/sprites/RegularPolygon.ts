import { canvas, ctx, penCtx } from '@main/canvas.ts';
import Engine from '@main/Engine.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';
import TSCMath from '@main/TSCMath.ts';

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
        return {
            x: this.x - Engine.camera.x,
            y: this.y + Engine.camera.y,
            width: this.radius * 2 * this.size,
            height: this.radius * 2 * this.size
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();
        
        const step = (2 * Math.PI) / this.sides;

        path.moveTo(this.radius * this.size, 0);
        for (let i = 1; i < this.sides; i++)
            path.lineTo(
                this.radius * Math.cos(step * i) * this.size,
                this.radius * Math.sin(step * i) * this.size
            );
        
        path.closePath();
        return path;
    }

    public draw(stamping?: true) {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2 - Engine.camera.x;
        const cY = -this.y + canvas.height / 2 + Engine.camera.y;
        c.translate(cX, cY);
        c.rotate(TSCMath.toRadians(this.dir));
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
        
        this.draw();
    }

}