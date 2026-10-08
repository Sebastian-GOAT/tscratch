export default class AssetLoader {

    public static async loadSounds<K extends string>(soundPaths: Record<K, string>) {

        const keys = Object.keys(soundPaths) as K[];
        const result = {} as Record<K, AudioBuffer>;

        await Promise.all(
            keys.map(async key => {
                const url = soundPaths[key];
                result[key] = await AssetLoader.loadSingleAudioBuffer(url);
            })
        );

        return result;
    }

    public static async loadCostumes<K extends string>(costumePaths: Record<K, string>) {
        
        const keys = Object.keys(costumePaths) as K[];
        const result = {} as Record<K, ImageBitmap>;

        // Download all costumes
        await Promise.all(
            keys.map(async key => {
                const url = costumePaths[key];
                result[key] = await AssetLoader.loadSingleBitmap(url);
            })
        );

        return result;
    }

    // Loading helpers
    private static async loadSingleBitmap(url: string) {
        const img = new Image();
        img.src = url;
        await img.decode();
        return await createImageBitmap(img);
    }

    private static async loadSingleAudioBuffer(url: string) {

        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`Failed to fetch sound: ${res.status} ${res.statusText}`);

        const arrayBuffer = await res.arrayBuffer();
        const audioContext = new AudioContext();
        
        try {
            return await audioContext.decodeAudioData(arrayBuffer.slice(0));
        }
        finally {
            await audioContext.close();
        }
    }

    // Static class
    private constructor() {}
}