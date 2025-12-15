import Engine from '../../Engine.ts';
import TSCMath from '../../TSCMath.ts';
import { canvas } from '../../canvas.ts';
import Pen, { type PenOptions } from '../Pen.ts';
import CustomPolygon from '../CustomPolygon.ts';
import type Object3D from './Object3D.ts';
import type { Vec2, Vec3 } from '../../types/Vectors.ts';

export interface SolidRenderer3DOptions extends PenOptions {
    objects: Object3D[];
}

type FaceDepth = {
    face: number[];
    depth: number;
};

export default class SolidRenderer3D extends Pen {

    public FOV = 60;
    public ASPECT = canvas.width / canvas.height;
    public Z_NEAR = 0.01;

    public SPEED = 2;
    public SENSITIVITY = 225;

    public AMBIENT_LIGHT_INTENSITY = 0.25;
    public DIRECTED_LIGHT_INTENSITY = 0.75;
    public DIRECTED_LIGHT_DIR: Vec3 = [0, 1, 0];

    public camX = 0;
    public camY = 0;
    public camZ = 0;
    public camDirX = 0;
    public camDirY = 0;
    public camDirZ = 0;

    public objects: Object3D[];

    constructor(options: SolidRenderer3DOptions) {
        super(options);
        this.objects = options.objects;
    }

    // Controls
    public registerControls() {
        const engine = Engine.init();

        const dt = engine.deltaTime;

        const sinY = TSCMath.sin(this.camDirY);
        const cosY = TSCMath.cos(this.camDirY);

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

        const maxPitch = 89;
        this.camDirX = Math.max(-maxPitch, Math.min(maxPitch, this.camDirX));
    }

    // Perspective projection
    private project(vertices: Vec3[]): Vec2[] {

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

    // Render (run every frame)
    public render() {
        const sinX = TSCMath.sin(this.camDirX);
        const cosX = TSCMath.cos(this.camDirX);
        const sinY = TSCMath.sin(this.camDirY);
        const cosY = TSCMath.cos(this.camDirY);
        const sinZ = TSCMath.sin(this.camDirZ);
        const cosZ = TSCMath.cos(this.camDirZ);

        // Calculate the lighting normal relative to the cameras rotation
        let lx = this.DIRECTED_LIGHT_DIR[0];
        let ly = this.DIRECTED_LIGHT_DIR[1];
        let lz = this.DIRECTED_LIGHT_DIR[2];

        // yaw
        const lx1 = lx * cosY - lz * sinY;
        const lz1 = lx * sinY + lz * cosY;

        // pitch
        const ly2 = ly * cosX - lz1 * sinX;
        const lz2 = ly * sinX + lz1 * cosX;

        // roll
        const lx3 = lx1 * cosZ - ly2 * sinZ;
        const ly3 = lx1 * sinZ + ly2 * cosZ;

        const lightDir = TSCMath.normalize([lx3, ly3, lz2]);

        for (const obj of this.objects) {

            const { h, s, l } = this.stringToHSL(obj.color || 'black');

            // Camera relative vertices
            const cameraVerts: Vec3[] = obj.vertices.map(v => {
                let x = v[0] * obj.scale + obj.x - this.camX;
                let y = v[1] * obj.scale + obj.y - this.camY;
                let z = v[2] * obj.scale + obj.z - this.camZ;

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

            // Face depth calculation
            const faces: FaceDepth[] = obj.faces.map(face => {
                let z = 0;
                for (const i of face) z += cameraVerts[i]![2];
                return { face, depth: z / face.length };
            });

            // Painter's algorithm (face sorting)
            faces.sort((a, b) => b.depth - a.depth);

            const projected = this.project(cameraVerts);

            // Render faces
            for (const { face } of faces) {

                // Calculate face normal using Newell's method (works for polygons with any number of vertices)
                let nx = 0, ny = 0, nz = 0;
                for (let i = 0; i < face.length; i++) {
                    const v1 = cameraVerts[face[i]!]!;
                    const v2 = cameraVerts[face[(i + 1) % face.length]!]!;
                    nx += (v1[1] - v2[1]) * (v1[2] + v2[2]);
                    ny += (v1[2] - v2[2]) * (v1[0] + v2[0]);
                    nz += (v1[0] - v2[0]) * (v1[1] + v2[1]);
                }
                const normal = TSCMath.normalize([nx, ny, nz] as Vec3);

                // Calculate lighting: dot product between normal and light direction
                const diffuse = Math.max(0, TSCMath.dot(normal, lightDir));
                const brightness =
                    this.AMBIENT_LIGHT_INTENSITY +
                    diffuse * this.DIRECTED_LIGHT_INTENSITY;

                // Adjust the brightness
                const litL = Math.min(100, Math.max(5, l + brightness * 50));
                const color = `hsl(${h}, ${s}%, ${litL}%)`;

                // Draw the polygon
                const vertices = face.map(vIndex => projected[vIndex]!);
                this.drawSprite(new CustomPolygon({ vertices, color }));
            }
        }
    }

    public stringToHSL(color: string) {

        // String to RGB
        const el = document.createElement('div');
        el.style.color = color;

        document.body.appendChild(el);
        const rgb = getComputedStyle(el).color;
        document.body.removeChild(el);

        let [r, g, b] = rgb.match(/\d+/g)!.map(Number) as [number, number, number];

        // RGB to HSL
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        let l = (max + min) / 2;

        if (max === min)
            h = s = 0; // achromatic
        else {
            const d = max - min;
            s = l > 0.5
                ? d / (2 - max - min)
                : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }

        return { h, s: s * 100, l: l * 100 };
    }
}