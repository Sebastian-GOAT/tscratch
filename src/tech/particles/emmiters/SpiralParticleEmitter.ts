import Particle from '../Particle.ts';
import TSCMath from '@main/TSCMath.ts';
import ParticleEmitter, { type ParticleEmitterOptions } from '../ParticleEmitter.ts';

export interface SpiralParticleEmitterOptions extends ParticleEmitterOptions {
    dir: number;
    angle: number;
    spacing: number;
}

export default class SpiralParticleEmitter extends ParticleEmitter {

    public dir: number;
    public angle: number;
    public spacing: number;

    protected override emit() {

        const dir = this.dir + (Math.random() - 0.5) * this.angle;

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

        const age = (performance.now() - particle.startTime) * 0.001;

        // 1. Recover original emission angle (in degrees) from stored velocity
        const baseAngleRad = Math.atan2(particle.vX, particle.vY);
        const baseAngleDeg = baseAngleRad * (180 / Math.PI);

        // 2. Degrees rotated over time based on speed
        const rotationDegrees = age * this.particleSpeed;

        // 3. Spiral radius: increases by `spacing` every 360° of rotation
        const radius = (rotationDegrees / 360) * this.spacing;

        // 4. Combine base angle + rotation
        const currentAngle = baseAngleDeg + rotationDegrees;

        // 5. Update position using Archimedean spiral formula
        particle.x = this.x + TSCMath.sin(currentAngle) * radius;
        particle.y = this.y + TSCMath.cos(currentAngle) * radius;
        particle.dir += this.modifiers.has('turn')
            ? this.modifiers.get('turn') as number * dt
            : 0;
    }

    constructor(options?: Partial<SpiralParticleEmitterOptions>) {
        super(options);

        this.particleLifetime = options?.particleLifetime ?? 5;
        this.particleSize = options?.particleSize ?? 3;
        this.particleSpeed = options?.particleSpeed ?? 150;

        this.dir = options?.dir ?? 0;
        this.angle = options?.angle ?? 135;
        this.spacing = options?.spacing ?? 15;
    }
}