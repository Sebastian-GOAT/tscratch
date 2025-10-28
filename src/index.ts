import Engine from './Engine.ts';

import Sprite, { type SpriteOptions } from './Sprite.ts';
import Rectangle, { type RectangleOptions } from './sprites/Rectangle.ts';
import Oval, { type OvalOptions } from './sprites/Oval.ts';
import Circle, { type CircleOptions } from './sprites/Circle.ts';
import RegularPolygon, { type RegularPolygonOptions } from './sprites/RegularPolygon.ts';
import Pen, { type PenOptions } from './sprites/Pen.ts';
import Text, { type TextOptions, type CanvasTextAlign, type CanvasTextBaseline } from './sprites/Text.ts';
import ImageSprite, { type ImageSpriteOptions } from './sprites/ImageSprite.ts';

import { setScale, setAspectRatio, canvas, ctx } from './canvas.ts';

const TScratch = {
    // Main
    Engine,
    Sprite,

    // Sprites
    Rectangle,
    Oval,
    Circle,
    RegularPolygon,
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
    Oval,
    Circle,
    RegularPolygon,
    Pen,
    Text,
    ImageSprite,

    // Options
    type SpriteOptions,
    type RectangleOptions,
    type OvalOptions,
    type CircleOptions,
    type RegularPolygonOptions,
    type PenOptions,
    type TextOptions,
    type ImageSpriteOptions,

    // Other types
    type CanvasTextAlign,
    type CanvasTextBaseline,
    
    // Canvas
    setScale,
    setAspectRatio,
    canvas,
    ctx
};