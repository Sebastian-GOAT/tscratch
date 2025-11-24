import { canvas, ctx, penCanvas } from './canvas.ts';
import Sprite from './Sprite.ts';
import type { Vec2, Vec3, Vec4 } from './types/Vectors.ts';

type GameLoop = (() => void) | (() => Promise<void>);

type SceneMap = Map<string, {
    sprites: Sprite[];
    loop: GameLoop | null;
}>

export default class Engine {

    private static instance: Engine;

    private loopRunning: boolean = false;
    private gameLoop: GameLoop | null = null;

    public maxFPS: number = 24;
    public deltaTime: number = 1 / this.maxFPS;
    private lastFrame: number = performance.now();
    private refreshScheduled: boolean = false;
    private animationFrameId: number | null = null;

    private sounds: HTMLAudioElement[] = [];

    public mouseX: number = 0;
    public mouseY: number = 0;

    public mouseDown: boolean = false;
    public mouseClicked: boolean = false;

    private keysPressed: Set<string> = new Set<string>();

    private currentScene: string = 'main';
    private sceneMap: SceneMap = new Map();

    private variableMap: Map<string, unknown> = new Map();

    // Singleton initialization

    public static init() {
        if (!this.instance)
            this.instance = new Engine();

        return this.instance;
    }

    // Change the scene

    public changeScene(scene: string) {
        if (!this.sceneMap.get(scene))
            this.sceneMap.set(scene, { sprites: [], loop: null });

        this.loopRunning = false;
        this.currentScene = scene;
        this.gameLoop = this.sceneMap.get(scene)!.loop;
        this.setMaxFramesPerSecond(this.maxFPS); // Update the interval function
    }

    // Loops

    public setLoop(scene: string, loop: GameLoop) {
        if (!this.sceneMap.get(scene)) {
            this.sceneMap.set(scene, { sprites: [], loop });
            if (scene === this.currentScene)
                this.changeScene(scene);
            return;
        }

        this.sceneMap.get(scene)!.loop = loop;
        if (scene === this.currentScene)
            this.changeScene(scene);
    }

    public pauseLoop() {
        this.loopRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    public resumeLoop() {
        this.loopRunning = true;
        void this.setMaxFramesPerSecond(this.maxFPS);
    }

    // Internal

    public addSprite(sprite: Sprite) {
        const { scene, layer } = sprite;

        if (!this.sceneMap.get(scene)) {
            this.sceneMap.set(scene, { sprites: [sprite], loop: null });
            return;
        }

        let targetIndex = this.sceneMap.get(scene)!.sprites.findIndex(s => s.layer > layer);
        if (targetIndex === -1) {
            this.sceneMap.get(scene)!.sprites.push(sprite);
            return;
        }

        this.sceneMap.get(scene)!.sprites.splice(targetIndex, 0, sprite);
        this.refresh();
    }

    public removeSprite(sprite: Sprite) {
        const { scene } = sprite;

        if (!this.sceneMap.get(scene)) return;

        this.sceneMap.get(scene)!.sprites = this.sceneMap.get(scene)!.sprites.filter(s => s !== sprite);
        this.refresh();
    }

    public async setMaxFramesPerSecond(maxFPS: number) {
        this.maxFPS = maxFPS;

        let loop = this.gameLoop;
        if (!loop) return;

        // Cancel existing animation frame if any
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.loopRunning = true;
        const frameInterval = 1000 / maxFPS;
        let accumulator = 0;

        const tick = async (currentTime: number) => {
            if (!this.loopRunning) return;

            const deltaTime = currentTime - this.lastFrame;
            this.lastFrame = currentTime;
            accumulator += deltaTime;

            // Fixed timestep: only run loop when enough time has passed
            if (accumulator >= frameInterval) {
                this.deltaTime = accumulator / 1000;
                accumulator = accumulator % frameInterval;

                if (loop) await loop();
            }

            this.animationFrameId = requestAnimationFrame(tick);
        };

        this.lastFrame = performance.now();
        this.animationFrameId = requestAnimationFrame(tick);
    }

    public refresh() {
        if (this.refreshScheduled) return;
        this.refreshScheduled = true;

        requestAnimationFrame(() => {
            this.refreshScheduled = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const sprites = [
                ...this.sceneMap.get(this.currentScene)!.sprites,
                ...this.sceneMap.get('*')!.sprites
            ];
            sprites.forEach(sprite => {
                if (!sprite.hidden)
                    sprite.draw();
            });
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

    // Global variables

    public setVariable<T = any>(key: string, value: T) {
        this.variableMap.set(key, value);
    }

    public getVariable<T = unknown>(key: string) {
        return this.variableMap.get(key) as T;
    }

    // Events

    public hovering(sprite: Sprite) {
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

        return ctx.isPointInPath(sprite.getCachedPath(), rotatedX, rotatedY);
    }

    public keyPressed(key: string) {
        switch (key) {
            case 'any': return this.keysPressed.size > 0;

            case 'up': return this.keysPressed.has('ArrowUp');
            case 'down': return this.keysPressed.has('ArrowDown');
            case 'left': return this.keysPressed.has('ArrowLeft');
            case 'right': return this.keysPressed.has('ArrowRight');

            case 'space': return this.keysPressed.has(' ');

            default: return this.keysPressed.has(key);
        }
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

    public dotProduct(...vectors: [Vec2, Vec2] | [Vec3, Vec3] | [Vec4, Vec4]) {
        const [a, b] = vectors;

        switch (a.length) {
            case 2: return a[0] * b[0] + a[1] * b[1];
            case 3: return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]!;
            case 4: return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]! + a[3] * b[3]!; // TypeScript doesn't narrow down the types on b
        }
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
        this.sceneMap.set('main', { loop: null, sprites: [] });
        this.sceneMap.set('*', { loop: null, sprites: [] });

        // Events

        // Mouse
        penCanvas.addEventListener('mousemove', e => {
            this.mouseX = e.clientX - penCanvas.offsetLeft - penCanvas.width / 2;
            this.mouseY = -(e.clientY - penCanvas.offsetTop - penCanvas.height / 2);
        });
        penCanvas.addEventListener('mousedown', () => {
            this.mouseDown = true;
        });
        penCanvas.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
        penCanvas.addEventListener('click', () => {
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