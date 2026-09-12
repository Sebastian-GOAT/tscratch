export const canvas = document.getElementById('tscratch-main-canvas') as HTMLCanvasElement || document.createElement('canvas'); // For testing
export const ctx = canvas.getContext('2d')!;

export const penCanvas = document.createElement('canvas');
export const penCtx = penCanvas.getContext('2d')!;
penCanvas.id = 'tscratch-pen-canvas';

canvas.parentElement?.insertBefore(penCanvas, canvas);

const width = 480;
const height = 360;

function updateSize() {
    canvas.width = width;
    canvas.height = height;
    penCanvas.width = width;
    penCanvas.height = height;
}

export function setScale(newScale: number) {
    const pixelWidth = width * newScale;
    
    canvas.style.width = `${pixelWidth}px`;
    penCanvas.style.width = `${pixelWidth}px`;
}

export function setBackground(color: string) {
    penCanvas.style.backgroundColor = color;
}

updateSize();
setScale(1.5);