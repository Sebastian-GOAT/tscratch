import { canvas, ctx } from './canvas.ts';
import Sprite from './Sprite.ts';

type GameLoop = (() => any) | (() => Promise<any>);

type SceneMap = {
    [scene: string]: {
        sprites: Sprite[];
        loop: GameLoop | null;
    };
};

export default class Engine {

    private static instance: Engine;

    private loopRunning: boolean = false;
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

        this.loopRunning = false;
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

    public addSprite(sprite: Sprite) {
        const { scene, layer } = sprite;

        if (!this.sceneMap[scene]) {
            this.sceneMap[scene] = { sprites: [sprite], loop: null };
            return;
        }

        let targetIndex = this.sceneMap[scene].sprites.findIndex(s => s.layer > layer);
        if (targetIndex === -1) {
            this.sceneMap[scene].sprites.push(sprite);
            return;
        }

        this.sceneMap[scene].sprites.splice(targetIndex, 0, sprite);
    }

    public async setMaxFramesPerSecond(maxFPS: number) {
        this.maxFPS = maxFPS;
    
        let loop = this.gameLoop;
        if (!loop) return;

        this.loopRunning = true;

        while (this.loopRunning) {
            await loop();
            await this.wait(1000 / maxFPS);
        }
    }

    public refresh() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.sceneMap[this.currentScene]?.sprites.forEach(sprite => {
            if (!sprite.hidden)
                sprite.draw();
        });
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
        void this.setMaxFramesPerSecond(24);

        canvas.addEventListener('mousemove', e => {
            this.mouseX = e.clientX - canvas.offsetLeft - canvas.width / 2;
            this.mouseY = -(e.clientY - canvas.offsetTop - canvas.height / 2);
        });
    }
}