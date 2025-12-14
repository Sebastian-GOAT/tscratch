import Object3D, { type Object3DOptions } from '../Object3D.ts';
import tetrahedronFaces from './faces/tetrahedron.ts';
import tetrahedronVertices from './vertices/tetrahedron.ts';

export default class Tetrahedron extends Object3D {

    constructor(options?: Partial<Object3DOptions>) {
        super({
            ...options,
            vertices: tetrahedronVertices,
            faces: tetrahedronFaces
        });
    }
}