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
    
    // Inputs
    private keysPressed = new Set<string>();
    private keyCallbacks = new Map<string, Array<{ callback: () => void; allowHold: boolean }>>();
    private pressCallbacks = new Set<() => void>();

    public currentScene = 'main';
    public sceneMap: SceneMap = new Map();

    private variableMap = new Map<string, unknown>();

    public static init() {
        if (!this.instance)
            this.instance = new Engine();

        return this.instance;
    }

    private constructor() {
        void this.setMaxFPS(30);
        this.sceneMap.set('main', { loop: null, sprites: [] });
        this.sceneMap.set('*', { loop: null, sprites: [] });

        // Pointer Events
        canvas.addEventListener('pointermove', e => {
            if (this.primaryPointerId !== null && e.pointerId !== this.primaryPointerId) return;

            const rect = canvas.getBoundingClientRect();

            this.mouseX = (e.clientX - rect.left) * (canvas.width / rect.width) - canvas.width / 2;
            this.mouseY = -((e.clientY - rect.top) * (canvas.height / rect.height) - canvas.height / 2);

            this.updateJoysticks();
        });

        canvas.addEventListener('pointerdown', e => {
            canvas.setPointerCapture(e.pointerId);

            if (this.primaryPointerId === null) {
                this.primaryPointerId = e.pointerId;
                this.mouseDown = true;
                this.updateJoysticks();
            }
        });

        canvas.addEventListener('pointerup', e => {
            canvas.releasePointerCapture(e.pointerId);

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

        // Key Events (Pure state updates, no OS repeat firing)
        addEventListener('keydown', e => {
            const key = this.normalizeKey(e.key);
            const wasPressed = this.keysPressed.has(key);
            this.keysPressed.add(key);

            // Execute single-tap callbacks immediately on keydown if allowHold is false
            if (!wasPressed) {
                const callbacks = this.keyCallbacks.get(key) ?? [];
                callbacks.forEach(({ callback, allowHold }) => {
                    if (!allowHold) callback();
                });
            }
        });

        addEventListener('keyup', e => {
            this.keysPressed.delete(this.normalizeKey(e.key));
        });
    }

    // Process continuous inputs on every engine frame tick
    private processInput() {
        // 1. Process held keys
        for (const key of this.keysPressed) {
            const callbacks = this.keyCallbacks.get(key) ?? [];
            callbacks.forEach(({ callback, allowHold }) => {
                if (allowHold) callback();
            });
        }

        // 2. Process active mouse/pointer presses (e.g. Sprite onPress)
        if (this.mouseDown || this.pressCallbacks.size > 0) {
            this.pressCallbacks.forEach(callback => callback());
        }
    }

    // Engine Frame Loop

    public async setMaxFPS(maxFPS: number) {
        this.maxFPS = maxFPS;

        let loop = this.gameLoop;

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

            if (accumulator >= frameInterval) {
                this.deltaTime = accumulator / 1000;
                accumulator = accumulator % frameInterval;

                // Fire continuous input callbacks synchronized with the game frame
                this.processInput();

                if (loop) await loop();
            }

            this.animationFrameId = requestAnimationFrame(tick);
        };

        this.lastFrame = performance.now();
        this.animationFrameId = requestAnimationFrame(tick);
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

    // Change scene & loop

    public setScene(scene: string) {
        if (!this.sceneMap.get(scene))
            this.sceneMap.set(scene, { sprites: [], loop: null });

        this.loopRunning = false;
        this.currentScene = scene;
        this.gameLoop = this.sceneMap.get(scene)!.loop;
        this.setMaxFPS(this.maxFPS);
    }

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

        const localX = canvasMouseX - (sprite.x + canvas.width / 2);
        const localY = canvasMouseY - (canvas.height / 2 - sprite.y);

        const angle = -TSCMath.toRadians(sprite.dir);
        const rotatedX = localX * Math.cos(angle) - localY * Math.sin(angle);
        const rotatedY = localX * Math.sin(angle) + localY * Math.cos(angle);

        return ctx.isPointInPath(sprite.getCachedPath(), rotatedX, rotatedY);
    }

    private normalizeKey(key: string) {
        switch (key) {
            case 'ArrowUp': return 'up';
            case 'ArrowDown': return 'down';
            case 'ArrowLeft': return 'left';
            case 'ArrowRight': return 'right';
            case ' ': return 'space';
            default: return key;
        }
    }

    private isKeyPressed(key: string) {
        const normalizedKey = this.normalizeKey(key);

        switch (normalizedKey) {
            case 'any': return this.keysPressed.size > 0;
            case 'up': return this.keysPressed.has('up');
            case 'down': return this.keysPressed.has('down');
            case 'left': return this.keysPressed.has('left');
            case 'right': return this.keysPressed.has('right');
            case 'space': return this.keysPressed.has('space');
            default: return this.keysPressed.has(normalizedKey);
        }
    }

    public keyPressed(key: string) {
        return this.isKeyPressed(key);
    }

    public onKeyPress(key: string, callback: () => void, options: { allowHold: boolean; } = { allowHold: true }) {
        const normalizedKey = this.normalizeKey(key);
        const callbacks = this.keyCallbacks.get(normalizedKey) ?? [];

        callbacks.push({ callback, allowHold: options.allowHold });
        this.keyCallbacks.set(normalizedKey, callbacks);
    }

    public onPress(callback: () => void) {
        this.pressCallbacks.add(callback);
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