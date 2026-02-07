import Engine from './Engine.ts';
import type { Vec2 } from '@ctypes/Vectors.ts';
import TSCMath from './TSCMath.ts';

export interface CollisionData {
    contact: Vec2;
    normal: Vec2;
    displacement: number;
}

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
    private pathDirty = true;

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

    // Geometry caching

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



    // Initialization

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

    public touching(sprite: Sprite): CollisionData | null {

        // Return if hidden or if the scenes differ
        if (this.hidden || sprite.hidden || (this.scene !== '*' && sprite.scene !== '*' && this.scene !== sprite.scene)) return null;

        // AABB (bounding boxes)
        const bBox1 = this.getBoundingBox();
        const bBox2 = sprite.getBoundingBox();

        const aabbOverlap =
            Math.abs(bBox1.x - bBox2.x) < (bBox1.width + bBox2.width) / 2 &&
            Math.abs(bBox1.y - bBox2.y) < (bBox1.height + bBox2.height) / 2;

        if (!aabbOverlap) return null;

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

        if (width < 1 || height < 1) return null;

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

        // Helper to draw a sprite into collision canvas - must match draw() transform exactly:
        // translate to (x,y), rotate, then translate(-pivot). Use position, not bBox center.
        const drawSprite = (sprite: Sprite, color: string) => {
            ctx.save();

            const dx = sprite.x - xMin;
            const dy = yMax - sprite.y; // flip Y to match draw()

            ctx.translate(dx, dy);
            ctx.rotate(sprite.toRadians(sprite.dir));
            ctx.translate(-sprite.pivot[0] * sprite.size, sprite.pivot[1] * sprite.size);

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
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        const overlapPixels: number[] = [];

        for (let i = 3; i < img1.length; i += 4) {
            if (img1[i]! > 0 && img2[i]! > 0) {
                
                const pixelIndex = i / 4;
                overlapPixels.push(pixelIndex);

                const px = pixelIndex % width;
                const py = Math.floor(pixelIndex / width);

                sumX += px;
                sumY += py;
                count++;
            }
        }

        if (count === 0) return null;

        // Compute collision data

        // Contact point
        const localX = sumX / count;
        const localY = sumY / count;

        const contact: Vec2 = [
            xMin + localX,
            yMax - localY // undo Y flip
        ];

        // Normal
        let nx = 0;
        let ny = 0;

        for (const pixelIndex of overlapPixels) {
            const px = pixelIndex % width;
            const py = Math.floor(pixelIndex / width);
            
            // We look at the "distance" of this overlap pixel from the center of the overlap
            // to find the 'bias' of the collision area
            nx += (px - localX);
            ny += (py - localY); 
        }

        // If the pixel cloud is too uniform, fall back to center-to-contact logic
        if (Math.abs(nx) < 0.01 && Math.abs(ny) < 0.01) {
            nx = this.x - contact[0];
            ny = this.y - contact[1];
        }

        const n: Vec2 = [nx, -ny]; // Note the -ny to fix coordinate flip
        const normal: Vec2 = TSCMath.magnitude(n) > 0 ? TSCMath.normalize(n) : n;

        // Ensure orientation
        const dx = this.x - sprite.x;
        const dy = this.y - sprite.y;
        if (dx * normal[0] + dy * normal[1] < 0) {
            normal[0] *= -1;
            normal[1] *= -1;
        }

        // Penetration
        let displacement = -Infinity;

        for (const pixelIndex of overlapPixels) {
            const px = pixelIndex % width;
            const py = Math.floor(pixelIndex / width);

            const wx = xMin + px;
            const wy = yMax - py;

            const d =
                (wx - contact[0]) * normal[0] +
                (wy - contact[1]) * normal[1];

            displacement = Math.max(displacement, d);
        }

        return { contact, normal, displacement };
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

    // Helpers

    protected getDrawOffset(): [number, number] {
        const [x, y] = this.pivot;
        const sin = TSCMath.sin(this.dir);
        const cos = TSCMath.cos(this.dir);

        const rx = -x * cos - y * sin;
        const ry = -x * sin + y * cos;

        return [rx * this.size, ry * this.size];
    }
}