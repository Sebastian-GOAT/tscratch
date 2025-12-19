export interface CameraOptions {
    x: number;
    y: number;
    z: number;
    dir: number;
}

export default class Camera {

    public x = 0;
    public y = 0;
    public z = 0;
    public dir = 0;

    constructor(options?: CameraOptions) {
        this.x = options?.x ?? 0;
        this.y = options?.y ?? 0;
        this.z = options?.z ?? 0;
        this.dir = options?.dir ?? 0;
    }
}