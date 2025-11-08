export const canvas = document.getElementById('game-window') as HTMLCanvasElement || document.createElement('canvas'); // For testing
export const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

export const penCanvas = document.createElement('canvas');
export const penCtx = penCanvas.getContext('2d')!;
penCanvas.id = 'pen-canvas';

let ratio: number = 16 / 9;
let scale: number;

export function setScale(newScale: number) {
    scale = newScale;

    canvas.width = ratio * scale;
    canvas.height = scale;

    penCanvas.width = ratio * scale;
    penCanvas.height = scale;
}

export function setAspectRatio(newAspectRatio: number) {
    ratio = newAspectRatio;

    canvas.width = ratio * scale;
    canvas.height = scale;

    penCanvas.width = ratio * scale;
    penCanvas.height = scale;
}

canvas.parentElement?.insertBefore(penCanvas, canvas);

setScale(500);