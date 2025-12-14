import Object3D, { type Object3DOptions } from '../Object3D.ts';
import octahedronFaces from './faces/octahedron.ts';
import octahedronVertices from './vertices/octahedron.ts';

export default class Octahedron extends Object3D {

    constructor(options?: Partial<Object3DOptions>) {
        super({
            ...options,
            vertices: octahedronVertices,
            faces: octahedronFaces
        });
    }
}