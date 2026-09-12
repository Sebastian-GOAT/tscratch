import { canvas, penCtx } from '@main/canvas.ts';
import Engine from '@main/Engine.ts';
import TSCMath from '@main/TSCMath.ts';

interface ParticleOptions {
    x: number;
    y: number;
    vX: number;
    vY: number;
    color: string;
    size: number;
}

export default class Particle {

    public x: number;
    public y: number;
    public vX: number;
    public vY: number;
    public color: string;
    public size: number;

    public startTime: number;

    public draw(alpha = 1) {
        penCtx.save();
        this.applyDrawTransform();

        const { r, g, b } = TSCMath.toRGB(this.color);

        penCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        penCtx.fillRect(
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );

        penCtx.restore();
    }

    private applyDrawTransform(): void {
        const camera = Engine.init().camera;

        penCtx.translate(canvas.width / 2, canvas.height / 2);
        penCtx.scale(camera.zoom, camera.zoom);
        penCtx.rotate(-TSCMath.toRadians(camera.rotation));
        penCtx.translate(this.x - camera.x, -(this.y - camera.y));
    }

    constructor(options: ParticleOptions) {
        this.startTime = Engine.init().getElapsedTime();
        this.x = options.x;
        this.y = options.y;
        this.vX = options.vX;
        this.vY = options.vY;
        this.color = options.color;
        this.size = options.size;
    }
}