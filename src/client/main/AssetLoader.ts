export default class AssetLoader {

    private static audioContext: AudioContext | null = null;

    // Singleton audiocontext
    private static getAudioContext(): AudioContext {
        if (!AssetLoader.audioContext) {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            AssetLoader.audioContext = new AudioContextClass();
        }
        return AssetLoader.audioContext;
    }

    // Public loading methods
    public static async loadCostumes<K extends string>(costumePaths: Record<K, string>) {
        const result = await AssetLoader.loadAll(costumePaths, async (url: string) => this.loadSingleCostume(url));
        return result;
    }

    public static async loadSounds<K extends string>(soundPaths: Record<K, string>) {
        const result = await AssetLoader.loadAll(soundPaths, async (url: string) => this.loadSingleSound(url));
        return result;
    }

    public static async loadFonts<K extends string>(fontPaths: Record<K, string>) {
        const result = await AssetLoader.loadAll(fontPaths, async (url: string, key: K) => this.loadSingleFont(url, key));
        return result;   
    }

    // Loading everything at once
    private static async loadAll<K extends string, V>(
        paths: Record<K, string>,
        loadSingleFn: (url: string, key: K) => Promise<V>
    ) {

        const keys = Object.keys(paths) as K[];
        const result = {} as Record<K, V>;

        // Download all
        await Promise.all(
            keys.map(async key => {
                const url = paths[key];
                result[key] = await loadSingleFn(url, key);
            })
        );

        return result;
    }

    // Individual loading helpers
    private static async loadSingleCostume(url: string) {
        const img = new Image();
        img.src = url;
        await img.decode();
        return await createImageBitmap(img);
    }

    private static async loadSingleSound(url: string) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch sound: ${res.status} ${res.statusText}`);

        const arrayBuffer = await res.arrayBuffer();
        const ctx = AssetLoader.getAudioContext();
        return await ctx.decodeAudioData(arrayBuffer);
    }

    private static async loadSingleFont<K extends string>(url: string, name: K) {
        const font = new FontFace(name, `url(${url})`);
        await font.load();
        document.fonts.add(font);
        return name;
    }

    // Static class
    private constructor() {}
}