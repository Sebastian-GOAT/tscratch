import { canvas, ctx, penCtx } from '@main/canvas.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';
import TSCMath from '@main/TSCMath.ts';

export interface ButtonOptions extends SpriteOptions {
    content?: string | number;
    fontColor?: string;
    fontFamily?: string;
    fontSize?: number;

    width?: number;
    height?: number;
    backgroundColor?: string;

    outlineColor?: string;
    outlineWidth?: number;
}

export default class Button extends Sprite {

    public discriminant = 'button';
    public tags = new Set(['button']);

    public content: string | number;
    public fontColor: string;
    public fontFamily: string;
    public fontSize: number;

    private font: string;

    public width: number;
    public height: number;
    public backgroundColor: string;

    public outlineColor: string;
    public outlineWidth: number;

    public getBoundingBox(): BoundingBox {

        ctx.save();
        
        ctx.font = this.font;

        const metrics = ctx.measureText(String(this.content));
        const w = Math.max(metrics.width, this.width) / 2; // half-width
        const h = Math.max(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent, this.height) / 2; // half-height

        ctx.restore();

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

        return path
    }

    public draw(stamping?: true) {
        const c = stamping ? penCtx : ctx;

        c.save();

        const cX = this.x + canvas.width / 2;
        const cY = -this.y + canvas.height / 2;
        c.translate(cX, cY);
        c.rotate(this.toRadians(this.dir));
        c.translate(-this.pivot[0] * this.size, this.pivot[1] * this.size);

        c.fillStyle = this.backgroundColor;
        c.strokeStyle = this.outlineColor;
        c.lineWidth = this.outlineWidth;

        const path = this.getCachedPath();
        
        c.fill(path);
        if (this.outlineWidth) c.stroke(path);

        c.font = this.font;
        c.fillStyle = this.fontColor;
        c.textAlign = 'center';
        c.textBaseline = 'middle';

        c.fillText(String(this.content), 0, 0);

        c.restore();
    }

    public create(options?: ButtonOptions): this {
        return new Button(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            content: this.content,
            fontColor: this.fontColor,
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            width: this.width,
            height: this.height,
            backgroundColor: this.backgroundColor,
            outlineColor: this.outlineColor,
            outlineWidth: this.outlineWidth
        };
    }

    // Methods

    public setContent(content: string | number) {
        this.content = content;
        this.invalidatePath();
        this.refresh();
    }

    public setBackgroundColor(color: string) {
        this.backgroundColor = color;
        this.refresh();
    }

    public setFontColor(color: string) {
        this.fontColor = color;
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

    // Constructor

    constructor(options?: ButtonOptions) {
        super(options);

        this.content = options?.content ?? '';
        this.fontColor = options?.fontColor ?? 'black';
        this.fontFamily = options?.fontFamily ?? 'Arial';
        this.fontSize = options?.fontSize ?? 16;

        this.font = `${this.fontSize}px ${this.fontFamily}`;

        this.width = options?.width ?? String(this.content).length * this.fontSize + 10;
        this.height = options?.height ?? this.fontSize + 10;
        this.backgroundColor = options?.backgroundColor ?? 'rgb(204, 204, 204)';

        this.outlineColor = options?.outlineColor ?? 'black';
        this.outlineWidth = options?.outlineWidth ?? 0;

        this.draw();
    }
}