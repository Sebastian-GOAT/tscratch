import { canvas, ctx } from './canvas.ts';
import Sprite, { type SpriteOptions } from './Sprite.ts';

export interface ImageSpriteOptions extends SpriteOptions {
    src?: string;
    width: number;
    height: number;
};

export default class ImageSprite extends Sprite {

    public src: string;
    public width: number;
    public height: number;

    protected img: HTMLImageElement;

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

    public draw() {
        ctx.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        ctx.translate(cX, cY);

        ctx.rotate(this.toRadians(this.dir));

        ctx.drawImage(
            this.img,
            0, 0,
            this.img.width,
            this.img.height,
            -this.width / 2,
            -this.height / 2,
            this.width, this.height
        );

        ctx.restore();
    }

    // Methods

    public setSrc(src: string) {
        this.src = src;
        this.refresh();
    }

    public setWidth(width: number) {
        this.width = width;
        this.refresh();
    }

    public setHeight(height: number) {
        this.height = height;
        this.refresh();
    }

    // Constructor

    constructor(options?: ImageSpriteOptions) {
        super(options);

        this.src = options?.src ?? '';
        this.img = new Image();
        this.img.src = this.src;

        this.width = options?.width ?? this.img.width;
        this.height = options?.height ?? this.img.height;
    }
}