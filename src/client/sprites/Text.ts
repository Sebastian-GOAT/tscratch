import { canvas, ctx, penCtx } from '../canvas.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '../Sprite.ts';
import TSCMath from '../TSCMath.ts';

export interface TextOptions extends SpriteOptions {
    content?: string | number;
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
}

export default class Text extends Sprite {

    public discriminant = 'text';
    public tags = new Set(['text']);

    public content: string | number;
    public color: string;
    public fontFamily: string;
    public fontSize: number;
    public align: CanvasTextAlign;
    public baseline: CanvasTextBaseline;

    private font: string;

    public getBoundingBox(): BoundingBox {

        const metrics = ctx.measureText(String(this.content));
        const w = metrics.width / 2; // half-width
        const h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent / 2; // half-height

        const cos = TSCMath.cos(this.dir);
        const sin = TSCMath.sin(this.dir);

        const width  = 2 * (Math.abs(w * cos) + Math.abs(h * sin)) * this.size;
        const height = 2 * (Math.abs(w * sin) + Math.abs(h * cos)) * this.size;

        return {
            x: this.x,
            y: this.y,
            width, height
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();

        ctx.save();
        
        ctx.font = this.font;

        const metrics = ctx.measureText(String(this.content));
        const width = metrics.width * this.size;
        const height = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * this.size;

        ctx.restore();

        path.rect(-width / 2, -height / 2, width, height);

        return path
    }

    public draw(stamping?: true) {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        c.translate(cX, cY);
        c.rotate(this.toRadians(this.dir));
        c.translate(-this.pivot[0], this.pivot[1]);
TSCMath
        c.font = this.font;
        c.fillStyle = this.color;
        c.textAlign = this.align;
        c.textBaseline = this.baseline;

        c.fillText(String(this.content), 0, 0);

        c.restore();
    }

    public create(options?: TextOptions): this {
        return new Text(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions,
            content: this.content,
            color: this.color,
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            align: this.align,
            baseline: this.baseline
        };
    }

    // Methods

    public setContent(content: string | number) {
        this.content = content;
        this.invalidatePath();
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    public setFontSize(fontSize: number) {
        this.fontSize = fontSize;
        this.font = `${this.fontSize}px ${this.fontFamily}`;
        this.invalidatePath();
        this.refresh();
    }

    public setFontFamily(fontFamily: string) {
        this.fontFamily = fontFamily;
        this.font = `${this.fontSize}px ${this.fontFamily}`;
        this.invalidatePath();
        this.refresh();
    }

    public setAlign(align: CanvasTextAlign) {
        this.align = align;
        this.refresh();
    }

    public setBaseline(baseline: CanvasTextBaseline) {
        this.baseline = baseline;
        this.refresh();
    }

    // Constructor

    constructor(options?: TextOptions) {
        super(options);

        this.content = options?.content ?? '';
        this.color = options?.color ?? 'black';
        this.fontFamily = options?.fontFamily ?? 'Arial';
        this.fontSize = options?.fontSize ?? 16;
        this.align = options?.align ?? 'center';
        this.baseline = options?.baseline ?? 'middle';

        this.font = `${this.fontSize}px ${this.fontFamily}`;

        this.draw();
    }
}