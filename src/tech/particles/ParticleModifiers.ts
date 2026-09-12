export interface ParticleModifier {
    name: string;
    value: unknown;
}

export default class ParticleModifiers {

    public static fadeOut(duration: number): ParticleModifier {
        return { name: 'fadeOut', value: duration };
    }

    public static randomSize(minPercentage: number): ParticleModifier {
        return { name: 'randomSize', value: minPercentage };
    }

    public static parallax(): ParticleModifier {
        return { name: 'parallax', value: null };
    }

    // Prevent initialization on a static class
    private constructor() {}
}