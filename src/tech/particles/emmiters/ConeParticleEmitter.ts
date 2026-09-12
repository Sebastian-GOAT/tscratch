import Particle from '../Particle.ts';
import TSCMath from '@main/TSCMath.ts';
import ParticleEmitter, { type ParticleEmitterOptions } from '../ParticleEmitter.ts';

export interface ConeParticleEmitterOptions extends ParticleEmitterOptions {
    dir: number;
    angle: number;
}

export default class ConeParticleEmitter extends ParticleEmitter {

    public dir: number;
    public angle: number;

    protected override emit() {

        const dir = this.dir + (Math.random() - 0.5) * this.angle;

        this.particles.push(new Particle({
            x: this.x,
            y: this.y,
            vX: TSCMath.sin(dir) * this.particleSpeed,
            vY: TSCMath.cos(dir) * this.particleSpeed,
            color: this.particleColor,
            size: this.particleSize,
            modifiers: this.modifiers
        }));
    }

    protected override updateParticleState(particle: Particle, dt: number) {
        particle.x += particle.vX  * dt;
        particle.y += particle.vY * dt;
    }

    constructor(options?: Partial<ConeParticleEmitterOptions>) {
        super(options);

        this.particleLifetime = options?.particleLifetime ?? 0.6;

        this.dir = options?.dir ?? 0;
        this.angle = options?.angle ?? 25;
    }
}