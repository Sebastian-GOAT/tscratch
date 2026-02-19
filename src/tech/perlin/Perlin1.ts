import Perlin from './Perlin.ts';

export default class Perlin1D extends Perlin {

    public amplitude = 1;
    public gradientCount = 100;
    private gradients: number[] = [];
    
    constructor() {
        super();
        this.regen();
    }

    public regen() {
        this.gradients = [];
        for (let i = 0; i < this.gradientCount; i++)
            this.gradients.push(Math.random() * 2 - 1);
    }
    
    public get(x: number) {
        
        const x0 = Math.floor(x);
        const x1 = x0 + 1;

        const left = this.gradients[this.mod(x0, this.gradientCount)]!;
        const right = this.gradients[this.mod(x1, this.gradientCount)]!;

        const dist_l = x - x0;
        const dist_r = x - x1;

        const n0 = left * dist_l;
        const n1 = right * dist_r

        const faded = this.fade(dist_l);

        return this.lerp(n0, n1, faded) * this.amplitude * 2;
    }
}