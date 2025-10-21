import { canvas, ctx, penCtx } from './canvas.ts';
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

    public getPath(): Path2D {
        const path = new Path2D();

        const step = (Math.PI * 2) / this.sides;
        const rotation = this.toRadians(this.dir);
        const r = this.radius;

        for (let i = 0; i < this.sides; i++) {
            const theta = i * step - Math.PI / 2 + rotation;
            const px = r * Math.cos(theta);
            const py = -r * Math.sin(theta);

            if (i === 0) path.moveTo(px, py);
            else path.lineTo(px, py);
        }

        path.closePath();

        return path;
    }

    public draw(stamping?: boolean) {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2;
        const cY = this.y + canvas.height / 2;

        c.translate(cX, cY);

        c.fillStyle = this.color;
        c.fill(this.getPath());

        c.restore();
    }

    public setSides(sides: number) {
        this.sides = sides;
        this.refresh();
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