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
    lifetime: number;
    modifiers: Map<string, unknown>;
}

export default class Particle {

    public x: number;
    public y: number;
    public vX: number;
    public vY: number;
    public dir: number;
    public color: string;
    public size: number;

    public startTime: number;

    public draw(alpha = 1) {
        penCtx.save();
        this.applyDrawTransform();

        const { r, g, b } = TSCMath.colorToRGB(this.color);

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
        penCtx.rotate(TSCMath.toRadians(this.dir));
    }

    constructor(options: ParticleOptions) {
        this.x = options.x;
        this.y = options.y;
        this.dir = 0;
        this.color = options.color;
        this.size = Math.max(
            1,
            options.modifiers.has('randomSize')
                ? Math.max(
                    options.size * (options.modifiers.get('randomSize') as number),
                    options.size * Math.random()
                )
                : options.size
        );

        const percentage = this.size / options.size;

        if (options.modifiers.has('parallax')) {
            this.vX = options.vX * percentage;
            this.vY = options.vY * percentage;
        }
        else if (options.modifiers.has('randomSpeed')) {
            this.vX = Math.max(options.vX * (options.modifiers.get('randomSpeed') as number), options.vX * Math.random());
            this.vY = Math.max(options.vY * (options.modifiers.get('randomSpeed') as number), options.vY * Math.random());
        }
        else {
            this.vX = options.vX;
            this.vY = options.vY;
        }

        this.startTime = Engine.init().getElapsedTime() + (options.modifiers.has('parallax')
            ? (1 / percentage - 1) * options.lifetime * 1000
            : 0
        );
    }
}