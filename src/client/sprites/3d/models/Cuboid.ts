import Object3D, { type Object3DOptions } from '../Object3D.ts';
import cuboidFaces from './faces/cuboid.ts';
import getCuboidVertices from './vertices/cuboid.ts';

export interface CuboidOptions extends Object3DOptions {
    width: number;
    height: number;
    length: number;
}

export default class Cuboid extends Object3D {

    public width: number;
    public height: number;
    public length: number;

    constructor(options?: Partial<CuboidOptions>) {
        super({
            ...options,
            vertices: getCuboidVertices(
                options?.width ?? 1,
                options?.height ?? 1,
                options?.length ?? 1
            ),
            faces: cuboidFaces
        });

        this.width = options?.width ?? 1;
        this.height = options?.height ?? 1;
        this.length = options?.length ?? 1;
    }

    private computeVertices() {
        this.vertices = getCuboidVertices(this.width, this.height, this.length);
    }

    public setWidth(width: number) {
        this.width = width;
        this.computeVertices();
    }

    public setHeight(height: number) {
        this.height = height;
        this.computeVertices();
    }

    public setLength(length: number) {
        this.length = length;
        this.computeVertices();
    }
}