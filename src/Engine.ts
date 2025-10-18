import { canvas, ctx } from './canvas.ts';
import Sprite from './Sprite.ts';

type GameLoop = (() => any) | (() => Promise<any>);

type SceneMap = {
    [sceneName: string]: {
        sprites: Sprite[];
        loop: GameLoop | null;
    };
};

export default class Engine {

    private static instance: Engine;

    private updateInterval: number | undefined;
    public gameLoop: GameLoop | null = null;
    public maxFPS: number = 24;

    public mouseX: number = 0;
    public mouseY: number = 0;

    public currentScene: string = 'main';
    public sceneMap: SceneMap = {};

    // Singleton initialization

    public static init() {
        if (!this.instance)
            this.instance = new Engine();

        return this.instance;
    }

    // Change the scene

    public changeScene(scene: string) {
        if (!this.sceneMap[scene])
            this.sceneMap[scene] = { sprites: [], loop: null };

        this.currentScene = scene;
        this.gameLoop = this.sceneMap[scene].loop;
        this.setMaxFramesPerSecond(this.maxFPS); // Update the interval function
    }

    // Set a loop

    public setLoop(scene: string, loop: GameLoop) {
        if (!this.sceneMap[scene]) {
            this.sceneMap[scene] = { sprites: [], loop };
            if (scene === this.currentScene)
                this.changeScene(scene);
            return;
        }

        this.sceneMap[scene].loop = loop;
        if (scene === this.currentScene)
            this.changeScene(scene);
    }

    // Internal

    public addSprite(scene: string, sprite: Sprite) {
        if (!this.sceneMap[scene]) {
            this.sceneMap[scene] = { sprites: [sprite], loop: null };
            return;
        }

        this.sceneMap[scene].sprites.push(sprite);
    }

    public setMaxFramesPerSecond(maxFPS: number) {
        this.maxFPS = maxFPS;
    
        let loop = this.gameLoop;
        if (!loop) return;

        clearInterval(this.updateInterval);
        this.updateInterval = setInterval(() => loop(), 1000 / this.maxFPS);
    }

    public refresh() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.sceneMap[this.currentScene]?.sprites.forEach(sprite => sprite.draw());
    }

    // Wait function

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

        canvas.addEventListener('mousemove', e => {
            this.mouseX = e.clientX - canvas.offsetLeft - canvas.width / 2;
            this.mouseY = -(e.clientY - canvas.offsetTop - canvas.height / 2);
        });
    }
}