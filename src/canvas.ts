export const canvas = document.getElementById('game-window') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

let ratio: number = 16 / 9;
let scale: number;

export function setScale(newScale: number) {
    scale = newScale;
    canvas.width = ratio * scale;
    canvas.height = scale;
}

export function setAspectRatio(newAspectRatio: number) {
    ratio = newAspectRatio;
    canvas.width = ratio * scale;
    canvas.height = scale;
}

setScale(500);