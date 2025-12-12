import { canvas } from '../../canvas.ts';
import Pen, { type PenOptions } from '../Pen.ts';
import Engine from '../../Engine.ts';
import type Object3D from './Object3D.ts';
import type { Vec2, Vec3 } from '../../types/Vectors.ts';

export interface WireframeRenderer3DOptions extends PenOptions {
    objects: Object3D[];
}

export default class WireframeRenderer3D extends Pen {

    public FOV = 60;
    public ASPECT = canvas.width / canvas.height;
    public Z_NEAR = 0.01;

    public SPEED = 2;
    public SENSITIVITY = 300;

    public camX = 0;
    public camY = 0;
    public camZ = 0;
    public camDirX = 0;
    public camDirY = 0;
    public camDirZ = 0;

    public objects: Object3D[];

    constructor(options: WireframeRenderer3DOptions) {
        super(options);
        this.objects = options.objects;
    }

    // Controls
    public registerControls() {
        const engine = Engine.init();

        const dt = engine.deltaTime;

        const sinY = engine.sin(this.camDirY);
        const cosY = engine.cos(this.camDirY);

        if (engine.keyPressed('w')) {
            this.camX += this.SPEED * sinY * dt;
            this.camZ += this.SPEED * cosY * dt;
        }
        if (engine.keyPressed('a')) {
            this.camX -= this.SPEED * cosY * dt;
            this.camZ += this.SPEED * sinY * dt;
        }
        if (engine.keyPressed('s')) {
            this.camX -= this.SPEED * sinY * dt;
            this.camZ -= this.SPEED * cosY * dt;
        }
        if (engine.keyPressed('d')) {
            this.camX += this.SPEED * cosY * dt;
            this.camZ -= this.SPEED * sinY * dt;
        }

        if (engine.keyPressed('e'))
            this.camY += this.SPEED * dt;
        if (engine.keyPressed('q'))
            this.camY -= this.SPEED * dt;

        if (engine.keyPressed('up'))
            this.camDirX += this.SENSITIVITY * dt;
        if (engine.keyPressed('down'))
            this.camDirX -= this.SENSITIVITY * dt;
        if (engine.keyPressed('left'))
            this.camDirY -= this.SENSITIVITY * dt;
        if (engine.keyPressed('right'))
            this.camDirY += this.SENSITIVITY * dt;
    }

    // Perspective projection
    private project(vertices: Vec3[]): Vec2[] {

        const f = 1 / Engine.init().tan(this.FOV / 2);

        return vertices.map(v => {
            const x = v[0];
            const y = v[1];
            const z = v[2] < this.Z_NEAR ? this.Z_NEAR : v[2];

            // Perspective divide for x and y
            const xp = canvas.width / 2 * (x * f) / (z * this.ASPECT);
            const yp = canvas.height / 2 * (y * f) / z;

            return [xp, yp];
        });
    }

    // Render update (run every frame)
    public update() {
        const engine = Engine.init();

        const sinX = engine.sin(this.camDirX);
        const cosX = engine.cos(this.camDirX);
        const sinY = engine.sin(this.camDirY);
        const cosY = engine.cos(this.camDirY);
        const sinZ = engine.sin(this.camDirZ);
        const cosZ = engine.cos(this.camDirZ);

        for (const obj of this.objects) {

        const projected = this.project(
            obj.vertices.map(v => {
                let x = v[0] + obj.x - this.camX;
                let y = v[1] + obj.y - this.camY;
                let z = v[2] + obj.z - this.camZ;

                // Y (yaw)
                let x1 = x * cosY - z * sinY;
                let z1 = x * sinY + z * cosY;

                // X (pitch)
                let y2 = y * cosX - z1 * sinX;
                let z2 = y * sinX + z1 * cosX;

                // Z (roll)
                let x3 = x1 * cosZ - y2 * sinZ;
                let y3 = x1 * sinZ + y2 * cosZ;

                return [x3, y3, z2] as Vec3;
            })
        );
    
            for (const f of obj.faces) {
    
                const [x, y] = projected[f[0]]!;
                this.goTo(x, y);
                this.down();
    
                for (const vIndex of f) {
                    const [x, y] = projected[vIndex]!;
                    this.goTo(x, y);
                }
    
                this.goTo(x, y);
                this.up();
            }
        }
    }
}