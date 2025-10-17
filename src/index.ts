import Engine from './Engine.ts';

import Sprite, { type SpriteOptions } from './Sprite.ts';
import Rectangle, { type RectangleOptions } from './Rectangle.ts';
import Oval, { type OvalOptions } from './Oval.ts';
import RegularPolygon, { type RegularPolygonOptions } from './RegularPolygon.ts';
import Pen, { type PenOptions } from './Pen.ts';
import Text, { type TextOptions, type CanvasTextAlign, type CanvasTextBaseline } from './Text.ts';
import ImageSprite, { type ImageSpriteOptions } from './ImageSprite.ts';

import { setScale, setAspectRatio, canvas, ctx } from './canvas.ts';

const TScratch = {
    // Main
    Engine,
    Sprite,

    // Sprites
    Rectangle,
    Oval,
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
    RegularPolygon,
    Pen,
    Text,
    ImageSprite,

    // Options
    type SpriteOptions,
    type RectangleOptions,
    type OvalOptions,
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