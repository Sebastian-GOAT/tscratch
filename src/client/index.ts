// Main
import Engine from './Engine.ts';
import Sprite, { type SpriteOptions } from './Sprite.ts';
import { scale, aspectRatio, setScale, setAspectRatio, canvas, ctx } from './canvas.ts';

// Multiplayer
import Multiplayer from './Multiplayer.ts';

// Sprites
import Rectangle, { type RectangleOptions } from './sprites/Rectangle.ts';
import Square, { type SquareOptions } from './sprites/Square.ts';
import Oval, { type OvalOptions } from './sprites/Oval.ts';
import Circle, { type CircleOptions } from './sprites/Circle.ts';
import Arc, { type ArcOptions } from './sprites/Arc.ts';
import RegularPolygon, { type RegularPolygonOptions } from './sprites/RegularPolygon.ts';
import CustomPolygon, { type CustomPolygonOptions } from './sprites/CustomPolygon.ts';
import Pen, { type PenOptions } from './sprites/Pen.ts';
import Text, { type TextOptions } from './sprites/Text.ts';
import Button, { type ButtonOptions } from './sprites/Button.ts';
import ImageSprite, { type ImageSpriteOptions } from './sprites/ImageSprite.ts';

// Types
import type { Vec2, Vec3, Vec4 } from './types/Vectors.ts';
import type { Mat2, Mat3, Mat4 } from './types/Matricies.ts';

const TScratch = {
    // Main
    Engine,
    Sprite,

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
    ImageSprite,

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
    ImageSprite,

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
    type ImageSpriteOptions,

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