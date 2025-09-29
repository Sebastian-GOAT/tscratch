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
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.width / 2 + canvas.width / 2,
            this.y - this.height / 2 + canvas.height / 2,
            this.width,
            this.height
        );
    }

    constructor(options?: RectangleOptions) {
        super(options);
        this.width = options?.width ?? 50;
        this.height = options?.height ?? 50;
        this.color = options?.color ?? 'black';
        this.draw();
    }

}