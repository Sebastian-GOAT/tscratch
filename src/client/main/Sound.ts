export interface SoundOptions {
    volume?: number;
    loop?: boolean;
}

export default class Sound {
    
    public buffer: AudioBuffer;
    public volume = 1;
    public loop: boolean;
    
    private static audioContext: AudioContext | null = null;
    private static activeSounds = new Set<Sound>();

    private source: AudioBufferSourceNode | null = null;
    private gain: GainNode | null = null;
    private timestamp = 0;
    private startedAt = 0;
    private playRequest = 0;

    public async play(): Promise<void> {

        if (this.source) return;

        const request = ++this.playRequest;
        const context = Sound.getAudioContext();
        Sound.activeSounds.add(this);
        try {
            await context.resume();
        }
        catch (err) {
            if (request === this.playRequest && !this.source)
                Sound.activeSounds.delete(this);
            throw err;
        }

        if (request !== this.playRequest || this.source) {
            if (!this.source)
                Sound.activeSounds.delete(this);
            return;
        }

        this.startPlayback(context);
    }

    public pause() {
        ++this.playRequest;
        if (!this.source) return;

        this.timestamp = this.getPlaybackTimestamp(Sound.getAudioContext());
        this.releasePlayback(true);
    }

    public stop() {
        ++this.playRequest;
        this.timestamp = 0;
        this.releasePlayback(true);
    }

    // Stop all sounds
    public static stopAllSounds() {
        for (const sound of this.activeSounds)
            sound.stop();
    }

    // Setters
    public setVolume(volume: number) {
        if (!Number.isFinite(volume) || volume < 0 || volume > 1)
            throw new RangeError('Volume must be a finite number between 0 and 1');

        this.volume = volume;
        if (this.gain)
            this.gain.gain.value = volume;
    }

    public setTimestampSeconds(timestamp: number) {
        if (!Number.isFinite(timestamp))
            throw new RangeError('Timestamp must be a finite number');

        const duration = this.buffer.duration;
        this.timestamp = duration > 0
            ? this.loop
                ? ((timestamp % duration) + duration) % duration
                : Math.max(0, Math.min(timestamp, duration))
            : 0;

        if (this.source) {
            const context = Sound.getAudioContext();
            this.releasePlayback(true);
            this.startPlayback(context);
        }
    }

    public setTimestampPercentage(percentage: number) {
        if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100)
            throw new RangeError('Timestamp percentage must be between 0 and 100');

        this.setTimestampSeconds(this.buffer.duration * percentage / 100);
    }

    // Helpers
    private static getAudioContext() {
        if (!this.audioContext)
            this.audioContext = new AudioContext();

        return this.audioContext;
    }

    private getPlaybackTimestamp(context: AudioContext) {
        const elapsed = context.currentTime - this.startedAt;
        const timestamp = this.timestamp + Math.max(0, elapsed);

        if (this.loop && this.buffer.duration > 0)
            return timestamp % this.buffer.duration;

        return Math.min(timestamp, this.buffer.duration);
    }

    private startPlayback(context: AudioContext) {
        if (this.buffer.duration <= 0 || this.timestamp >= this.buffer.duration) {
            this.timestamp = 0;
            return;
        }

        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = this.buffer;
        source.loop = this.loop;
        gain.gain.value = this.volume;
        source.connect(gain);
        gain.connect(context.destination);

        this.source = source;
        this.gain = gain;
        this.startedAt = context.currentTime;
        Sound.activeSounds.add(this);

        source.onended = () => {
            if (this.source === source) {
                this.timestamp = 0;
                this.source = null;
                this.gain = null;
                Sound.activeSounds.delete(this);
            }
            source.onended = null;
            source.disconnect();
            gain.disconnect();
        };

        try {
            source.start(0, this.timestamp);
        } catch (error) {
            this.releasePlayback(false);
            throw error;
        }
    }

    private releasePlayback(stopSource: boolean) {
        const source = this.source;
        const gain = this.gain;
        this.source = null;
        this.gain = null;
        Sound.activeSounds.delete(this);

        if (!source) return;

        source.onended = null;
        try {
            if (stopSource)
                source.stop();
        }
        finally {
            source.disconnect();
            gain?.disconnect();
        }
    }

    // Initialization
    constructor(buffer: AudioBuffer, options?: SoundOptions) {
        this.buffer = buffer;
        this.loop = options?.loop ?? false;
        if (options?.volume !== undefined)
            this.setVolume(options.volume);
    }
}
