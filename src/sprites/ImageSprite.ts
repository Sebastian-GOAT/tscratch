import { canvas, ctx, penCtx } from '../canvas.ts';
import Sprite, { type SpriteOptions } from '../Sprite.ts';

export interface ImageSpriteOptions extends SpriteOptions {
    src?: string;
    width: number;
    height: number;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class ImageSprite extends Sprite {

    public src: string;
    public width: number;
    public height: number;
    public outlineColor: string;
    public outlineWidth: number;

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

    public draw(stamping?: boolean) {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        c.translate(cX, cY);

        c.rotate(this.toRadians(this.dir));

        c.strokeStyle = this.outlineColor;
        c.lineWidth = this.outlineWidth;
        c.drawImage(
            this.img,
            0, 0,
            this.img.width,
            this.img.height,
            -this.width / 2,
            -this.height / 2,
            this.width, this.height
        );
        if (this.outlineWidth)
            c.stroke(this.getPath());

        c.restore();
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

        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
    }
}