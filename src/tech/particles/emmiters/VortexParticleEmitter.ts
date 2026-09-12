import Particle from '../Particle.ts';
import TSCMath from '@main/TSCMath.ts';
import ParticleEmitter, { type ParticleEmitterOptions } from '../ParticleEmitter.ts';

export interface VortexParticleEmitterOptions extends ParticleEmitterOptions {
    dir: number;
    angle: number;
    rotation: number;
}

export default class VortexParticleEmitter extends ParticleEmitter {

    public dir: number;
    public angle: number;
    public rotation: number;

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

        const rotationRad = (this.rotation * Math.PI / 180) * dt;
        const cosR = Math.cos(rotationRad);
        const sinR = Math.sin(rotationRad);

        const oldvX = particle.vX;
        const oldvY = particle.vY;

        particle.vX = oldvX * cosR - oldvY * sinR;
        particle.vY = oldvX * sinR + oldvY * cosR;

        particle.x += particle.vX * dt;
        particle.y += particle.vY * dt;
    }

    constructor(options?: Partial<VortexParticleEmitterOptions>) {
        super(options);

        this.particleLifetime = options?.particleLifetime ?? 2.2;
        
        this.dir = options?.dir ?? 0;
        this.angle = options?.angle ?? 25;
        this.rotation = options?.rotation ?? 180;
    }
}