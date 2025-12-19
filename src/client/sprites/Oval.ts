import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';
import { canvas, ctx, penCtx } from '@main/canvas.ts';
import TSCMath from '@main/TSCMath.ts';
import Engine from '@main/Engine.ts';

export interface OvalOptions extends SpriteOptions {
    radX?: number;
    radY?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class Oval extends Sprite {

    public discriminant = 'oval';
    public tags = new Set(['oval']);

    public radX: number;
    public radY: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {

        const rX = this.radX;
        const rY = this.radY;

        const cos = TSCMath.cos(this.dir);
        const sin = TSCMath.sin(this.dir);

        const width  = 2 * (Math.abs(rX * cos) + Math.abs(rY * sin)) * this.size;
        const height = 2 * (Math.abs(rX * sin) + Math.abs(rY * cos)) * this.size;

        return {
            x: this.x - Engine.camera.x,
            y: this.y + Engine.camera.y,
            width, height
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();

        path.ellipse(
            0, 0,
            this.radX * this.size,
            this.radY * this.size,
            0, 0,
            Math.PI * 2
        );

        return path;
    }

    public draw(stamping?: true): void {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2 - Engine.camera.x;
        const cY = -this.y + canvas.height / 2 + Engine.camera.y;
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

    public create(options?: OvalOptions): this {
        return new Oval(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            radX: this.radX,
            radY: this.radY,
            color: this.color,
            outlineColor: this.outlineColor,
            outlineWidth: this.outlineWidth
        };
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