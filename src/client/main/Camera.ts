import Engine from "./Engine.ts";
import TSCMath from "./TSCMath.ts";

export default class Camera {

    public x = 0;
    public y = 0;
    public zoom = 1;
    public rotation = 0;

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
        this.x += steps * TSCMath.sin(this.rotation);
        this.y += steps * TSCMath.cos(this.rotation);
        this.refresh();
    }

    // Rotation
    public point(deg: number) {
        this.rotation = deg;
        this.refresh();
    }

    public turn(deg: number) {
        this.rotation += deg;
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

    // Re-paint
    private refresh() {
        Engine.init().refresh();
    }
}