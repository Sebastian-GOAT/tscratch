import { canvas, ctx } from './canvas.ts';
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

    public draw() {
        ctx.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        ctx.translate(cX, cY);

        ctx.rotate(this.toRadians(this.dir));

        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;

        ctx.fillText(this.content, 0, 0);

        ctx.restore();
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