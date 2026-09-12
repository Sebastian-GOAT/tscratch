import Engine from '@main/Engine.ts';
import Particle from './Particle.ts';
import { canvas, penCtx } from '@main/canvas.ts';

export interface ParticleEmitterOptions {
    x: number;
    y: number;

    interval: number;

    particleColor: string;
    particleFade: number;
    particleSpeed: number;
    particleSize: number;
    particleLifetime: number;
}

export default abstract class ParticleEmitter {

    public x: number;
    public y: number;

    public interval: number;

    public particleColor: string;
    public particleSpeed: number;
    public particleSize: number;
    public particleLifetime: number;
    public particleFade: number;

    public particles: Particle[] = [];

    protected lastEmitted: number;

    protected abstract emit(): void;
    protected abstract updateParticleState(particle: Particle, dt: number): void;

    public update() {

        const engine = Engine.init();
        const dt = engine.getDeltaTime();
        const now = engine.getElapsedTime();

        // Emit a new particle
        if ((now - this.lastEmitted) * 0.001 >= this.interval) {
            this.lastEmitted = now;
            this.emit();
        }

        // Delete all dead particles
        this.particles = this.particles.filter(p => (now - p.startTime) * 0.001 < this.particleLifetime);

        // Update particle state & draw
        for (const particle of this.particles) {

            this.updateParticleState(particle, dt);

            if (this.particleFade === 0) {
                particle.draw();
                continue;
            }

            // Draw & fade out
            const ageInSeconds = (now - particle.startTime) * 0.001;
            const remainingTime = this.particleLifetime - ageInSeconds;

            if (remainingTime >= this.particleFade)                             // Full
                particle.draw();
            else {
                const alpha = Math.max(0, remainingTime / this.particleFade);   // Fade
                particle.draw(alpha);
            }
        }
    }

    public static clear() {
        penCtx.clearRect(0, 0, canvas.width, canvas.height);
    }

    constructor(options?: Partial<ParticleEmitterOptions>) {
        this.lastEmitted = Engine.init().getElapsedTime();
        this.x = options?.x ?? 0;
        this.y = options?.y ?? 0;

        this.interval = options?.interval ?? 0.033;

        this.particleColor = options?.particleColor ?? 'blue';
        this.particleSpeed = options?.particleSpeed ?? 100;
        this.particleSize = options?.particleSize ?? 4;
        this.particleLifetime = options?.particleLifetime ?? 1.5;
        this.particleFade = options?.particleFade ?? 0.3;
    }
}