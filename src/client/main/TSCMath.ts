import type { Mat2, Mat3, Mat4 } from '@ctypes/Matricies.ts';
import type { Vec2, Vec3, Vec4 } from '@ctypes/Vectors.ts';
import { ctx } from './canvas.ts';

type Vec = Vec2 | Vec3 | Vec4;
type Mat = Mat2 | Mat3 | Mat4;

// Static class
export default class TSCMath {

    private constructor() {} // Staticity using a private constructor

    // Random integer
    public static pickRandom(min: number, max: number) {
        if (min > max)
            [min, max] = [max, min];
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // --- Vectors ---

    // Vector magnitude
    public static magnitude(v: Vec2): number;
    public static magnitude(v: Vec3): number;
    public static magnitude(v: Vec4): number;
    public static magnitude(v: Vec): number {
        return Math.hypot(...v);
    }

    // Vector normalization
    public static normalize(v: Vec2): Vec2;
    public static normalize(v: Vec3): Vec3;
    public static normalize(v: Vec4): Vec4;
    public static normalize(v: Vec): Vec {
        const d = Math.hypot(...v);
        if (d === 0) return [...v] as Vec;

        return v.map(n => n / d) as Vec;
    }

    // Vector addition
    public static add(a: Vec2, b: Vec2): Vec2;
    public static add(a: Vec3, b: Vec3): Vec3;
    public static add(a: Vec4, b: Vec4): Vec4;
    public static add(a: Vec, b: Vec): Vec {
        return a.map((n, i) => n + b[i]!) as Vec;
    }

    // Vector subtraction
    public static subtract(a: Vec2, b: Vec2): Vec2;
    public static subtract(a: Vec3, b: Vec3): Vec3;
    public static subtract(a: Vec4, b: Vec4): Vec4;
    public static subtract(a: Vec, b: Vec): Vec {
        return a.map((n, i) => n - b[i]!) as Vec;
    }

    // Vector x scalar multiplication
    public static multiply(a: Vec2, b: Vec2): Vec2;
    public static multiply(a: Vec3, b: Vec3): Vec3;
    public static multiply(a: Vec4, b: Vec4): Vec4;
    public static multiply(a: Vec, b: Vec): Vec {
        return a.map((n, i) => n * b[i]!) as Vec;
    }

    // Vector dot product
    public static dot(a: Vec2, b: Vec2): number;
    public static dot(a: Vec3, b: Vec3): number;
    public static dot(a: Vec4, b: Vec4): number;
    public static dot(a: Vec, b: Vec): number {
        return a.reduce((sum, n, i) => sum + n * b[i]!, 0);
    }

    // Vector cross product
    public static cross(a: Vec3, b: Vec3): Vec3 {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ];
    }

    // --- Matricies ---

    public multiply(vec: Vec2, mat: Mat2): Vec2
    public multiply(vec: Vec3, mat: Mat3): Vec3
    public multiply(vec: Vec4, mat: Mat4): Vec4
    public multiply(vec: Vec, mat: Mat): Vec {

        const size = vec.length;
        const result = new Array(size) as number[];
    
        for (let row = 0; row < size; row++) {
            let sum = 0;
            for (let col = 0; col < size; col++)
                sum += mat[row]![col]! * vec[col]!;

            result[row] = sum;
        }
    
        return result as Vec;
    }

    // --- Angles ---

    // Deg / rad conversion
    public static toRadians(deg: number) {
        return deg * Math.PI / 180;
    }

    public static toDegrees(rad: number) {
        return rad * 180 / Math.PI;
    }

    // Trigonometric functions
    public static sin(deg: number) {
        return Math.sin(TSCMath.toRadians(deg));
    }

    public static cos(deg: number) {
        return Math.cos(TSCMath.toRadians(deg));
    }

    public static tan(deg: number) {
        return Math.tan(TSCMath.toRadians(deg));
    }

    public static csc(deg: number) {
        return 1 / Math.sin(TSCMath.toRadians(deg));
    }

    public static sec(deg: number) {
        return 1 / Math.cos(TSCMath.toRadians(deg));
    }

    public static cot(deg: number) {
        return 1 / Math.tan(TSCMath.toRadians(deg));
    }

    // Inverse Trigonometric functions
    public static asin(val: number) {
        return TSCMath.toDegrees(Math.asin(val));
    }

    public static acos(val: number) {
        return TSCMath.toDegrees(Math.acos(val));
    }

    public static acsc(val: number) {
        return TSCMath.toDegrees(Math.asin(1 / val));
    }

    public static asec(val: number) {
        return TSCMath.toDegrees(Math.acos(1 / val));
    }

    // --- Colors ---

    public static toRGB(color: string): { r: number; g: number; b: number } {
        
        ctx.fillStyle = color;
        const computed = ctx.fillStyle; // HEX

        if (computed.startsWith('#')) {
            const hex = computed.slice(1);
            const num = parseInt(hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex, 16);
            return {
                r: (num >> 16) & 255,
                g: (num >> 8) & 255,
                b: num & 255
            };
        }

        return { r: 0, g: 0, b: 255 }; // Default fallback
    }
}