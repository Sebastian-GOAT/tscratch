export interface RigidBodyOptions {
    gravity: number;
    drag: number;
    bounceLoss: number;
    vX: number;
    vY: number;
    update: () => void;
}