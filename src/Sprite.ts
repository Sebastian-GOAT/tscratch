import Engine from './Engine.ts';

export default abstract class Sprite {

    public x: number = 0;
    public y: number = 0;
    public dir: number = 90;

    // Rendering

    public abstract draw(): void;

    protected refresh() {
        Engine.init().refresh();
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
        this.refresh();
    }

    public turn(deg: number) {
        this.dir += deg;
        this.refresh();
    }

    public pointInDirection(dir: number) {
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

    // Control
    public async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}