export interface Camera3DOptions {
    x: number;
    y: number;
    z: number;
    dirX: number;
    dirY: number;
    dirZ: number;
}

export default class Camera3D {

    public x = 0;
    public y = 0;
    public z = 0;
    public dirX = 0;
    public dirY = 0;
    public dirZ = 0;

    constructor(options?: Camera3DOptions) {
        this.x = options?.x ?? 0;
        this.y = options?.y ?? 0;
        this.z = options?.z ?? 0;
        this.dirX = options?.dirX ?? 0;
        this.dirY = options?.dirY ?? 0;
        this.dirZ = options?.dirZ ?? 0;
    }
}