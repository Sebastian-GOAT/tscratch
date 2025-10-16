import Sprite, { type SpriteOptions } from './Sprite.ts';
import { ctx, canvas } from './canvas.ts';

export interface RectangleOptions extends SpriteOptions {
    width?: number;
    height?: number;
    color?: string;
};

export default class Rectangle extends Sprite {

    public width: number;
    public height: number;
    public color: string;

    public draw(): void {
        ctx.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        ctx.translate(cX, cY);

        ctx.rotate(this.toRadians(this.dir));

        ctx.fillStyle = this.color;
        ctx.fillRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        ctx.restore();
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
        this.draw();
    }

}