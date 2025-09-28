import Sprite from './Sprite.ts';
import { ctx, canvas } from './canvas.ts';

export default class Rectangle extends Sprite {

    public width: number = 50;
    public height: number = 50;
    public color: string = 'black';

    public draw(): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.width / 2 + canvas.width / 2,
            this.y - this.height / 2 + canvas.height / 2,
            this.width,
            this.height
        );
    }

    constructor() {
        super();
        this.draw();
    }

}