import Object3D, { type Object3DOptions } from '../Object3D.ts';
import monkeyFaces from './faces/monkey.ts';
import monkeyVertices from './vertices/monkey.ts';

export default class Monkey extends Object3D {

    constructor(options?: Partial<Object3DOptions>) {
        super({
            ...options,
            vertices: monkeyVertices,
            faces: monkeyFaces
        });
    }
}