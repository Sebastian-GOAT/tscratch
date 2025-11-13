import Engine from './Engine.ts';
import Sprite, { type SpriteOptions } from './Sprite.ts';
import { setScale, setAspectRatio, canvas, ctx } from './canvas.ts';

import Rectangle, { type RectangleOptions } from './sprites/Rectangle.ts';
import Square, { type SquareOptions } from './sprites/Square.ts';
import Oval, { type OvalOptions } from './sprites/Oval.ts';
import Circle, { type CircleOptions } from './sprites/Circle.ts';
import Arc, { type ArcOptions } from './sprites/Arc.ts';
import RegularPolygon, { type RegularPolygonOptions } from './sprites/RegularPolygon.ts';
import CustomPolygon, { type CustomPolygonOptions } from './sprites/CustomPolygon.ts';
import Pen, { type PenOptions } from './sprites/Pen.ts';
import Text, { type TextOptions, type CanvasTextAlign, type CanvasTextBaseline } from './sprites/Text.ts';
import ImageSprite, { type ImageSpriteOptions } from './sprites/ImageSprite.ts';

import type { Vec2, Vec3, Vec4 } from './types/Vectors.ts';

const TScratch = {
    // Main
    Engine,
    Sprite,

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
    ImageSprite,

    // Canvas
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
    type ImageSpriteOptions,

    // Other types
    type CanvasTextAlign,
    type CanvasTextBaseline,
    type Vec2,
    type Vec3,
    type Vec4,
    
    // Canvas
    setScale,
    setAspectRatio,
    canvas,
    ctx
};