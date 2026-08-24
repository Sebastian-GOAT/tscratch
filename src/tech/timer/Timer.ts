export default class Timer {
    
    private startTime = 0;
    private elapsed = 0; // In milliseconds
    private running = false;
    private laps: number[] = [];

    // Getters
    public getTime(): number {
        const totalMs = this.running
            ? this.elapsed + (performance.now() - this.startTime)
            : this.elapsed;
        return totalMs * 0.001;
    }

    public isRunning(): boolean {
        return this.running;
    }

    public getLaps(): number[] {
        return [...this.laps];
    }

    // Methods
    public start(): void {
        if (!this.running) {
            this.running = true;
            this.startTime = performance.now();
        }
    }

    public pause(): void {
        if (this.running) {
            this.elapsed += performance.now() - this.startTime;
            this.running = false;
        }
    }

    public lap(): number {
        const currentMs = this.running
            ? this.elapsed + (performance.now() - this.startTime)
            : this.elapsed;
        
        const lastLapTotalMs = (this.laps.reduce((acc, lap) => acc + lap, 0)) * 1000;
        const lapTimeSeconds = (currentMs - lastLapTotalMs) * 0.001;
        
        this.laps.push(lapTimeSeconds);
        return lapTimeSeconds;
    }

    public reset(): void {
        this.running = false;
        this.elapsed = 0;
        this.startTime = 0;
        this.laps = [];
    }

    public addTime(seconds: number): void {
        this.elapsed += seconds * 1000;
    }

    constructor(startSeconds = 0) {
        this.elapsed = startSeconds * 1000;
    }
}