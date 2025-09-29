import { Engine, Rectangle } from 'tscratch';

const engine = Engine.init();

// Setup

const rect1 = new Rectangle();

rect1.x = -100;
rect1.y = 200;

// Loop

engine.loop = () => {
    rect1.changeX(3);
};