import { canvas, penCtx } from '../canvas.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '../Sprite.ts';

export interface PenOptions extends SpriteOptions {
    drawing?: boolean;
    size?: number;
    color?: string;
}

export default class Pen extends Sprite {

    public discriminant = 'pen';
    public tags = new Set('pen');

    public drawing: boolean;
    public size: number;
    public color: string;

    public getBoundingBox(): BoundingBox {
        return {
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size
        };
    }

    public getPath(): Path2D {
        return new Path2D();
    }
    public draw() {}

    public create(options?: PenOptions): this {
        return new Pen(options) as this;
    }

    public up() {
        this.drawing = false;
    }

    public down() {
        this.drawing = true;
    }

    public stamp(sprite: Sprite) {
        sprite.draw(true);
    }

    public eraseAll() {
        penCtx.clearRect(0, 0, canvas.width, canvas.height);
    }

    public dot() {
        penCtx.fillStyle = this.color;
        penCtx.fillRect(
            this.x - this.size / 2 + canvas.width / 2,
            -this.y - this.size / 2 + canvas.height / 2,
            this.size,
            this.size
        );
    }

    private drawLine(lastX: number, lastY: number) {
        penCtx.beginPath();

        penCtx.moveTo(lastX + canvas.width / 2, -lastY + canvas.height / 2);
        penCtx.lineTo(this.x + canvas.width / 2, -this.y + canvas.height / 2);

        penCtx.lineWidth = this.size;
        penCtx.strokeStyle = this.color;
        penCtx.stroke();
    }

    // Overriding methods to include drawing

    public override move(steps: number) {
        const lastX = this.x;
        const lastY = this.y;

        this.x += steps * Math.sin(this.toRadians(this.dir));
        this.y += steps * Math.cos(this.toRadians(this.dir));
        if (this.drawing)
            this.drawLine(lastX, lastY);
        this.refresh();
    }

    public override setX(x: number) {
        const lastX = this.x;
        const lastY = this.y;

        this.x = x;
        if (this.drawing)
            this.drawLine(lastX, lastY);
        this.refresh();
    }

    public override setY(y: number) {
        const lastX = this.x;
        const lastY = this.y;

        this.y = y;
        if (this.drawing)
            this.drawLine(lastX, lastY);
        this.refresh();
    }

    public override goTo(x: number, y: number) {
        const lastX = this.x;
        const lastY = this.y;

        this.x = x;
        this.y = y;
        if (this.drawing)
            this.drawLine(lastX, lastY);
        this.refresh();
    }

    public override changeX(dX: number) {
        const lastX = this.x;
        const lastY = this.y;

        this.x += dX;
        if (this.drawing)
            this.drawLine(lastX, lastY);
        this.refresh();
    }

    public override changeY(dY: number) {
        const lastX = this.x;
        const lastY = this.y;

        this.y += dY;
        if (this.drawing)
            this.drawLine(lastX, lastY);
        this.refresh();
    }

    // Constructor

    constructor(options?: PenOptions) {
        super(options);
        
        this.drawing = options?.drawing ?? false;
        this.size = options?.size ?? 5;
        this.color = options?.color ?? 'black';
    }

}