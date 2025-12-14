import Object3D, { type Object3DOptions } from '../Object3D.ts';
import cubeFaces from './faces/cube.ts';
import cubeVertices from './vertices/cube.ts';

export default class Cube extends Object3D {

    constructor(options?: Partial<Object3DOptions>) {
        super({
            ...options,
            vertices: cubeVertices,
            faces: cubeFaces
        });
    }
}