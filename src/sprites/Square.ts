import Sprite, { type SpriteOptions } from '../Sprite.ts';
import { ctx, canvas, penCtx } from '../canvas.ts';

export interface SquareOptions extends SpriteOptions {
    sideLength?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class Square extends Sprite {

    public sideLength: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getPath(): Path2D {
        const path = new Path2D();

        path.rect(
            -this.sideLength / 2,
            -this.sideLength / 2,
            this.sideLength,
            this.sideLength
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
        if (this.outlineWidth)
            c.stroke(path);

        c.restore();
    }

    public setSideLength(sideLength: number) {
        this.sideLength = sideLength;
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    constructor(options?: SquareOptions) {
        super(options);
        this.sideLength = options?.sideLength ?? 50;
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
        this.draw();
    }

}