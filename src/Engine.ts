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

    public mouseDown: boolean = false;

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

    // Mouse events

    public isHovered(sprite: Sprite) {
        const { mouseX, mouseY } = this;

        const canvasMouseX = mouseX + canvas.width / 2;
        const canvasMouseY = canvas.height / 2 - mouseY;

        ctx.save();
        
        ctx.translate(sprite.x + canvas.width / 2, sprite.y + canvas.height / 2);
        ctx.rotate(this.toRadians(sprite.dir));

        const hovered = ctx.isPointInPath(
            sprite.getPath(), 
            canvasMouseX - (sprite.x + canvas.width / 2), 
            canvasMouseY - (sprite.y + canvas.height / 2)
        );

        ctx.restore();

        return hovered;
    }

    // Math

    public pickRandom(min: number, max: number) {
        if (min > max)
            [min, max] = [max, min];
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Trigonometric functions
    public sin(deg: number) {
        return Math.sin(this.toRadians(deg));
    }

    public cos(deg: number) {
        return Math.cos(this.toRadians(deg));
    }

    public tan(deg: number) {
        return Math.tan(this.toRadians(deg));
    }

    public csc(deg: number) {
        return 1 / Math.sin(this.toRadians(deg));
    }

    public sec(deg: number) {
        return 1 / Math.cos(this.toRadians(deg));
    }

    public cot(deg: number) {
        return 1 / Math.tan(this.toRadians(deg));
    }

    // Inverse Trigonometric functions
    public asin(val: number) {
        return this.toDegrees(Math.asin(val));
    }

    public acos(val: number) {
        return this.toDegrees(Math.acos(val));
    }

    public acsc(val: number) {
        return this.toDegrees(Math.asin(1 / val));
    }

    public asec(val: number) {
        return this.toDegrees(Math.acos(1 / val));
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
        canvas.addEventListener('mousedown', e => {
            this.mouseDown = true;
        });
        canvas.addEventListener('mouseup', e => {
            this.mouseDown = false;
        });
    }
}