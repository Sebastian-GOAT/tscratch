import Sprite, { type SpriteOptions } from '../Sprite.ts';
import { canvas, ctx, penCtx } from '../canvas.ts';

export interface OvalOptions extends SpriteOptions {
    radA?: number;
    radB?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class Oval extends Sprite {

    public radA: number;
    public radB: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getPath(): Path2D {
        const path = new Path2D();

        path.ellipse(
            0, 0,
            this.radA,
            this.radB,
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

        const path = this.getPath();

        c.fillStyle = this.color;
        c.strokeStyle = this.outlineColor;
        c.lineWidth = this.outlineWidth;
        c.fill(path)
        c.stroke(path);

        c.restore();
    }

    public setRadA(radA: number) {
        this.radA = radA;
        this.refresh();
    }

    public setRadB(radB: number) {
        this.radB = radB;
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    constructor(options?: OvalOptions) {
        super(options);
        this.radA = options?.radA ?? 25;
        this.radB = options?.radB ?? 25;
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
        this.draw();
    }

}