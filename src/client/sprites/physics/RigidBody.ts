import type { Vec2 } from '@ctypes/Vectors.ts';
import type Sprite from '@main/Sprite.ts';

export interface RigidBodyOptions {
    obstacles: RigidBody[];

    isStatic: boolean;
    
    gravity: number;
    drag: number;
    bounceLoss: number;
    velocity: Vec2;
    angularVelocity: number;
    inertia: number;

    update: () => void;
}

export interface RigidBody extends Sprite, RigidBodyOptions {}