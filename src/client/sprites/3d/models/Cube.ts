import Object3D, { type Object3DOptions } from '../Object3D.ts';
import cuboidFaces from './faces/cuboid.ts';
import getCuboidVertices from './vertices/cuboid.ts';

export default class Cube extends Object3D {

    constructor(options?: Partial<Object3DOptions>) {
        super({
            ...options,
            vertices: getCuboidVertices(1, 1, 1),
            faces: cuboidFaces
        });
    }
}