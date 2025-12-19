export const canvas = document.getElementById('game-window') as HTMLCanvasElement || document.createElement('canvas'); // For testing
export const ctx = canvas.getContext('2d')!;

export const penCanvas = document.createElement('canvas');
export const penCtx = penCanvas.getContext('2d')!;
penCanvas.id = 'pen-canvas';

export let aspectRatio: number = 16 / 9;
export let scale: number;

function updateSize() {
    canvas.width = aspectRatio * scale;
    canvas.height = scale;

    penCanvas.width = aspectRatio * scale;
    penCanvas.height = scale;
}

export function setScale(newScale: number) {
    scale = newScale;
    updateSize();
}

export function setAspectRatio(newAspectRatio: number) {
    aspectRatio = newAspectRatio;
    updateSize();
}

canvas.parentElement?.insertBefore(penCanvas, canvas);

setScale(500);