import { canvas, ctx } from './canvas.ts';
import Sprite from './Sprite.ts';

export default class Engine {

    private static instance: Engine;
    public loop: () => void = () => {};
    public sprites: Sprite[] = [];

    public static init() {
        if (!this.instance) {
            this.instance = new Engine();
        }
        return this.instance;
    }

    private constructor() {
        setInterval(() => this.loop(), 1000 / 8);
    }

    public addSprite(sprite: Sprite) {
        this.sprites.push(sprite);
    }

    public refresh() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.sprites.forEach(sprite => sprite.draw());
    }

}