import Engine from './Engine.ts';

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
    scene?: string;
    hidden?: boolean;
    layer?: number;
}

export default abstract class Sprite {

    public x: number;
    public y: number;
    public dir: number;
    public scene: string;
    public hidden: boolean;
    public layer: number;

    private cachedPath: Path2D | null = null;
    private pathDirty: boolean = true;

    // Reusable collision detection canvas
    private static collisionCanvas: HTMLCanvasElement | null = null;
    private static collisionCtx: CanvasRenderingContext2D | null = null;

    // Rendering

    public abstract getBoundingBox(): BoundingBox;
    public abstract getPath(): Path2D;
    public abstract draw(stamping?: boolean): void;

    protected refresh() {
        Engine.init().refresh();
    }

    protected invalidatePath() {
        this.pathDirty = true;
        this.cachedPath = null;
    }

    protected getCachedPath(): Path2D {
        if (this.pathDirty || !this.cachedPath) {
            this.cachedPath = this.getPath();
            this.pathDirty = false;
        }
        return this.cachedPath;
    }

    constructor(options?: SpriteOptions) {
        this.x = options?.x ?? 0;
        this.y = options?.y ?? 0;
        this.dir = options?.dir ?? 0;
        this.scene = options?.scene ?? 'main';
        this.hidden = options?.hidden ?? false;
        this.layer = options?.layer ?? 0;
        Engine.init().addSprite(this);
    }

    // Sensing

    public touching(sprite: Sprite): boolean {

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

        if (width <= 1 || height <= 1) return false;

        // Reuse or create offscreen canvas for collision detection
        if (!Sprite.collisionCanvas) {
            Sprite.collisionCanvas = document.createElement('canvas');
            Sprite.collisionCtx = Sprite.collisionCanvas.getContext('2d', { willReadFrequently: true })!;
        }

        // Resize if needed
        if (Sprite.collisionCanvas.width < width || Sprite.collisionCanvas.height < height) {
            Sprite.collisionCanvas.width = Math.max(width, Sprite.collisionCanvas.width);
            Sprite.collisionCanvas.height = Math.max(height, Sprite.collisionCanvas.height);
        }

        const ctx = Sprite.collisionCtx!;
        ctx.clearRect(0, 0, width, height);

        // Draw first sprite
        ctx.save();
        ctx.translate(this.x - xMin, height - this.y + yMin);
        ctx.rotate(this.toRadians(this.dir));
        ctx.fillStyle = 'red';
        ctx.fill(this.getCachedPath());
        ctx.restore();
        const img1 = ctx.getImageData(0, 0, width, height).data;

        // Draw second sprite
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(sprite.x - xMin, height - sprite.y + yMin);
        ctx.rotate(this.toRadians(sprite.dir));
        ctx.fillStyle = 'blue';
        ctx.fill(sprite.getCachedPath());
        ctx.restore();
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
        this.dir = 90 - this.toDegrees(Math.atan2(y, x));
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

    // Looks

    public show() {
        this.hidden = false;
        this.refresh();
    }

    public hide() {
        this.hidden = true;
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