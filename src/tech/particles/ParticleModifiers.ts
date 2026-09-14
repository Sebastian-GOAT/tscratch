export interface ParticleModifier {
    name: string;
    value: unknown;
}

export default class ParticleModifiers {

    public static readonly incompatibleModifiers: Record<string, string[]> = {
        'parallax': ['randomSpeed'],
        'randomSpeed': ['parallax']
    };

    public static fadeOut(duration: number): ParticleModifier {
        return { name: 'fadeOut', value: duration };
    }

    public static randomSize(minPercentage: number): ParticleModifier {
        return { name: 'randomSize', value: minPercentage };
    }

    public static randomSpeed(minPercentage: number): ParticleModifier {
        return { name: 'randomSpeed', value: minPercentage };
    }

    public static parallax(): ParticleModifier {
        return { name: 'parallax', value: null };
    }

    public static turn(deg: number): ParticleModifier {
        return { name: 'turn', value: deg };
    }

    // Prevent initialization on a static class
    private constructor() {}
}