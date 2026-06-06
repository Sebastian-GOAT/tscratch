import type Joystick from '@sprites/Joystick.ts';
import { canvas, ctx } from './canvas.ts';
import Sprite from './Sprite.ts';
import TSCMath from './TSCMath.ts';

type GameLoop = (() => void) | (() => Promise<void>);

type SceneMap = Map<string, {
    sprites: Sprite[];
    loop: GameLoop | null;
}>;

export default class Engine {

    private static instance: Engine;

    private loopRunning = false;
    private gameLoop: GameLoop | null = null;

    public maxFPS = 30;
    public deltaTime = 1 / this.maxFPS;
    private lastFrame: number = performance.now();
    private refreshScheduled = false;
    private animationFrameId: number | null = null;

    private sounds: HTMLAudioElement[] = [];

    public mouseX = 0;
    public mouseY = 0;

    public mouseDown = false;

    private primaryPointerId: number | null = null;
    private activeJoystick: Joystick | null = null;
    private keysPressed = new Set<string>();

    public currentScene = 'main';
    public sceneMap: SceneMap = new Map();

    private variableMap = new Map<string, unknown>();

    // Singleton initialization

    public static init() {
        if (!this.instance)
            this.instance = new Engine();

        return this.instance;
    }

    private constructor() {
        void this.setMaxFPS(30);
        this.sceneMap.set('main', { loop: null, sprites: [] });
        this.sceneMap.set('*', { loop: null, sprites: [] });

        // Events

        // Pointer
        canvas.addEventListener('pointermove', e => {
            if (this.primaryPointerId !== null && e.pointerId !== this.primaryPointerId) return;
            this.mouseX = e.clientX - canvas.offsetLeft - canvas.width / 2;
            this.mouseY = -(e.clientY - canvas.offsetTop - canvas.height / 2);

            this.updateJoysticks();
        });
        canvas.addEventListener('pointerdown', e => {
            if (this.primaryPointerId === null) {
                this.primaryPointerId = e.pointerId;
                this.mouseDown = true;

                this.updateJoysticks();
            }
        });
        canvas.addEventListener('pointerup', e => {
            if (e.pointerId === this.primaryPointerId) {
                this.primaryPointerId = null;
                this.mouseDown = false;
                if (this.activeJoystick) {
                    this.activeJoystick.joyX = 0;
                    this.activeJoystick.joyY = 0;
                    this.activeJoystick = null;
                    this.refresh();
                }
            }
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

    // Joysticks

    private updateJoysticks() {

        const joysticks = [
            ...this.sceneMap.get('*')!.sprites,
            ...this.sceneMap.get('main')!.sprites
        ].filter(s => s.discriminant === 'joystick') as Joystick[];

        const updateJoystick = (joystick: Joystick) => {
            const localX = this.mouseX - joystick.x;
            const localY = this.mouseY - joystick.y;
            const angle = -TSCMath.toRadians(joystick.dir);
            const rotatedX = localX * Math.cos(angle) - localY * Math.sin(angle);
            const rotatedY = localX * Math.sin(angle) + localY * Math.cos(angle);

            const maxRadius = joystick.radius * joystick.size;
            const distance = Math.hypot(rotatedX, rotatedY);
            const normalizedX = distance > 0 ? rotatedX / distance : 0;
            const normalizedY = distance > 0 ? rotatedY / distance : 0;

            if (distance <= maxRadius) {
                joystick.joyX = rotatedX / maxRadius;
                joystick.joyY = rotatedY / maxRadius;
            } else {
                joystick.joyX = normalizedX;
                joystick.joyY = normalizedY;
            }

            this.activeJoystick = joystick;
            this.refresh();
        };

        if (this.activeJoystick) {
            updateJoystick(this.activeJoystick);
            return;
        }

        if (!this.mouseDown) return;

        for (const joystick of joysticks) {
            const localX = this.mouseX - joystick.x;
            const localY = this.mouseY - joystick.y;
            const angle = -TSCMath.toRadians(joystick.dir);
            const rotatedX = localX * Math.cos(angle) - localY * Math.sin(angle);
            const rotatedY = localX * Math.sin(angle) + localY * Math.cos(angle);
            const maxRadius = joystick.radius * joystick.size;

            if (rotatedX * rotatedX + rotatedY * rotatedY <= maxRadius * maxRadius) {
                updateJoystick(joystick);
                return;
            }
        }
    }

    // Change the scene

    public setScene(scene: string) {
        if (!this.sceneMap.get(scene))
            this.sceneMap.set(scene, { sprites: [], loop: null });

        this.loopRunning = false;
        this.currentScene = scene;
        this.gameLoop = this.sceneMap.get(scene)!.loop;
        this.setMaxFPS(this.maxFPS); // Update the interval function
    }

    // Loops

    public setLoop(scene: string, loop: GameLoop) {
        if (!this.sceneMap.get(scene)) {
            this.sceneMap.set(scene, { sprites: [], loop });
            if (scene === this.currentScene)
                this.setScene(scene);
            return;
        }

        this.sceneMap.get(scene)!.loop = loop;
        if (scene === this.currentScene)
            this.setScene(scene);
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
        void this.setMaxFPS(this.maxFPS);
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

    public async setMaxFPS(maxFPS: number) {
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
        const angle = -TSCMath.toRadians(sprite.dir);
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
}