import { canvas, ctx } from './canvas.ts';
import Sprite, { type SpriteOptions } from './Sprite.ts';

export interface RegularPolygonOptions extends SpriteOptions {
    sides?: number;
    radius?: number;
    color?: string;
}

export default class RegularPolygon extends Sprite {

    public sides: number;
    public radius: number;
    public color: string;

    public draw() {
        const r = this.radius;
        const step = (Math.PI * 2) / this.sides;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const rotation = this.toRadians(this.dir);

        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
            const theta = i * step - Math.PI / 2 + rotation;
            const px = cx + this.x + r * Math.cos(theta);
            const py = cy + this.y - r * Math.sin(theta);

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();
    }

    public setRadius(radius: number) {
        this.radius = radius;
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
        this.draw();
    }

}