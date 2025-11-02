import { canvas, ctx, penCanvas } from './canvas.ts';
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

    public sounds: HTMLAudioElement[] = [];

    public mouseX: number = 0;
    public mouseY: number = 0;

    public mouseDown: boolean = false;
    public mouseClicked: boolean = false;

    private keysPressed: Set<string> = new Set<string>();

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
        this.refresh();
    }

    public removeSprite(sprite: Sprite) {
        const { scene } = sprite;

        if (!this.sceneMap[scene]) return;

        this.sceneMap[scene].sprites = this.sceneMap[scene].sprites.filter(s => s !== sprite);
        this.refresh();
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

    // Wait functions

    public async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public async waitUntil(conditionGetter: () => boolean): Promise<void> {
        return new Promise(resolve => {
            const check = () => {
                if (conditionGetter()) resolve();
                else setTimeout(check, 1000 / this.maxFPS);
            }
            check();
        });
    }

    // Events

    public isHovered(sprite: Sprite) {
        const { mouseX, mouseY } = this;

        const canvasMouseX = mouseX + canvas.width / 2;
        const canvasMouseY = canvas.height / 2 - mouseY;

        // Mouse relative to sprite center
        const localX = canvasMouseX - (sprite.x + canvas.width / 2);
        const localY = canvasMouseY - (canvas.height / 2 - sprite.y);

        // Rotate mouse point by -dir to align with the path's local coordinates
        const angle = -this.toRadians(sprite.dir);
        const rotatedX = localX * Math.cos(angle) - localY * Math.sin(angle);
        const rotatedY = localX * Math.sin(angle) + localY * Math.cos(angle);

        return ctx.isPointInPath(sprite.getPath(), rotatedX, rotatedY);
    }

    public isKeyPressed(key: string) {
        return this.keysPressed.has(key);
    }

    // Sound

    public playSound(src: string) {
        const audio = new Audio(src);
        this.sounds.push(audio);

        audio.play();

        return audio;
    }

    public stopSound(sound: HTMLAudioElement) {
        sound.pause();
        sound.currentTime = 0;
        this.sounds = this.sounds.filter(s => s !== sound);
    }

    public stopAllSounds() {
        this.sounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.sounds = [];
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

        // Events

        // Mouse
        penCanvas.addEventListener('mousemove', e => {
            this.mouseX = e.clientX - penCanvas.offsetLeft - penCanvas.width / 2;
            this.mouseY = -(e.clientY - penCanvas.offsetTop - penCanvas.height / 2);
        });
        penCanvas.addEventListener('mousedown', e => {
            this.mouseDown = true;
        });
        penCanvas.addEventListener('mouseup', e => {
            this.mouseDown = false;
        });
        penCanvas.addEventListener('click', e => {
            this.mouseClicked = true;
            setTimeout(() => this.mouseClicked = false, 0);
        });

        // Keys
        addEventListener('keydown', e => {
            if (e.repeat) return;
            this.keysPressed.add(e.key);
        });

        addEventListener('keyup', e => {
            this.keysPressed.delete(e.key);
        });
    }
}