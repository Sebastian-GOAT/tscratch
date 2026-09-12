import Particle from '../Particle.ts';
import TSCMath from '@main/TSCMath.ts';
import ParticleEmitter, { type ParticleEmitterOptions } from '../ParticleEmitter.ts';

export interface LineParticleEmitterOptions extends ParticleEmitterOptions {
    dir: number;
    length: number;
}

export default class LineParticleEmitter extends ParticleEmitter {

    public dir: number;
    public length: number;

    protected override emit() {

        const offset = (Math.random() - 0.5) * this.length;

        const perpendicularDir = this.dir + 90; 

        const spawnX = this.x + TSCMath.sin(perpendicularDir) * offset;
        const spawnY = this.y + TSCMath.cos(perpendicularDir) * offset;

        this.particles.push(new Particle({
            x: spawnX,
            y: spawnY,
            vX: TSCMath.sin(this.dir) * this.particleSpeed,
            vY: TSCMath.cos(this.dir) * this.particleSpeed,
            color: this.particleColor,
            size: Math.max(
                1,
                this.particleSize * 0.6,
                this.particleSize * Math.random()
            )
        }));
    }

    protected override updateParticleState(particle: Particle, dt: number) {
        particle.x += particle.vX  * dt;
        particle.y += particle.vY * dt;
    }

    constructor(options?: Partial<LineParticleEmitterOptions>) {
        super(options);

        this.interval = options?.interval ?? 0.02;
        this.particleSpeed = options?.particleSpeed ?? 50;
        this.particleLifetime = options?.particleLifetime ?? 0.8;

        this.dir = options?.dir ?? 0;
        this.length = options?.length ?? 50;
    }
}