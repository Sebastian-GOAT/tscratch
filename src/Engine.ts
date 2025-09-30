import { canvas, ctx } from './canvas.ts';
import Sprite from './Sprite.ts';

export default class Engine {

    private static instance: Engine;

    private updateInterval: number | undefined;
    public loop: () => void = () => {};
    public FPS: number = 24;

    private lastFrame: number = performance.now();
    public deltaTime: number = 1 / this.FPS / 1000;

    public sprites: Sprite[] = [];

    public static init() {
        if (!this.instance) {
            this.instance = new Engine();
        }
        return this.instance;
    }

    public addSprites(...sprites: Sprite[]) {
        this.sprites.push(...sprites);
    }

    public removeSprites(...sprites: Sprite[]) {
        this.sprites = this.sprites.filter(s => !sprites.includes(s));
    }

    public setFramesPerSecond(FPS: number) {
        this.FPS = FPS;
        clearInterval(this.updateInterval);
        this.updateInterval = setInterval(() => {
            this.loop();

            const now = performance.now();
            const deltaTime = (now - this.lastFrame) / 1000;
            this.lastFrame = now;
            this.deltaTime = deltaTime;
        }, 1000 / this.FPS);
    }

    public refresh() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.sprites.forEach(sprite => sprite.draw());
    }

    private constructor() {
        this.setFramesPerSecond(24);
    }

}