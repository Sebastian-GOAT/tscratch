import { ctx, penCtx } from '@main/canvas.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';
import TSCMath from '@main/TSCMath.ts';

export interface ImageSpriteOptions<K extends string> extends SpriteOptions {
    costumes: Record<K, ImageBitmap>;
    costume: K;
    width?: number;
    height?: number;
    lockAspectRatio?: boolean;
    outlineColor?: string;
    outlineWidth?: number;
};

export default class ImageSprite<K extends string> extends Sprite {
    
    public discriminant = 'imagesprite';
    public tags = new Set(['imagesprite']);

    public costumes: Record<K, ImageBitmap>;
    private bitmap: ImageBitmap;

    public costume: K;
    private costumeNumber: number;

    public width: number;
    public height: number;
    public aspectRatio: number;

    private aspectRatioLocked: boolean;

    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {

        const w = this.width / 2;   // half-width
        const h = this.height / 2;  // half-height

        const cos = TSCMath.cos(this.dir);
        const sin = TSCMath.sin(this.dir);

        const width  = 2 * (Math.abs(w * cos) + Math.abs(h * sin)) * this.size;
        const height = 2 * (Math.abs(w * sin) + Math.abs(h * cos)) * this.size;

        const off = this.getDrawOffset();
        return {
            x: this.x + off[0],
            y: this.y + off[1],
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

    public draw(stamping?: true) {
        const c = stamping ? penCtx : ctx;

        c.save();

        this.applyDrawTransform(c);

        c.strokeStyle = this.outlineColor;
        c.lineWidth = this.outlineWidth;
        c.drawImage(
            this.bitmap,
            0, 0,
            this.bitmap.width,
            this.bitmap.height,
            -this.width / 2 * this.size,
            -this.height / 2 * this.size,
            this.width * this.size,
            this.height * this.size
        );
        if (this.outlineWidth)
            c.stroke(this.getCachedPath());

        c.restore();
    }

    public create(options?: ImageSpriteOptions<K>): this {
        return new ImageSprite(options ?? { costumes: this.costumes, costume: this.costume }) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            costumes: this.costumes,
            bitmap: this.bitmap,
            costume: this.costume,
            width: this.width,
            height: this.height,
            outlineColor: this.outlineColor,
            outlineWidth: this.outlineWidth
        };
    }

    // Methods

    public setCostume(costume: K) {

        this.bitmap = this.costumes[costume];
        this.costume = costume;
        this.aspectRatio = this.bitmap.width / this.bitmap.height;

        const keys = Object.keys(this.costumes) as K[];
        this.costumeNumber = keys.indexOf(costume);

        if (this.aspectRatioLocked)
            this.height = this.width / this.aspectRatio;

        this.invalidatePath();
        this.refresh();
    }

    private setCostumeNumber(costumeNumber: number) {

        const keys = Object.keys(this.costumes) as K[];
        if (costumeNumber < 0 || costumeNumber >= keys.length)
            throw new Error('costumeNumber must be between 0 and costumes.length - 1');

        const targetKey = keys[costumeNumber]!;
        const targetBitmap = this.costumes[targetKey];

        this.bitmap = targetBitmap;
        this.costume = targetKey;
        this.costumeNumber = costumeNumber;
        this.aspectRatio = this.bitmap.width / this.bitmap.height;

        if (this.aspectRatioLocked)
            this.height = this.width / this.aspectRatio;

        this.invalidatePath();
        this.refresh();
    }

    public nextCostume() {
        const keys = Object.keys(this.costumes) as K[];
        if (keys.length <= 1) return;

        const nextIndex = (this.costumeNumber + 1) % keys.length;
        this.setCostumeNumber(nextIndex);
    }

    public previousCostume() {
        const keys = Object.keys(this.costumes) as K[];
        if (keys.length <= 1) return;

        const prevIndex = (this.costumeNumber - 1 + keys.length) % keys.length;
        this.setCostumeNumber(prevIndex);
    }

    public setWidth(width: number) {
        this.width = width;
        if (this.aspectRatioLocked)
            this.height = width / this.aspectRatio;

        this.invalidatePath();
        this.refresh();
    }

    public setHeight(height: number) {
        this.height = height;
        if (this.aspectRatioLocked)
            this.width = height * this.aspectRatio;

        this.invalidatePath();
        this.refresh();
    }

    public lockAspectRatio() {
        this.aspectRatioLocked = true;
    }

    public unlockAspectRatio() {
        this.aspectRatioLocked = false;
    }

    // Constructor
    constructor(options: ImageSpriteOptions<K>) {
        super(options);

        this.costumes = options.costumes;

        const keys = Object.keys(this.costumes) as K[];
        if (keys.length === 0)
            throw new Error('You must pass at least one costume to an ImageSprite');

        this.costume = options.costume;
        this.costumeNumber = keys.indexOf(options.costume);

        this.bitmap = this.costumes[this.costume];
        this.aspectRatio = this.bitmap.width / this.bitmap.height;
        this.aspectRatioLocked = options.lockAspectRatio ?? true;

        if (this.aspectRatioLocked) {
            if (options.width && options.height) throw new Error('You cannot pass in both width & height, because aspectRatioLocked is set to true');

            if (options.width) {
                this.width = options.width;
                this.height = options.width / this.aspectRatio;
            }
            else if (options.height) {
                this.width = options.height * this.aspectRatio;
                this.height = options.height;
            }
            else {
                this.width = this.bitmap.width;
                this.height = this.bitmap.height;
            }
        }
        else {
            this.width = options.width ?? this.bitmap.width;
            this.height = options.height ?? this.bitmap.height;
        }
        
        this.outlineColor = options.outlineColor ?? 'black';
        this.outlineWidth = options.outlineWidth ?? 0;
        if (options.tags)
            this.tags = new Set([...this.tags, ...options.tags]);

        if (!this.hidden) this.draw();
    }
}