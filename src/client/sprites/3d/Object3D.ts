import TSCMath from '../../TSCMath.ts';
import type { Vec3 } from '../../types/Vectors.ts';

export interface Object3DOptions {
    vertices: Vec3[];
    faces: [number, number, ...number[]][];

    x?: number;
    y?: number;
    z?: number;

    rotX?: number;
    rotY?: number;
    rotZ?: number;

    color?: string;

    scale?: number;
}

export default class Object3D {

    public x: number;
    public y: number;
    public z: number;

    public rotX: number;
    public rotY: number;
    public rotZ: number;

    public color: string;

    public scale: number;

    public vertices: Vec3[];
    public faces: [number, number, ...number[]][];

    constructor(options: Object3DOptions) {
        this.vertices = options.vertices;
        this.faces = options.faces;

        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.z = options.z ?? 2;

        this.rotX = options.rotX ?? 0;
        this.rotY = options.rotY ?? 0;
        this.rotZ = options.rotZ ?? 0;

        this.color = options.color ?? 'black';

        this.scale = options.scale ?? 1;
    }

    public rotateX(deg: number) {
        const cos = TSCMath.cos(deg);
        const sin = TSCMath.sin(deg);

        for (let i = 0; i < this.vertices.length; i++) {
            const [_, y, z] = this.vertices[i]!;

            this.vertices[i]![1] = y * cos - z * sin;
            this.vertices[i]![2] = y * sin + z * cos;
        }
    }

    public rotateY(deg: number) {
        const cos = TSCMath.cos(deg);
        const sin = TSCMath.sin(deg);

        for (let i = 0; i < this.vertices.length; i++) {
            const [x, _, z] = this.vertices[i]!;

            this.vertices[i]![0] = x * cos + z * sin;
            this.vertices[i]![2] = -x * sin + z * cos;
        }
    }

    public rotateZ(deg: number) {
        const cos = TSCMath.cos(deg);
        const sin = TSCMath.sin(deg);

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

    // Parses an .obj file
    public static loadObj(data: string) {

        const lines = data.split('\n');

        // Vertices
        const vertices = lines
            .filter(l => l.startsWith('v '))
            .map(l => l.split(' ').slice(1).map(parseFloat)) as Vec3[];

        // Faces
        const faces = lines
            .filter(l => l.startsWith('f '))
            .map(l => l.split(' ').slice(1).map(
                f => parseInt(f.split('/')[0]!) - 1
            )) as [number, number, ...number[]][];

        return { vertices, faces };
    }
}