export interface CameraOptions {
    x: number;
    y: number;
}

export default class Camera {

    public x = 0;
    public y = 0;

    constructor(options?: CameraOptions) {
        this.x = options?.x ?? 0;
        this.y = options?.y ?? 0;
    }
}