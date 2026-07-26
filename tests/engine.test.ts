import { beforeEach, describe, expect, it } from 'vitest';
import Engine from '@main/Engine.ts';

describe('Engine keyboard events', () => {

    beforeEach(() => {
        (Engine as unknown as { instance: Engine | undefined }).instance = undefined;
    });

    it('Only triggers once per press when allowHold is false', () => {
        const engine = Engine.init();
        const calls: string[] = [];

        engine.onKeyPress('a', () => calls.push('first'), { allowHold: false });
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        expect(calls).toEqual(['first']);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', repeat: true }));
        expect(calls).toEqual(['first']);

        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        expect(calls).toEqual(['first', 'first']);
    });

    it('Continues to trigger while a key is held when allowHold is true', () => {
        const engine = Engine.init();
        const calls: string[] = [];

        engine.onKeyPress('a', () => calls.push('first'), { allowHold: true });
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', repeat: true }));

        expect(calls).toEqual(['first', 'first']);
    });
});
