import Particle from '../Particle.ts';
import TSCMath from '@main/TSCMath.ts';
import ParticleEmitter, { type ParticleEmitterOptions } from '../ParticleEmitter.ts';

export interface ConeParticleEmitterOptions extends ParticleEmitterOptions {
    dir: number;
    range: number;
}

export default class ConeParticleEmitter extends ParticleEmitter {

    public dir: number;
    public range: number;

    protected override emit() {

        const dir = this.dir + (Math.random() - 0.5) * this.range;

        this.particles.push(new Particle({
            x: this.x,
            y: this.y,
            vX: TSCMath.sin(dir) * this.particleSpeed,
            vY: TSCMath.cos(dir) * this.particleSpeed,
            color: this.particleColor,
            size: this.particleSize,
            lifetime: this.particleLifetime,
            modifiers: this.modifiers
        }));
    }

    protected override updateParticleState(particle: Particle, dt: number) {
        particle.x += particle.vX  * dt;
        particle.y += particle.vY * dt;
        particle.dir += this.modifiers.has('turn')
            ? this.modifiers.get('turn') as number * dt
            : 0;
    }

    constructor(options?: Partial<ConeParticleEmitterOptions>) {
        super(options);

        this.particleLifetime = options?.particleLifetime ?? 0.6;

        this.dir = options?.dir ?? 0;
        this.range = options?.range ?? 25;
    }
}