import type { Vec3 } from '@ctypes/Vectors.ts';
import { canvas, ctx, penCtx } from '@main/canvas.ts';
import Sprite, { type BoundingBox, type SpriteOptions } from '@main/Sprite.ts';

export interface JoystickOptions extends SpriteOptions {
    radius: number;
}

export default class Joystick extends Sprite {

    public tags = new Set(['joystick']);
    public discriminant = 'joystick';

    public radius: number;
    private thumbRadius: number;
    private sizeRatio = 0.4;
    public rgb: Vec3 = [0, 0, 0];

    public joyX = 0;
    public joyY = 0;

    public getBoundingBox(): BoundingBox {
        const off = this.getDrawOffset();
        return {
            x: this.x + off[0],
            y: this.y + off[1],
            width: this.radius * 2 * this.size,
            height: this.radius * 2 * this.size
        };
    }

    public getPath(): Path2D {
        const path = new Path2D();

        path.ellipse(
            0, 0,
            this.radius * this.size,
            this.radius * this.size,
            0, 0,
            Math.PI * 2
        );

        return path;
    }

    public draw(stamping?: true): void {
        const c = stamping ? penCtx : ctx;

        c.save();

        this.applyDrawTransform(c);

        // Base
        const path = this.getCachedPath();

        c.fillStyle = `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 0.4)`;
        c.fill(path);

        // Thumb
        c.translate(
            this.joyX * (this.radius - this.thumbRadius - 4) * this.size,
            -this.joyY * (this.radius - this.thumbRadius - 4) * this.size
        );

        const thumb = new Path2D();
        thumb.ellipse(
            0, 0,
            this.thumbRadius * this.size,
            this.thumbRadius * this.size,
            0, 0,
            Math.PI * 2
        );
        
        c.fillStyle = 'white';
        c.fill(thumb);

        c.restore();
    }

    protected create(options?: JoystickOptions): this {
        return new Joystick(options) as this;
    }

    protected getCreateOptions() {
        return {
            ...super.getCreateOptions(),
            radius: this.radius
        };
    }

    public setRadius(radius: number) {
        this.radius = radius;
        this.thumbRadius = radius * this.sizeRatio;
        this.invalidatePath();
        this.refresh();
    }

    public setRGB(r: number, g: number, b: number) {
        this.rgb[0] = r;
        this.rgb[1] = g;
        this.rgb[2] = b;
    }

    constructor(options?: JoystickOptions) {
        super(options);

        this.radius = options?.radius ?? 60;
        this.thumbRadius = this.radius * this.sizeRatio;
        this.x = -canvas.width / 2 + this.radius + 15;
        this.y = -canvas.height / 2 + this.radius + 15;
        
        if (!this.hidden) this.draw();
    }
}