import Sprite, { type SpriteOptions } from './Sprite.ts';
import { canvas, ctx } from './canvas.ts';

export interface OvalOptions extends SpriteOptions {
    radA?: number;
    radB?: number;
    color?: string;
};

export default class Oval extends Sprite {

    public radA: number;
    public radB: number;
    public color: string;

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

    public draw(): void {
        ctx.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        ctx.translate(cX, cY);

        ctx.rotate(this.toRadians(this.dir));

        ctx.fillStyle = this.color;
        ctx.fill(this.getPath());

        ctx.restore();
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
        this.draw();
    }

}