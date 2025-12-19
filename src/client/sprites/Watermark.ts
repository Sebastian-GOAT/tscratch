import { canvas } from '@main/canvas.ts';
import Text, { type TextOptions } from './Text.ts';

export default class Watermark extends Text {

    public override tags = new Set(['text', 'watermark']);

    public override create(options?: TextOptions): this {
        return new Watermark(options) as this;
    }

    constructor(options?: TextOptions) {
        super(options);

        this.content = options?.content ?? 'Made with TScratch';
        this.x = options?.x ?? -canvas.width / 2 + 5,
        this.y = options?.y ?? canvas.height / 2 - 5,
        this.align = options?.align ?? 'left',
        this.baseline = options?.baseline ?? 'top'

        this.draw();
    }
}