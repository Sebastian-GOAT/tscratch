import { canvas, ctx, penCtx } from './canvas.ts';
import Sprite, { type SpriteOptions } from './Sprite.ts';

export type CanvasTextAlign =
    | 'left'
    | 'right'
    | 'center'
    | 'start'
    | 'end';

export type CanvasTextBaseline =
    | 'top'
    | 'hanging'
    | 'middle'
    | 'alphabetic'
    | 'ideographic'
    | 'bottom';

export interface TextOptions extends SpriteOptions {
    content?: string;
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
}

export default class Text extends Sprite {

    public content: string;
    public color: string;
    public fontFamily: string;
    public fontSize: number;
    public align: CanvasTextAlign;
    public baseline: CanvasTextBaseline;

    private font: string;

    public getPath(): Path2D {
        const path = new Path2D();

        ctx.save();
        
        ctx.font = this.font;

        const metrics = ctx.measureText(this.content);
        const width = metrics.width;
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        ctx.restore();

        path.rect(-width / 2, -height / 2, width, height);

        return path
    }

    public draw(stamping?: boolean) {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        c.translate(cX, cY);

        c.rotate(this.toRadians(this.dir));

        c.font = this.font;
        c.fillStyle = this.color;
        c.textAlign = this.align;
        c.textBaseline = this.baseline;

        c.fillText(this.content, 0, 0);

        c.restore();
    }

    // Methods

    public setContent(content: string) {
        this.content = content;
        this.refresh();
    }

    public setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    public setFontSize(fontSize: number) {
        this.fontSize = fontSize;
        this.font = `${this.fontSize}px ${this.fontFamily}`;
        this.refresh();
    }

    public setFontFamily(fontFamily: string) {
        this.fontFamily = fontFamily;
        this.font = `${this.fontSize}px ${this.fontFamily}`;
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
    }
}