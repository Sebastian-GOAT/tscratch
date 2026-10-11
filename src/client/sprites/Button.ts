import { ctx, penCtx } from '@main/canvas.ts';
import Engine from '@main/Engine.ts';
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
    buttonOutlineColor?: string;
    buttonOutlineWidth?: number;

    textOutlineColor?: string;
    textOutlineWidth?: number;

    borderRadius?: number;
}

export default class Button extends Sprite<ButtonOptions> {

    public discriminant = 'button';
    public tags = new Set(['button']);

    public content: string | number;
    public fontColor: string;
    public fontFamily: string;
    public fontSize: number;

    public width: number;
    public height: number;
    public backgroundColor: string;
    public buttonOutlineColor: string;
    public buttonOutlineWidth: number;

    public textOutlineColor: string;
    public textOutlineWidth: number;

    public borderRadius: number;

    public getBoundingBox(): BoundingBox {

        ctx.save();
        
        ctx.font = `${this.fontSize * this.size}px ${this.fontFamily}`;

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

        if (this.borderRadius > 1) {
            path.roundRect(
                -this.width / 2 * this.size,
                -this.height / 2 * this.size,
                this.width * this.size,
                this.height * this.size,
                this.borderRadius * this.size
            );
        } else {
            path.rect(
                -this.width / 2 * this.size,
                -this.height / 2 * this.size,
                this.width * this.size,
                this.height * this.size
            );
        }

        return path
    }

    public draw(stamping?: true) {
        const c = stamping ? penCtx : ctx;

        c.save();

        this.applyDrawTransform(c);

        c.fillStyle = this.backgroundColor;
        c.strokeStyle = this.buttonOutlineColor;
        c.lineWidth = this.buttonOutlineWidth;

        const path = this.getCachedPath();
        
        c.fill(path);
        if (this.buttonOutlineWidth) c.stroke(path);

        c.font = `${this.fontSize * this.size}px ${this.fontFamily}`;
        c.fillStyle = this.fontColor;
        c.strokeStyle = this.textOutlineColor;
        c.textAlign = 'center';
        c.textBaseline = 'middle';

        c.fillText(String(this.content), 0, 0);
        if (this.textOutlineWidth)
            c.strokeText(String(this.content), 0, 0);

        c.restore();
    }

    public create(options?: ButtonOptions): this {
        return new Button(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...this.baseCreateOptions,
            content: this.content,
            fontColor: this.fontColor,
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            width: this.width,
            height: this.height,
            backgroundColor: this.backgroundColor,
            textOutlineColor: this.textOutlineColor,
            textOutlineWidth: this.textOutlineWidth,
            buttonOutlineColor: this.buttonOutlineColor,
            buttonOutlineWidth: this.buttonOutlineWidth,
            borderRadius: this.borderRadius
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
        this.invalidatePath();
        this.refresh();
    }

    public setFontFamily(fontFamily: string) {
        this.fontFamily = fontFamily;
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

        this.width = options?.width ?? String(this.content).length * this.fontSize + 10;
        this.height = options?.height ?? this.fontSize + 10;
        this.backgroundColor = options?.backgroundColor ?? 'rgb(204, 204, 204)';
        this.buttonOutlineColor = options?.buttonOutlineColor ?? 'black';
        this.buttonOutlineWidth = options?.buttonOutlineWidth ?? 0;

        this.textOutlineColor = options?.textOutlineColor ?? 'black';
        this.textOutlineWidth = options?.textOutlineWidth ?? 0;

        this.borderRadius = options?.borderRadius ?? 0;
        if (options?.tags)
            this.tags = new Set([...this.tags, ...options.tags]);

        if (
            (!this.hidden && this.scene === Engine.init().currentScene) ||
            this.scene === '*'
        )
            this.draw();
    }
}