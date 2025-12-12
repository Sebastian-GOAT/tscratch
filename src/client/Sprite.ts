import Engine from './Engine.ts';
import type { Vec2 } from './types/Vectors.ts';

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface SpriteOptions {
    x?: number;
    y?: number;
    dir?: number;
    size?: number;
    pivot?: Vec2;
    scene?: string;
    hidden?: boolean;
    layer?: number;
}

export default abstract class Sprite {

    public x: number = 0;
    public y: number = 0;
    public dir: number = 0;
    public size: number = 1;
    public pivot: Vec2 = [0, 0];
    public scene: string = 'main';
    public hidden: boolean = false;
    public layer: number = 0;

    public abstract discriminant: string;
    public abstract tags: Set<string>;

    private cachedPath: Path2D | null = null;
    private pathDirty: boolean = true;

    // Reusable collision detection canvas
    private static collisionCanvas: OffscreenCanvas | null = null;
    private static collisionCtx: OffscreenCanvasRenderingContext2D | null = null;

    // Rendering

    public abstract getBoundingBox(): BoundingBox;
    public abstract getPath(): Path2D;
    public abstract draw(stamping?: true): void;
    protected abstract create(options?: SpriteOptions): this;

    protected refresh() {
        Engine.init().refresh();
    }

    protected invalidatePath() {
        this.pathDirty = true;
        this.cachedPath = null;
    }

    public getCachedPath(): Path2D {
        if (this.pathDirty || !this.cachedPath) {
            this.cachedPath = this.getPath();
            this.pathDirty = false;
        }
        return this.cachedPath;
    }

    constructor(options?: SpriteOptions) {
        Object.assign(this, options);
        Engine.init().addSprite(this);
    }

    protected getCreateOptions(): SpriteOptions & Record<string, any> {
        return {
            x: this.x,
            y: this.y,
            dir: this.dir,
            size: this.size,
            scene: this.scene,
            layer: this.layer,
            hidden: this.hidden
        };
    }

    public clone(options?: SpriteOptions): this {
        return this.create({
            ...this.getCreateOptions(),
            ...options
        });
    }

    // Sensing

    public touching(sprite: Sprite): boolean {

        // Return if hidden or if the scenes differ
        if (this.hidden || sprite.hidden || (this.scene !== '*' && sprite.scene !== '*' && this.scene !== sprite.scene)) return false;

        // AABB (bounding boxes)
        const bBox1 = this.getBoundingBox();
        const bBox2 = sprite.getBoundingBox();

        const aabbOverlap =
            Math.abs(bBox1.x - bBox2.x) < (bBox1.width + bBox2.width) / 2 &&
            Math.abs(bBox1.y - bBox2.y) < (bBox1.height + bBox2.height) / 2;

        if (!aabbOverlap) return false;

        // Image data (pixel perfect)

        // Compute intersection bounding box
        const b1Left = bBox1.x - bBox1.width / 2;
        const b1Top = bBox1.y + bBox1.height / 2;
        const b1Right = bBox1.x + bBox1.width / 2;
        const b1Bottom = bBox1.y - bBox1.height / 2;

        const b2Left = bBox2.x - bBox2.width / 2;
        const b2Top = bBox2.y + bBox2.height / 2;
        const b2Right = bBox2.x + bBox2.width / 2;
        const b2Bottom = bBox2.y - bBox2.height / 2;

        const xMin = Math.max(b1Left, b2Left);
        const yMin = Math.min(b1Bottom, b2Bottom);
        const xMax = Math.min(b1Right, b2Right);
        const yMax = Math.max(b1Top, b2Top);

        const width = xMax - xMin;
        const height = yMax - yMin;

        if (width < 1 || height < 1) return false;

        // Reuse or create offscreen canvas for collision detection
        if (!Sprite.collisionCanvas) {
            Sprite.collisionCanvas = new OffscreenCanvas(1, 1);
            Sprite.collisionCtx = Sprite.collisionCanvas.getContext('2d', { willReadFrequently: true })!;
        }

        // Prepare canvas
        const ctx = Sprite.collisionCtx!;
        if (Sprite.collisionCanvas.width < width) Sprite.collisionCanvas.width = width;
        if (Sprite.collisionCanvas.height < height) Sprite.collisionCanvas.height = height;
        ctx.clearRect(0, 0, width, height);

        // Helper to draw a sprite into collision canvas
        const drawSprite = (sprite: Sprite, color: string) => {
            ctx.save();

            // Translate to intersection box coordinates (centered)
            const dx = sprite.x - xMin;
            const dy = yMax - sprite.y; // flip Y to match draw()

            ctx.translate(dx, dy);
            ctx.rotate(sprite.toRadians(sprite.dir));

            ctx.fillStyle = color;
            ctx.fill(sprite.getCachedPath());

            ctx.restore();
        };

        // Draw sprite 1 in red
        drawSprite(this, 'red');
        const img1 = ctx.getImageData(0, 0, width, height).data;

        // Draw sprite 2 in blue
        ctx.clearRect(0, 0, width, height);
        drawSprite(sprite, 'blue');
        const img2 = ctx.getImageData(0, 0, width, height).data;

        // Check for overlapping non-transparent pixels
        for (let i = 3; i < img1.length; i += 4) // alpha channel
            if (img1[i]! > 0 && img2[i]! > 0) return true;

        return false;
    }

    // Helpers

    protected toRadians(deg: number) {
        return deg * Math.PI / 180;
    }

    protected toDegrees(rad: number) {
        return rad * 180 / Math.PI;
    }

    public distanceTo(x: number, y: number) {
        return Math.hypot(x - this.x, y - this.y);
    }

    // Methods

    // Motion
    public move(steps: number) {
        this.x += steps * Math.sin(this.toRadians(this.dir));
        this.y += steps * Math.cos(this.toRadians(this.dir));
        this.refresh();
    }

    public turn(deg: number) {
        this.dir += deg;
        this.refresh();
    }

    public point(dir: number) {
        this.dir = dir;
        this.refresh();
    }

    public pointTowards(x: number, y: number) {
        this.dir = 90 - this.toDegrees(Math.atan2(y - this.y, x - this.x));
        this.refresh();
    }

    public setX(x: number) {
        this.x = x;
        this.refresh();
    }

    public setY(y: number) {
        this.y = y;
        this.refresh();
    }

    public goTo(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.refresh();
    }

    public changeX(dX: number) {
        this.x += dX;
        this.refresh();
    }

    public changeY(dY: number) {
        this.y += dY;
        this.refresh();
    }

    public setPivot(x: number, y: number) {
        this.pivot = [x, y];
        this.refresh();
    }

    // Looks

    public show() {
        this.hidden = false;
        this.refresh();
    }

    public hide() {
        this.hidden = true;
        this.refresh();
    }

    public setSize(size: number) {
        this.size = size > 0 ? size : 0;
        this.invalidatePath();
        this.refresh();
    }

    public changeSize(dS: number) {
        this.size = this.size + dS > 0 ? this.size + dS : 0;
        this.invalidatePath();
        this.refresh();
    }

    public goToLayer(layer: number) {
        this.layer = layer;
        this.refresh();
    }

    public changeLayer(dL: number) {
        this.layer += dL;
        this.refresh();
    }
}