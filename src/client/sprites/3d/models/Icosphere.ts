import Object3D, { type Object3DOptions } from '../Object3D.ts';
import icosphereFaces from './faces/icosphere.ts';
import icosphereVertices from './vertices/icosphere.ts';

export default class Icosphere extends Object3D {

    constructor(options?: Partial<Object3DOptions>) {
        super({
            ...options,
            vertices: icosphereVertices,
            faces: icosphereFaces
        });
    }
}