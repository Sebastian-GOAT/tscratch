import Engine from '../../Engine.ts';
import type { Vec3 } from '../../types/Vectors.ts';

export interface Object3DOptions {
    vertices: Vec3[];
    faces: [number, number, ...number[]][];

    x?: number;
    y?: number;
    z?: number;
}

export default class Object3D {

    public x = 0;
    public y = 0;
    public z = 0;

    public rotX = 0;
    public rotY = 0;
    public rotZ = 0;

    public vertices: Vec3[];
    public faces: [number, number, ...number[]][];

    constructor(options: Object3DOptions) {
        this.vertices = options.vertices;
        this.faces = options.faces;

        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.z = options.z ?? 2;
    }

    public rotateX(deg: number) {

        const engine = Engine.init();

        const cos = engine.cos(deg);
        const sin = engine.sin(deg);

        for (let i = 0; i < this.vertices.length; i++) {
            const [_, y, z] = this.vertices[i]!;

            this.vertices[i]![1] = y * cos - z * sin;
            this.vertices[i]![2] = y * sin + z * cos;
        }
    }

    public rotateY(deg: number) {

        const engine = Engine.init();

        const cos = engine.cos(deg);
        const sin = engine.sin(deg);

        for (let i = 0; i < this.vertices.length; i++) {
            const [x, _, z] = this.vertices[i]!;

            this.vertices[i]![0] = x * cos + z * sin;
            this.vertices[i]![2] = -x * sin + z * cos;
        }
    }

    public rotateZ(deg: number) {

        const engine = Engine.init();

        const cos = engine.cos(deg);
        const sin = engine.sin(deg);

        for (let i = 0; i < this.vertices.length; i++) {
            const [x, y, _] = this.vertices[i]!;

            this.vertices[i]![0] = x * cos - y * sin;
            this.vertices[i]![1] = x * sin + y * cos;
        }
    }

    public pointX(deg: number) {
        const delta = deg - this.rotX;
        this.rotX = deg;
        this.rotateX(delta);
    }

    public pointY(deg: number) {
        const delta = deg - this.rotY;
        this.rotY = deg;
        this.rotateY(delta);
    }

    public pointZ(deg: number) {
        const delta = deg - this.rotZ;
        this.rotZ = deg;
        this.rotateZ(delta);
    }
}