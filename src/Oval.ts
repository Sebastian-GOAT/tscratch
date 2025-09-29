import Sprite, { type SpriteOptions } from './Sprite.ts';
import { ctx, canvas } from './canvas.ts';

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
        ctx.fillStyle = this.color;
        // Draw
    }

    constructor(options?: OvalOptions) {
        super(options);
        this.radA = options?.radA ?? 25;
        this.radB = options?.radB ?? 25;
        this.color = options?.color ?? 'black';
        this.draw();
    }

}