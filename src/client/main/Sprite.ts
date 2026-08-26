import Engine from './Engine.ts';
import type { Vec2 } from '@ctypes/Vectors.ts';
import TSCMath from './TSCMath.ts';
import { canvas } from './canvas.ts';

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
    private previousPressed = false;

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

    public onPress(callback: () => void, options: { allowHold: boolean } = { allowHold: true }) {
        const engine = Engine.init();

        engine.onPress(() => {
            const hovering = engine.hovering(this);
            const isCurrentlyPressed = hovering && engine.mouseDown;

            if (!this.hidden && isCurrentlyPressed && (options.allowHold || !this.previousPressed))
                callback();

            this.previousPressed = isCurrentlyPressed;
        });
    }

    // AABB    - Only AABB check, return true/false
    // partial - Pixel perfect but only return true/false
    // full    - Pixel perfect + collision data population, return CollisionData/null
    public touching(sprite: Sprite, options: { precision: 'AABB' | 'partial' }): boolean;
    public touching(sprite: Sprite, options: { precision: 'full' }): CollisionData | null;
    public touching(sprite: Sprite): boolean; // Defaults to 'partial'
    public touching(
        sprite: Sprite,
        options: { precision: 'AABB' | 'full' | 'partial' } = { precision: 'partial' }
    ): boolean | CollisionData | null {

        // Return if hidden or if the scenes differ
        if (this.hidden || sprite.hidden || (this.scene !== '*' && sprite.scene !== '*' && this.scene !== sprite.scene)) return null;

        // AABB (bounding boxes)
        const bBox1 = this.getBoundingBox();
        const bBox2 = sprite.getBoundingBox();

        const aabbOverlap =
            Math.abs(bBox1.x - bBox2.x) < (bBox1.width + bBox2.width) / 2 &&
            Math.abs(bBox1.y - bBox2.y) < (bBox1.height + bBox2.height) / 2;

        if (!aabbOverlap) return options.precision === 'full' ? null : false;
        if (options.precision === 'AABB') return true;

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

        if (width < 1 || height < 1) return options.precision === 'full' ? null : false;

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

        for (let i = 3; i < img1.length; i += 4) {
            if (img1[i]! > 0 && img2[i]! > 0) {

                if (options.precision === 'partial') return true;

                const pixelIndex = (i - 3) / 4;
                const px = pixelIndex % width;
                const py = Math.floor(pixelIndex / width);

                sumX += px;
                sumY += py;
                count++;
            }
        }

        if (count === 0) return options.precision === 'full' ? null : false;

        const localX = sumX / count;
        const localY = sumY / count;

        // Calculate second moments (covariance) of overlap pixel distribution to find surface alignment
        let covXX = 0;
        let covYY = 0;
        let covXY = 0;

        for (let i = 3; i < img1.length; i += 4) {
            if (img1[i]! > 0 && img2[i]! > 0) {
                const pixelIndex = (i - 3) / 4;
                const dx = (pixelIndex % width) - localX;
                const dy = (yMax - Math.floor(pixelIndex / width)) - (yMax - localY);

                covXX += dx * dx;
                covYY += dy * dy;
                covXY += dx * dy;
            }
        }

        // The normal to the surface is orthogonal to the major axis of the contact area
        let normalX = 0;
        let normalY = 0;

        if (Math.abs(covXY) > 1e-4) {
            const trace = covXX + covYY;
            const det = covXX * covYY - covXY * covXY;
            const lambda = trace / 2 - Math.sqrt(Math.max(0, (trace * trace) / 4 - det)); // Minor eigenvalue
            normalX = covXY;
            normalY = lambda - covXX;
        } else {
            // Axis-aligned case
            if (covXX < covYY) {
                normalX = 1;
                normalY = 0;
            } else {
                normalX = 0;
                normalY = 1;
            }
        }

        let normal: Vec2 = [normalX, normalY];
        let nMag = TSCMath.magnitude(normal);

        if (nMag < 1e-4) {
            const delta: Vec2 = [this.x - sprite.x, this.y - sprite.y];
            normal = TSCMath.magnitude(delta) > 0 ? TSCMath.normalize(delta) : [0, 1];
        } else {
            normal = [normal[0] / nMag, normal[1] / nMag];
            // Ensure normal points from `sprite` towards `this`
            const centerDelta: Vec2 = [this.x - sprite.x, this.y - sprite.y];
            if (normal[0] * centerDelta[0] + normal[1] * centerDelta[1] < 0) {
                normal = [-normal[0], -normal[1]];
            }
        }

        const overlapContact: Vec2 = [
            xMin + localX,
            yMax - localY
        ];

        let thisMinProjection = Infinity;
        let spriteMaxProjection = -Infinity;
        let thisSupport: Vec2 = overlapContact;
        let spriteSupport: Vec2 = overlapContact;

        const updateSupports = (image: typeof img1, isThisSprite: boolean) => {
            for (let i = 3; i < image.length; i += 4) {
                if (image[i]! === 0) continue;

                const pixelIndex = (i - 3) / 4;
                const point: Vec2 = [
                    xMin + (pixelIndex % width) + 0.5,
                    yMax - Math.floor(pixelIndex / width) - 0.5
                ];
                const projection = point[0] * normal[0] + point[1] * normal[1];

                if (isThisSprite) {
                    if (projection < thisMinProjection) {
                        thisMinProjection = projection;
                        thisSupport = point;
                    }
                } else if (projection > spriteMaxProjection) {
                    spriteMaxProjection = projection;
                    spriteSupport = point;
                }
            }
        };

        updateSupports(img1, true);
        updateSupports(img2, false);

        const displacement = Math.max(0, spriteMaxProjection - thisMinProjection);
        const contact: Vec2 = [
            (thisSupport[0] + spriteSupport[0]) / 2,
            (thisSupport[1] + spriteSupport[1]) / 2
        ];

        return { contact, normal, displacement };
    }

    // Collision check in all pairs, T( n(n-1)/2 )
    public static touchingPairs<T extends Sprite = Sprite>(
        sprites: T[],
        collisionHandler: ((sprite1: T, sprite2: T) => void),
        options: { precision: 'AABB' | 'partial' } = { precision: 'partial' }
    ) {
        for (let i = 0; i < sprites.length; i++) {
            for (let j = i + 1; j < sprites.length; j++) {

                const sprite1 = sprites[i]!;
                const sprite2 = sprites[j]!;

                const touching = sprite1.touching(sprite2, { precision: options.precision });

                if (touching) collisionHandler(sprite1, sprite2);
            }
        }
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
        this.x += steps * TSCMath.sin(this.dir);
        this.y += steps * TSCMath.cos(this.dir);
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

    // Tag getters

    public static getSpriteByTagName(tag: string) {
        const engine = Engine.init();
        
        return engine
            .sceneMap.get(engine.currentScene)!
            .sprites.filter(s => s.tags.has(tag));
    }

    // Helpers

    protected applyDrawTransform(c: CanvasRenderingContext2D): void {
        const camera = Engine.init().camera;

        c.translate(canvas.width / 2, canvas.height / 2);
        c.scale(camera.zoom, camera.zoom);
        c.rotate(-this.toRadians(camera.rotation));
        c.translate(this.x - camera.x, -(this.y - camera.y));
        c.rotate(this.toRadians(this.dir));
        c.translate(-this.pivot[0] * this.size, this.pivot[1] * this.size);
    }

    protected getDrawOffset(): [number, number] {
        const [x, y] = this.pivot;
        const sin = TSCMath.sin(this.dir);
        const cos = TSCMath.cos(this.dir);

        const rx = -x * cos - y * sin;
        const ry = x * sin - y * cos;

        return [rx * this.size, ry * this.size];
    }
}