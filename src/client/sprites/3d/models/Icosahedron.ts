import Object3D, { type Object3DOptions } from '../Object3D.ts';
import icosahedronFaces from './faces/icosahedron.ts';
import icosahedronVertices from './vertices/icosahedron.ts';

export default class Icosahedron extends Object3D {

    constructor(options?: Partial<Object3DOptions>) {
        super({
            ...options,
            vertices: icosahedronVertices,
            faces: icosahedronFaces
        });
    }
}