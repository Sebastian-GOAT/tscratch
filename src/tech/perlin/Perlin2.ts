import Perlin from './Perlin.ts';

export default class Perlin2D extends Perlin {

    public amplitude = 1;
    public gradientCount = 100;
    private gradients: number[][][] = [];
    
    constructor() {
        super();
        this.regen();
    }

    public regen() {
        this.gradients = [];
        for (let i = 0; i < this.gradientCount; i++) {

            const row: number[][] = [];

            for (let j = 0; j < this.gradientCount; j++) {

                const x = Math.random() * 2 - 1;
                const y = Math.random() * 2 - 1;

                const mag = (x*x + y*y) ** 0.5;

                if (mag !== 0) row.push([x / mag, y / mag]);
                else row.push([1, 0]);
            }

            this.gradients.push(row);
        }
    }
    
    public get(x: number, y: number) {
        
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const x1 = x0 + 1;
        const y1 = y0 + 1;

        const g_bottom_left  = this.gradients[this.mod(y0, this.gradientCount)]![this.mod(x0, this.gradientCount)]!;
        const g_bottom_right = this.gradients[this.mod(y0, this.gradientCount)]![this.mod(x1, this.gradientCount)]!;
        const g_top_left     = this.gradients[this.mod(y1, this.gradientCount)]![this.mod(x0, this.gradientCount)]!;
        const g_top_right    = this.gradients[this.mod(y1, this.gradientCount)]![this.mod(x1, this.gradientCount)]!;

        const dx0 = x - x0;
        const dy0 = y - y0;
        const dx1 = x - x1;
        const dy1 = y - y1;

        const s_bottom_left  = g_bottom_left[0]!  * dx0 + g_bottom_left[1]!  * dy0;
        const s_bottom_right = g_bottom_right[0]! * dx1 + g_bottom_right[1]! * dy0;
        const s_top_left     = g_top_left[0]!     * dx0 + g_top_left[1]!     * dy1;
        const s_top_right    = g_top_right[0]!    * dx1 + g_top_right[1]!    * dy1;

        const u = this.fade(dx0);
        const v = this.fade(dy0);

        const l1 = this.lerp(s_bottom_left, s_bottom_right, u)
        const l2 = this.lerp(s_top_left, s_top_right, u)

        return this.lerp(l1, l2, v) * this.amplitude * 2
    }
}