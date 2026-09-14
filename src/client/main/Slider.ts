import Pen from '@sprites/Pen.ts';
import Rectangle from '@sprites/Rectangle.ts';
import { ctx } from './canvas.ts';
import Engine from './Engine.ts';
import Text from '@sprites/Text.ts';
import Line from '@sprites/Line.ts';
import Circle from '@sprites/Circle.ts';

export interface SliderOptions {
    x: number;
    y: number;
    hidden: boolean;
    label: string;
    value: number;
    step: number;
    min: number;
    max: number;
}

export const baseWidth = 120;
export const baseHeight = 45;
export const margin = 5;
const padding = 5;

const displayWidth = 40;
const displayHeight = 15;

const sliderLength = baseWidth - 2 * padding - 20;
const thumbRadius = 5;

export default class Slider {

    public label: string;
    public value: number;

    public hidden: boolean;

    public x = 0;
    public y = 0;

    public step: number;
    public min: number;
    public max: number;

    private thumbPath: Path2D;
    private onChangeFuncs: ((newValue: number) => void)[] = [];
    public static dragging: Slider | null = null;

    public draw() {

        // Base
        Pen.drawSprite(Rectangle, {
            color: '#cccccc',
            x: this.x,
            y: this.y,
            width: baseWidth,
            height: baseHeight
        }, ctx);

        // Display
        Pen.drawSprite(Rectangle, {
            color: '#6422ff',
            x: this.x + (baseWidth - displayWidth) / 2 - margin,
            y: this.y + (baseHeight - displayHeight) / 2 - margin,
            width: displayWidth,
            height: displayHeight
        }, ctx);

        // Label
        Pen.drawSprite(Text, {
            content: this.shorten(this.label, 15),
            fontSize: 10,
            align: 'left',
            x: this.x - baseWidth / 2 + padding,
            y: this.y + (baseHeight - displayHeight) / 2 - padding
        }, ctx);

        // Value
        Pen.drawSprite(Text, {
            content: String(this.value).slice(0, 6),
            fontSize: 10,
            color: 'white',
            x: this.x + (baseWidth - displayWidth) / 2 - padding,
            y: this.y + (baseHeight - displayHeight) / 2 - padding
        }, ctx);

        // Slider base
        Pen.drawSprite(Line, {
            color: '#9b9b9b',
            dir: 90,
            x: this.x,
            y: this.y - baseHeight / 4,
            width: 3,
            length: sliderLength
        }, ctx);

        // Slider thumb
        Pen.drawSprite(Circle, {
            color: '#6422ff',
            x: this.x - sliderLength / 2 + (this.value - this.min) / (this.max - this.min) * sliderLength,
            y: this.y - baseHeight / 4,
            radius: thumbRadius
        }, ctx);
    }

    // Helper method to clamp labels
    private shorten(str: string, maxLength: number) {
        return str.length < maxLength ? str : `${str.slice(0, maxLength - 3)}...`;
    }

    private snapValue(value: number) {
        const snappedValue = this.min + Math.round((value - this.min) / this.step) * this.step;
        return Math.min(Math.max(snappedValue, this.min), this.max);
    }

    // Setters
    public setX(x: number) {
        this.x = x;
        this.refresh();
    }

    public setY(y: number) {
        this.y = y;
        this.refresh();
    }

    public goTo(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.refresh();
    }

    public changeX(dX: number) {
        this.x += dX;
        this.refresh();
    }

    public changeY(dY: number) {
        this.y += dY;
        this.refresh();
    }

    public hide() {
        this.hidden = true;
        this.refresh();
    }

    public show() {
        this.hidden = false;
        this.refresh();
    }

    public setStep(step: number) {
        this.step = step;
        this.refresh();
    }

    public setMin(min: number) {
        this.min = min;
        this.refresh();
    }

    public setMax(max: number) {
        this.max = max;
        this.refresh();
    }

    // Reactivity
    public onChange(callback: (newValue: number) => void) {
        this.onChangeFuncs.push(callback);
        callback(this.value);
    }

    // Hovering helper method
    private hoveringThumb() {
        const { mouseX, mouseY } = Engine.init();

        const thumbX = this.x - sliderLength / 2 + (this.value - this.min) / (this.max - this.min) * sliderLength;
        const thumbY = this.y - baseHeight / 4;

        const localX = mouseX - thumbX;
        const localY = mouseY - thumbY;

        return ctx.isPointInPath(this.thumbPath, localX, localY);
    }

    // Re-paint
    private refresh() {
        Engine.init().refresh();
    }

    // Initialization
    constructor(options?: Partial<SliderOptions>) {

        const engine = Engine.init();

        this.label = options?.label ?? '@tscratch/default_label';
        this.value = options?.value ?? 0;

        // Get tracked by the Engine class
        engine.addSlider(this);

        if (options?.x) this.x = options.x;
        if (options?.y) this.y = options.y;

        this.hidden = options?.hidden ?? false;

        this.min = options?.min ?? 0;
        this.max = options?.max ?? 100;
        this.step = options?.step ?? (this.min - this.max) / 100;

        // Drag handler
        engine.onPress(() => {
            // Start dragging
            const hovering = this.hoveringThumb();
            if (!this.hidden && hovering && engine.mouseDown && !Slider.dragging)
                Slider.dragging = this;

            const isCurrentlyDragging = !this.hidden && Slider.dragging === this;

            if (isCurrentlyDragging) {
                const thumbX = Math.min(Math.max(engine.mouseX, this.x - sliderLength / 2), this.x + sliderLength / 2);
                const rawValue = this.min + (this.max - this.min) * ((thumbX - this.x) / sliderLength + 0.5);
                this.value = this.snapValue(rawValue);
                for (const func of this.onChangeFuncs) func(this.value);
                this.refresh();
            }
        });

        // Set the thumb path
        const thumbPath = new Path2D;
        thumbPath.ellipse(
            0, 0,
            thumbRadius,
            thumbRadius,
            0, 0,
            Math.PI * 2
        );
        this.thumbPath = thumbPath;

        // Draw
        this.draw();
    }
}