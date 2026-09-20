import Engine from './Engine.ts';
import type Sprite from './Sprite.ts';
import TSCMath from './TSCMath.ts';

interface Lockings {
    x: Sprite | null;
    y: Sprite | null;
    dir: Sprite | null;
    zoom: Sprite | null;
}

export default class Camera {

    public x = 0;
    public y = 0;
    public zoom = 1;
    public dir = 0;

    public lockings: Lockings = {
        x: null,
        y: null,
        dir: null,
        zoom: null
    };
    public fixedSprites: Set<Sprite> = new Set;

    // Sprite fixing
    public setFixedSprites(sprites: Sprite[]) {
        this.fixedSprites = new Set(sprites);
    }

    // Sprite locking
    public lock(sprite: Sprite) {
        this.lockings.x = sprite;
        this.lockings.y = sprite;
        this.lockings.dir = sprite;
        this.lockings.zoom = sprite;
        this.refresh();
    }

    public unlock() {
        this.lockings.x = null;
        this.lockings.y = null;
        this.lockings.dir = null;
        this.lockings.zoom = null;
        this.refresh();
    }

    public lockX(sprite: Sprite) {
        this.lockings.x = sprite;
        this.refresh();
    }

    public unlockX() {
        this.lockings.x = null;
        this.refresh();
    }

    public lockY(sprite: Sprite) {
        this.lockings.y = sprite;
        this.refresh();
    }

    public unlockY() {
        this.lockings.y = null;
        this.refresh();
    }

    public lockDir(sprite: Sprite) {
        this.lockings.dir = sprite;
        this.refresh();
    }

    public unlockDir() {
        this.lockings.dir = null;
        this.refresh();
    }

    public lockZoom(sprite: Sprite) {
        this.lockings.zoom = sprite;
        this.refresh();
    }

    public unlockZoom() {
        this.lockings.zoom = null;
        this.refresh();
    }

    // Position
    public goTo(x: number, y: number) {
        this.x = x;
        this.y = y;
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

    public changeX(dx: number) {
        this.x += dx;
        this.refresh();
    }

    public changeY(dy: number) {
        this.y += dy;
        this.refresh();
    }

    public move(steps: number) {
        this.x += steps * TSCMath.sin(this.dir);
        this.y += steps * TSCMath.cos(this.dir);
        this.refresh();
    }

    // dir
    public point(deg: number) {
        this.dir = deg;
        this.refresh();
    }

    public turn(deg: number) {
        this.dir += deg;
        this.refresh();
    }

    // Zoom
    public setZoom(zoom: number) {
        this.zoom = Math.max(0.01, zoom);
        this.refresh();
    }

    public changeZoom(zoomChange: number) {
        this.zoom *= Math.pow(1.1, zoomChange);
        if (this.zoom < 0.01) this.zoom = 0.01;
        this.refresh();
    }

    // Reset
    public reset() {
        this.x = 0;
        this.y = 0;
        this.dir = 0;
        this.zoom = 1;
        this.unlock();
        this.setFixedSprites([]);
        this.refresh();
    }

    // Re-paint
    private refresh() {
        Engine.init().refresh();
    }
}