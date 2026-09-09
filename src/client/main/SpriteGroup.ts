import type { Vec2 } from '@ctypes/Vectors.ts';
import type Sprite from './Sprite.ts';
import TSCMath from './TSCMath.ts';
import type { BoundingBox } from './Sprite.ts';

export interface SpriteGroupOptions {
    sprites?: Sprite[];
    dir?: number;
    scene?: string;
}

export default class SpriteGroup {

    public sprites: Set<Sprite>;
    public dir: number;
    public scene: string;

    // Collision
    public touching(sprite: Sprite, options: { precision: 'AABB' | 'partial' }) {
        return sprite.touching(this, options);
    }

    public getBoundingBox(): BoundingBox {

        if (this.sprites.size < 1) return { x: 0, y: 0, width: 0, height: 0 }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const sprite of this.sprites) {
            const AABB = sprite.getBoundingBox();
            
            const left = AABB.x - AABB.width / 2;
            const bottom = AABB.y - AABB.height / 2
            const right = AABB.x + AABB.width / 2;
            const top = AABB.y + AABB.height / 2;

            if (left < minX) minX = left;
            if (bottom < minY) minY = bottom;
            if (right > maxX) maxX = right;
            if (top > maxY) maxY = top;
        }

        return {
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    // Motion
    public changeX(dx: number) {
        for (const sprite of this.sprites)
            sprite.changeX(dx);
    }

    public changeY(dy: number) {
        for (const sprite of this.sprites)
            sprite.changeY(dy);
    }

    public move(steps: number) {
        for (const sprite of this.sprites) {
            sprite.changeX(steps * TSCMath.sin(this.dir));
            sprite.changeY(steps * TSCMath.cos(this.dir));
        }
    }

    // Rotation
    public point(pivot: Vec2, deg: number) {
        const delta = deg - this.dir;
        this.dir = deg;

        for (const sprite of this.sprites) {
            const dx = sprite.x - pivot[0];
            const dy = sprite.y - pivot[1];
            const [rx, ry] = SpriteGroup.rotateAroundPivot(dx, dy, delta);

            sprite.changeX(pivot[0] + rx - sprite.x);
            sprite.changeY(pivot[1] + ry - sprite.y);
            sprite.point(sprite.dir + delta);
        }
    }

    public turn(pivot: Vec2, deg: number) {
        this.dir += deg;

        for (const sprite of this.sprites) {
            const dx = sprite.x - pivot[0];
            const dy = sprite.y - pivot[1];
            const [rx, ry] = SpriteGroup.rotateAroundPivot(dx, dy, deg);

            sprite.changeX(pivot[0] + rx - sprite.x);
            sprite.changeY(pivot[1] + ry - sprite.y);
            sprite.turn(deg);
        }
    }

    private static rotateAroundPivot(dx: number, dy: number, deg: number): Vec2 {
        const sin = TSCMath.sin(deg);
        const cos = TSCMath.cos(deg);

        return [
            dx * cos + dy * sin,
            -dx * sin + dy * cos,
        ];
    }

    // Sprite adding/removing
    public addSprite(sprite: Sprite) {
        if (sprite.scene === this.scene)
            this.sprites.add(sprite);
    }

    public removeSprite(sprite: Sprite) {
        this.sprites.delete(sprite);
    }

    // Initialization
    constructor(options?: SpriteGroupOptions) {

        this.sprites = new Set(options
            ?.sprites
            ?.filter(s => s.scene === (options.scene ?? 'main')) ?? []);

        this.dir = options?.dir ?? 0;
        this.scene = options?.scene ?? 'main';
    }
}