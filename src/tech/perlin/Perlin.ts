import assert from "@ctypes/assert.ts";

export default abstract class Perlin {

    public amplitude = 1;
    public gradientCount = 100;

    public abstract regen(): void;
    public abstract get(...coords: number[]): number;

    protected fade(t: number) {
        return 6 * (t ** 5) - 15 * (t ** 4) + 10 * (t ** 3);
    }

    protected lerp(n0: number, n1: number, weight: number) {
        return n0 * (1 - weight) + n1 * weight;
    }

    protected mod(n: number, modulus: number) {
        assert(modulus > 0, 'Modulus must be greater than 0');

        return ((n % modulus) + modulus) % modulus;
    }
}