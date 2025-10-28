import { describe, it, expect } from 'vitest';
import Engine from '../src/Engine.ts';

const engine = Engine.init();
const testRange = 12;

describe('Math', () => {

    it('Angle conversion', () => {
        for (let i = 0; i < 360 / testRange; i++) {
            const deg = i * testRange;
            const rad = deg * Math.PI / 180;

            // Tests
            expect(engine.toRadians(deg)).toBeCloseTo(rad, 5);
            expect(engine.toDegrees(rad)).toBeCloseTo(deg, 5);
        }
    });

    it('Trignonometric functions', () => {
        for (let i = 0; i < 360 / testRange; i++) {
            const angle = i * testRange;

            // Tests
            expect(engine.sin(angle)).toBeCloseTo(Math.sin(angle * Math.PI / 180));
            expect(engine.cos(angle)).toBeCloseTo(Math.cos(angle * Math.PI / 180));
            expect(engine.tan(angle)).toBeCloseTo(Math.tan(angle * Math.PI / 180));
        }
    });

    it('Inverse trigonometric functions', () => {
        for (let i = 0; i < 100 / testRange; i++) {
            const value = i * testRange / 50 - 1; // [-1, 1]

            // Tests
            expect(engine.asin(value)).toBeCloseTo(Math.asin(value) * 180 / Math.PI, 5);
            expect(engine.acos(value)).toBeCloseTo(Math.acos(value) * 180 / Math.PI, 5);
        }
    });

});