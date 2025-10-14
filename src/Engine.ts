import { canvas, ctx } from './canvas.ts';
import Sprite from './Sprite.ts';

export default class Engine {

    private static instance: Engine;

    private updateInterval: number | undefined;
    public loop: () => (void | Promise<void>) = () => {};
    public maxFPS: number = 24;

    private lastFrame: number = performance.now();
    public deltaTime: number = 1 / this.maxFPS;

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

    public setMaxFramesPerSecond(maxFPS: number) {
        this.maxFPS = maxFPS;
        clearInterval(this.updateInterval);
        this.updateInterval = setInterval(() => {
            
            const now = performance.now();
            const deltaTime = (now - this.lastFrame) / 1000;
            this.lastFrame = now;
            this.deltaTime = deltaTime;

            this.loop();
        }, 1000 / this.maxFPS);
    }

    public refresh() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.sprites.forEach(sprite => sprite.draw());
    }

    public async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Helpers

    public toRadians(deg: number) {
        return deg * Math.PI / 180;
    }

    public toDegrees(rad: number) {
        return rad * 180 / Math.PI;
    }

    // Private constructor

    private constructor() {
        this.setMaxFramesPerSecond(24);
    }

}