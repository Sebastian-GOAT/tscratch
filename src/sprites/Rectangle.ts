import Sprite, { type SpriteOptions } from '../Sprite.ts';
import { ctx, canvas, penCtx } from '../canvas.ts';

export interface RectangleOptions extends SpriteOptions {
    width?: number;
    height?: number;
    color?: string;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class Rectangle extends Sprite {

    public width: number;
    public height: number;
    public color: string;
    public outlineColor: string;
    public outlineWidth: number;

    public getPath(): Path2D {
        const path = new Path2D();

        path.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
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

    public setWidth(width: number) {
        this.width = width;
        this.refresh();
    }

    public setHeight(height: number) {
        this.height = height;
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    constructor(options?: RectangleOptions) {
        super(options);
        this.width = options?.width ?? 50;
        this.height = options?.height ?? 50;
        this.color = options?.color ?? 'black';
        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
        this.draw();
    }

}