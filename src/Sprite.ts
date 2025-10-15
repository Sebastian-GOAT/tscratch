import Engine from './Engine.ts';

export interface SpriteOptions {
    x?: number;
    y?: number;
    dir?: number;
};

export default abstract class Sprite {

    public x: number;
    public y: number;
    public dir: number;

    // Rendering

    public abstract draw(): void;

    protected refresh() {
        Engine.init().refresh();
    }

    constructor(options?: SpriteOptions) {
        this.x = options?.x ?? 0;
        this.y = options?.y ?? 0;
        this.dir = options?.dir ?? 0;
        Engine.init().addSprites(this);
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
}