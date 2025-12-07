import { canvas, ctx, penCtx } from '../canvas.ts';
import Engine from '../Engine.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '../Sprite.ts';

export interface ImageSpriteOptions extends SpriteOptions {
    costumes?: string[];
    costumeNumber?: number;
    width?: number;
    height?: number;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class ImageSprite extends Sprite {

    public discriminant = 'imagesprite';
    public tags = new Set(['imagesprite']);

    public costumes: string[];
    public costumeNumber: number;
    public width: number;
    public height: number;
    public outlineColor: string;
    public outlineWidth: number;

    private imgBitmap: ImageBitmap | null = null;
    protected img: HTMLImageElement;

    public getBoundingBox(): BoundingBox {

        const engine = Engine.init();

        const w = this.width / 2;   // half-width
        const h = this.height / 2;  // half-height

        const cos = engine.cos(this.dir);
        const sin = engine.sin(this.dir);

        const width  = 2 * Math.sqrt((w * cos)**2 + (h * sin)**2) * this.size;
        const height = 2 * Math.sqrt((w * sin)**2 + (h * cos)**2) * this.size;

        return {
            x: this.x,
            y: this.y,
            width, height
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();

        path.rect(
            -this.width / 2 * this.size,
            -this.height / 2 * this.size,
            this.width * this.size,
            this.height * this.size
        );

        return path;
    }

    public override draw(stamping?: true) {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        c.translate(cX, cY);

        c.rotate(this.toRadians(this.dir));

        c.strokeStyle = this.outlineColor;
        c.lineWidth = this.outlineWidth;
        c.drawImage(
            this.imgBitmap ?? this.img,
            0, 0,
            this.img.width,
            this.img.height,
            -this.width / 2,
            -this.height / 2,
            this.width, this.height
        );
        if (this.outlineWidth)
            c.stroke(this.getCachedPath());

        c.restore();
    }

    public create(options?: ImageSpriteOptions): this {
        return new ImageSprite(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            costumes: this.costumes,
            costumeNumber: this.costumeNumber,
            width: this.width,
            height: this.height,
            outlineColor: this.outlineColor,
            outlineWidth: this.outlineWidth
        };
    }

    // Methods

    public setCostume(costumeNumber: number) {
        this.costumeNumber = costumeNumber < this.costumes.length && costumeNumber >= 0
            ? costumeNumber
            : 0;
        this.img.src = this.costumes[this.costumeNumber]!;
        this.img.onload = () => {
            createImageBitmap(this.img).then(bitmap => {
                this.imgBitmap = bitmap;
            });
            this.refresh()
        };
    }

    public nextCostume() {
        this.costumeNumber = (this.costumeNumber + 1) % this.costumes.length;
        this.img.src = this.costumes[this.costumeNumber]!;
        this.img.onload = () => {
            this.imgBitmap = null;
            createImageBitmap(this.img).then(bitmap => {
                this.imgBitmap = bitmap;
            });
            this.refresh()
        };
    }

    public previousCostume() {
        this.costumeNumber--;
        if (this.costumeNumber < 0) this.costumeNumber = this.costumes.length - 1;

        this.img.src = this.costumes[this.costumeNumber]!;
        this.img.onload = () => {
            this.imgBitmap = null;
            createImageBitmap(this.img).then(bitmap => {
                this.imgBitmap = bitmap;
            });
            this.refresh()
        };
    }

    public setWidth(width: number) {
        this.width = width;
        this.invalidatePath();
        this.refresh();
    }

    public setHeight(height: number) {
        this.height = height;
        this.invalidatePath();
        this.refresh();
    }

    // Constructor

    constructor(options?: ImageSpriteOptions) {
        super(options);

        this.costumes = options?.costumes ?? [];
        this.costumeNumber = options?.costumeNumber && options.costumeNumber < this.costumes.length && options.costumeNumber >= 0
            ? options.costumeNumber
            : 0;

        this.img = new Image();
        this.img.src = this.costumes[this.costumeNumber] ?? '';

        this.width = options?.width ?? 0;
        this.height = options?.height ?? 0;

        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;
        
        this.img.onload = () => {
            if (!options?.width) this.width = this.img.width;
            if (!options?.height) this.height = this.img.height;
            createImageBitmap(this.img).then(bitmap => {
                this.imgBitmap = bitmap;
            });
            this.draw();
        };
    }
}