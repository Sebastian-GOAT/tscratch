import Camera from './Camera.ts';
import { canvas, ctx, penCanvas } from './canvas.ts';
import Sprite from './Sprite.ts';
import TSCMath from './TSCMath.ts';

type GameLoop = (() => void) | (() => Promise<void>);

type SceneMap = Map<string, {
    sprites: Sprite[];
    loop: GameLoop | null;
}>;

export default class Engine {

    private static loopRunning = false;
    private static gameLoop: GameLoop | null = null;

    public static maxFPS = 30;
    public static deltaTime = 1 / Engine.maxFPS;
    private static lastFrame = performance.now();
    private static refreshScheduled = false;
    private static animationFrameId: number | null = null;

    private static sounds: HTMLAudioElement[] = [];

    public static camera = new Camera();

    public static mouseX = 0;
    public static mouseY = 0;

    public static mouseDown = false;
    public static mouseClicked = false;

    private static keysPressed: Set<string> = new Set<string>();

    private static currentScene = 'main';
    public static sceneMap: SceneMap = new Map();

    private static variableMap: Map<string, unknown> = new Map();

    // Singleton initialization

    public static init() {

        void Engine.setMaxFPS(Engine.maxFPS);
        Engine.sceneMap.set('main', { loop: null, sprites: [] });
        Engine.sceneMap.set('*', { loop: null, sprites: [] });

        // Events

        // Mouse
        addEventListener('mousemove', e => {
            Engine.mouseX = e.clientX - penCanvas.offsetLeft - penCanvas.width / 2;
            Engine.mouseY = -(e.clientY - penCanvas.offsetTop - penCanvas.height / 2);
        });
        addEventListener('mousedown', () => {
            Engine.mouseDown = true;
        });
        addEventListener('mouseup', () => {
            Engine.mouseDown = false;
        });
        addEventListener('click', () => {
            Engine.mouseClicked = true;
            setTimeout(() => Engine.mouseClicked = false, 0);
        });

        // Keys
        addEventListener('keydown', e => {
            if (e.repeat) return;
            Engine.keysPressed.add(e.key);
        });

        addEventListener('keyup', e => {
            Engine.keysPressed.delete(e.key);
        });
    }

    // Change the scene

    public static setScene(scene: string) {
        if (!Engine.sceneMap.get(scene))
            Engine.sceneMap.set(scene, { sprites: [], loop: null });

        Engine.loopRunning = false;
        Engine.currentScene = scene;
        Engine.gameLoop = Engine.sceneMap.get(scene)!.loop;
        Engine.setMaxFPS(Engine.maxFPS); // Update the interval function
    }

    // Loops

    public static setLoop(scene: string, loop: GameLoop) {
        if (!Engine.sceneMap.get(scene)) {
            Engine.sceneMap.set(scene, { sprites: [], loop });
            if (scene === Engine.currentScene)
                Engine.setScene(scene);
            return;
        }

        Engine.sceneMap.get(scene)!.loop = loop;
        if (scene === Engine.currentScene)
            Engine.setScene(scene);
    }

    public static pauseLoop() {
        Engine.loopRunning = false;
        if (Engine.animationFrameId !== null) {
            cancelAnimationFrame(Engine.animationFrameId);
            Engine.animationFrameId = null;
        }
    }

    public static resumeLoop() {
        Engine.loopRunning = true;
        void Engine.setMaxFPS(Engine.maxFPS);
    }

    // Internal

    public static addSprite(sprite: Sprite) {
        const { scene, layer } = sprite;

        if (!Engine.sceneMap.get(scene)) {
            Engine.sceneMap.set(scene, { sprites: [sprite], loop: null });
            return;
        }

        let targetIndex = Engine.sceneMap.get(scene)!.sprites.findIndex(s => s.layer > layer);
        if (targetIndex === -1) {
            Engine.sceneMap.get(scene)!.sprites.push(sprite);
            return;
        }

        Engine.sceneMap.get(scene)!.sprites.splice(targetIndex, 0, sprite);
        Engine.refresh();
    }

    public static removeSprite(sprite: Sprite) {
        const { scene } = sprite;

        if (!Engine.sceneMap.get(scene)) return;

        Engine.sceneMap.get(scene)!.sprites = Engine.sceneMap.get(scene)!.sprites.filter(s => s !== sprite);
        Engine.refresh();
    }

    public static async setMaxFPS(maxFPS: number) {
        Engine.maxFPS = maxFPS;

        let loop = Engine.gameLoop;
        if (!loop) return;

        // Cancel existing animation frame if any
        if (Engine.animationFrameId !== null) {
            cancelAnimationFrame(Engine.animationFrameId);
            Engine.animationFrameId = null;
        }

        Engine.loopRunning = true;
        const frameInterval = 1000 / maxFPS;
        let accumulator = 0;

        const tick = async (currentTime: number) => {
            if (!Engine.loopRunning) return;

            const deltaTime = currentTime - Engine.lastFrame;
            Engine.lastFrame = currentTime;
            accumulator += deltaTime;

            // Fixed timestep: only run loop when enough time has passed
            if (accumulator >= frameInterval) {
                Engine.deltaTime = accumulator / 1000;
                accumulator = accumulator % frameInterval;

                if (loop) await loop();
            }

            Engine.animationFrameId = requestAnimationFrame(tick);
        };

        Engine.lastFrame = performance.now();
        Engine.animationFrameId = requestAnimationFrame(tick);
    }

    public static refresh() {
        if (Engine.refreshScheduled) return;
        Engine.refreshScheduled = true;

        requestAnimationFrame(() => {
            Engine.refreshScheduled = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const sprites = [
                ...Engine.sceneMap.get(Engine.currentScene)!.sprites,
                ...Engine.sceneMap.get('*')!.sprites
            ];
            sprites.forEach(sprite => {
                if (!sprite.hidden)
                    sprite.draw();
            });
        });
    }

    // Wait functions

    public static async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static async waitUntil(conditionGetter: () => boolean): Promise<void> {
        return new Promise(resolve => {
            const check = () => {
                if (conditionGetter()) resolve();
                else setTimeout(check, 1000 / Engine.maxFPS);
            }
            check();
        });
    }

    // Global variables

    public static setVariable<T = any>(key: string, value: T) {
        Engine.variableMap.set(key, value);
    }

    public static getVariable<T = unknown>(key: string) {
        return Engine.variableMap.get(key) as T;
    }

    // Events

    public static hovering(sprite: Sprite) {
        const { mouseX, mouseY } = Engine;

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

    public static keyPressed(key: string) {
        switch (key) {
            case 'any': return Engine.keysPressed.size > 0;

            case 'up': return Engine.keysPressed.has('ArrowUp');
            case 'down': return Engine.keysPressed.has('ArrowDown');
            case 'left': return Engine.keysPressed.has('ArrowLeft');
            case 'right': return Engine.keysPressed.has('ArrowRight');

            case 'space': return Engine.keysPressed.has(' ');

            default: return Engine.keysPressed.has(key);
        }
    }

    // Sound

    public static playSound(src: string) {
        const audio = new Audio(src);
        Engine.sounds.push(audio);

        audio.play();

        return audio;
    }

    public static stopSound(sound: HTMLAudioElement) {
        sound.pause();
        sound.currentTime = 0;
        Engine.sounds = Engine.sounds.filter(s => s !== sound);
    }

    public static stopAllSounds() {
        Engine.sounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        Engine.sounds = [];
    }
}