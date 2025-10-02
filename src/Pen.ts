import { canvas, ctx } from './canvas.ts';
import Sprite, { type SpriteOptions } from './Sprite.ts';

export interface PenOptions extends SpriteOptions {
    drawing: boolean;
    size: number;
    color: string;
}

export default class Pen extends Sprite {

    public drawing: boolean;
    public size: number;
    public color: string;

    draw() {}

    public up() {
        this.drawing = false;
    }

    public down() {
        this.drawing = true;
    }

    public dot() {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
    }

    private drawLine(lastX: number, lastY: number) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(
            this.x + canvas.width / 2,
            this.y + canvas.height / 2
        );
        ctx.lineWidth = this.size;
        ctx.strokeStyle = this.color;
        ctx.stroke()
    }

    // Overriding methods to include drawing

    public override move(steps: number) {
        const lastX = this.x;
        const lastY = this.y;

        this.x += steps * Math.sin(this.toRadians(this.dir));
        this.y -= steps * Math.cos(this.toRadians(this.dir));
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

        this.y -= dY;
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