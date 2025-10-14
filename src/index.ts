import Engine from './Engine.ts';

import Sprite, { type SpriteOptions } from './Sprite.ts';
import Rectangle, { type RectangleOptions } from './Rectangle.ts';
import Oval, { type OvalOptions } from './Oval.ts';
import RegularPolygon, { type RegularPolygonOptions } from './RegularPolygon.ts';
import Pen, { type PenOptions } from './Pen.ts';

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

    // Options
    type SpriteOptions,
    type RectangleOptions,
    type OvalOptions,
    type RegularPolygonOptions,
    type PenOptions,
    
    // Canvas
    setScale,
    setAspectRatio,
    canvas,
    ctx
};