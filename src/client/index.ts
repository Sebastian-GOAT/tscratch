// Main
import Engine from '@main/Engine.ts';
import Sprite, { type SpriteOptions } from '@main/Sprite.ts';
import { scale, aspectRatio, setScale, setAspectRatio, canvas, ctx } from '@main/canvas.ts';
import TSCMath from '@main/TSCMath.ts';
import Perlin1D from '@main/perlin/Perlin1.ts';
import Perlin2D from '@main/perlin/Perlin2.ts';
import InverseKinematics from '@main/ik/InverseKinematics.ts';

// Multiplayer
import Multiplayer from '@main/Multiplayer.ts';

// Sprites
import Rectangle, { type RectangleOptions } from '@sprites/Rectangle.ts';
import Square, { type SquareOptions } from '@sprites/Square.ts';
import Oval, { type OvalOptions } from '@sprites/Oval.ts';
import Circle, { type CircleOptions } from '@sprites/Circle.ts';
import Arc, { type ArcOptions } from '@sprites/Arc.ts';
import RegularPolygon, { type RegularPolygonOptions } from '@sprites/RegularPolygon.ts';
import CustomPolygon, { type CustomPolygonOptions } from '@sprites/CustomPolygon.ts';
import Pen, { type PenOptions } from '@sprites/Pen.ts';
import Text, { type TextOptions } from '@sprites/Text.ts';
import Button, { type ButtonOptions } from '@sprites/Button.ts';
import Watermark from '@sprites/Watermark.ts';
import ImageSprite, { type ImageSpriteOptions } from '@sprites/ImageSprite.ts';

import RigidRectangle, { type RigidRectangleOptions } from '@sprites/physics/RigidRectangle.ts';

// 3D
import Camera3D, { type Camera3DOptions } from '@sprites/3d/Camera3D.ts';
import Renderer3D, { type Renderer3DOptions } from '@sprites/3d/Renderer3D.ts';
import WireframeRenderer3D from '@sprites/3d/WireframeRenderer3D.ts';
import SolidRenderer3D from '@sprites/3d/SolidRenderer3D.ts';
import Object3D, { type Object3DOptions } from '@sprites/3d/Object3D.ts';

import Tetrahedron from '@sprites/3d/models/Tetrahedron.ts';
import Cube from '@sprites/3d/models/Cube.ts';
import Octahedron from '@sprites/3d/models/Octahedron.ts';
import Icosahedron from '@sprites/3d/models/Icosahedron.ts';
import Icosphere from '@sprites/3d/models/Icosphere.ts';
import Monkey from '@sprites/3d/models/Monkey.ts';
import Cuboid, { type CuboidOptions } from '@sprites/3d/models/Cuboid.ts';

// Types
import type { Vec2, Vec3, Vec4 } from '@ctypes/Vectors.ts';
import type { Mat2, Mat3, Mat4 } from '@ctypes/Matricies.ts';
import type { RigidBody, RigidBodyOptions } from '@sprites/physics/RigidBody.ts';

const TScratch = {
    // Main
    Engine,
    Sprite,
    TSCMath,
    Perlin1D,
    Perlin2D,
    InverseKinematics,

    // Multiplayer
    Multiplayer,

    // Sprites
    Rectangle,
    Square,
    Oval,
    Circle,
    Arc,
    RegularPolygon,
    CustomPolygon,
    Pen,
    Text,
    Button,
    Watermark,
    ImageSprite,

    RigidRectangle,

    // 3D
    Camera3D,
    Renderer3D, // For custom renderer implementations
    WireframeRenderer3D,
    SolidRenderer3D,
    Object3D,

    Tetrahedron,
    Cube,
    Octahedron,
    Icosahedron,
    Icosphere,
    Monkey,

    Cuboid,

    // Canvas
    scale,
    aspectRatio,
    setScale,
    setAspectRatio,
    canvas,
    ctx
};

export default TScratch;
export {
    // Main
    Engine,
    Sprite,
    TSCMath,
    Perlin1D,
    Perlin2D,
    InverseKinematics,

    // Multiplayer
    Multiplayer,

    // Sprites
    Rectangle,
    Square,
    Oval,
    Circle,
    Arc,
    RegularPolygon,
    CustomPolygon,
    Pen,
    Text,
    Button,
    Watermark,
    ImageSprite,

    RigidRectangle,

    // 3D
    Camera3D,
    Renderer3D, // For custom renderer implementations
    WireframeRenderer3D,
    SolidRenderer3D,
    Object3D,

    Tetrahedron,
    Cube,
    Octahedron,
    Icosahedron,
    Icosphere,
    Monkey,

    Cuboid,

    // Options
    type SpriteOptions,
    type RectangleOptions,
    type SquareOptions,
    type OvalOptions,
    type CircleOptions,
    type ArcOptions,
    type RegularPolygonOptions,
    type CustomPolygonOptions,
    type PenOptions,
    type TextOptions,
    type ButtonOptions,
    type TextOptions as WatermarkOptions,
    type ImageSpriteOptions,

    type RigidBody,
    type RigidBodyOptions,
    type RigidRectangleOptions,

    type Camera3DOptions,
    type Renderer3DOptions,
    type Object3DOptions,

    type CuboidOptions,

    // Other types
    type Vec2,
    type Vec3,
    type Vec4,
    type Mat2,
    type Mat3,
    type Mat4,
    
    // Canvas
    scale,
    aspectRatio,
    setScale,
    setAspectRatio,
    canvas,
    ctx
};