import Engine from '../../Engine.ts';
import Circle, { type CircleOptions } from '../Circle.ts';
import type { RigidBodyOptions } from './RigidBodyOptions.ts';

export interface RigidCircleOptions extends CircleOptions, Partial<RigidBodyOptions> {}

export default class RigidCircle extends Circle implements RigidBodyOptions {

    public gravity: number;
    public vX: number;
    public vY: number;
    public drag: number;
    public bounceLoss: number;

    public update() {

        const engine = Engine.init();

        this.vY += this.gravity;
        this.vY *= this.drag;
        this.vX *= this.drag;

        const x = this.x + this.vX;
        const y = this.y + this.vY;

        const localCircles = engine.sceneMap.get(this.scene)!.sprites.filter(s => s.discriminant === 'circle');
        const globalCircles = engine.sceneMap.get('*')!.sprites.filter(s => s.discriminant === 'circle');
        const circles = [...localCircles, ...globalCircles];

        const steps = Math.ceil(this.distanceTo(x, y) / (2 * this.radius));

        for (let i = 0; i < steps; i++) {
            for (const circle of circles) {
                if (this.touching(circle)) {

                    const nx = this.x - circle.x;
                    const ny = this.y - circle.y;
                    const dist = Math.sqrt(nx * nx + ny * ny);

                    // Avoid division by zero
                    if (dist === 0) continue;

                    const nxn = nx / dist;
                    const nyn = ny / dist;

                    // Dot product of velocity and normal
                    const dot = this.vX * nxn + this.vY * nyn;

                    // Reflect velocity along normal and apply bounceLoss
                    this.vX = (this.vX - 2 * dot * nxn) * this.bounceLoss;
                    this.vY = (this.vY - 2 * dot * nyn) * this.bounceLoss;

                    return;
                }
            }
        }

        this.goTo(x, y);
    }

    constructor(options?: RigidCircleOptions) {
        super(options);

        this.gravity = options?.gravity ?? -0.9;
        this.drag = options?.drag ?? 0.98;
        this.bounceLoss = options?.bounceLoss ?? 0.9;
        this.vX = options?.vX ?? 0;
        this.vY = options?.vY ?? 0;
    }
}