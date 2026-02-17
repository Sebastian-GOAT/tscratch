import Engine from '@main/Engine.ts';
import TSCMath from '@main/TSCMath.ts';
import { canvas } from '@main/canvas.ts';
import Pen, { type PenOptions } from '@sprites/Pen.ts';
import type Object3D from './Object3D.ts';
import type { Vec2, Vec3 } from '@ctypes/Vectors.ts';
import type Camera3D from './Camera3D.ts';

export interface Renderer3DOptions extends PenOptions {
    objects: Object3D[];
    camera: Camera3D;
}

export default abstract class Renderer3D extends Pen {

    public FOV = 60;
    public ASPECT = canvas.width / canvas.height;
    public Z_NEAR = 0.01;

    public SPEED = 2;
    public SENSITIVITY = 225;

    public camera: Camera3D;

    public objects: Object3D[];

    constructor(options: Renderer3DOptions) {
        super(options);
        this.objects = options.objects;
        this.camera = options.camera;
    }

    // Render (run every frame)
    public abstract render(): void;

    // Controls
    public registerControls() {

        const engine = Engine.init();

        const dt = engine.deltaTime;

        const sinY = TSCMath.sin(this.camera.dirY);
        const cosY = TSCMath.cos(this.camera.dirY);

        if (engine.keyPressed('w')) {
            this.camera.x += this.SPEED * sinY * dt;
            this.camera.z += this.SPEED * cosY * dt;
        }
        if (engine.keyPressed('a')) {
            this.camera.x -= this.SPEED * cosY * dt;
            this.camera.z += this.SPEED * sinY * dt;
        }
        if (engine.keyPressed('s')) {
            this.camera.x -= this.SPEED * sinY * dt;
            this.camera.z -= this.SPEED * cosY * dt;
        }
        if (engine.keyPressed('d')) {
            this.camera.x += this.SPEED * cosY * dt;
            this.camera.z -= this.SPEED * sinY * dt;
        }

        if (engine.keyPressed('e'))
            this.camera.y += this.SPEED * dt;
        if (engine.keyPressed('q'))
            this.camera.y -= this.SPEED * dt;

        if (engine.keyPressed('up'))
            this.camera.dirX += this.SENSITIVITY * dt;
        if (engine.keyPressed('down'))
            this.camera.dirX -= this.SENSITIVITY * dt;
        if (engine.keyPressed('left'))
            this.camera.dirY -= this.SENSITIVITY * dt;
        if (engine.keyPressed('right'))
            this.camera.dirY += this.SENSITIVITY * dt;

        const maxPitch = 89;
        this.camera.dirX = Math.max(-maxPitch, Math.min(maxPitch, this.camera.dirX));
    }

    // Perspective projection
    protected project(vertices: Vec3[]): Vec2[] {

        const f = 1 / TSCMath.tan(this.FOV / 2);

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

    protected getRelativeVertices(obj: Object3D): Vec3[] {

        const sinX = TSCMath.sin(this.camera.dirX);
        const cosX = TSCMath.cos(this.camera.dirX);
        const sinY = TSCMath.sin(this.camera.dirY);
        const cosY = TSCMath.cos(this.camera.dirY);
        const sinZ = TSCMath.sin(this.camera.dirZ);
        const cosZ = TSCMath.cos(this.camera.dirZ);

        return obj.vertices.map(v => {
            let x = v[0] * obj.size + obj.x - this.camera.x;
            let y = v[1] * obj.size + obj.y - this.camera.y;
            let z = v[2] * obj.size + obj.z - this.camera.z;

            // yaw (Y)
            const x1 = x * cosY - z * sinY;
            const z1 = x * sinY + z * cosY;

            // pitch (X)
            const y2 = y * cosX - z1 * sinX;
            const z2 = y * sinX + z1 * cosX;

            // roll (Z)
            const x3 = x1 * cosZ - y2 * sinZ;
            const y3 = x1 * sinZ + y2 * cosZ;

            return [x3, y3, z2];
        });
    }
}