import { ctx } from './canvas.ts';
import Sprite, { type SpriteOptions } from './Sprite.ts';

interface RegularShapeOptions extends SpriteOptions {
    sides?: number;
    radius?: number;
    color?: string;
}

export default class RegularShape extends Sprite {

    public sides: number;
    public radius: number;
    public color: string;

    public draw() {
        const r = this.radius / 2;
        const step = (Math.PI * 2) / this.sides;

        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
            const theta = i * step - Math.PI / 2;
            const px = this.x + r * Math.cos(theta);
            const py = this.y + r * Math.sin(theta);

            if (i === 0)
                ctx.moveTo(px, py);
            else
                ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();
    }

    constructor(options?: RegularShapeOptions) {
        super(options);
        this.sides = options?.sides ?? 5;
        this.radius = options?.radius ?? 5;
        this.color = options?.color ?? 'black';
        this.draw();
    }

}