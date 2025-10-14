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

    public draw(): void {
        const rotation = this.toRadians(this.dir);
        
        ctx.beginPath();
        ctx.ellipse(
            this.x + canvas.width / 2,
            -this.y + canvas.height / 2,
            this.radA,
            this.radB,
            rotation, 0,
            Math.PI * 2
        );

        ctx.fillStyle = this.color;
        ctx.fill();
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