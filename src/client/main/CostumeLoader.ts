export default class CostumeLoader {

    public static async load<K extends string>(costumePaths: Record<K, string>) {
        
        const keys = Object.keys(costumePaths) as K[];
        const result = {} as Record<K, ImageBitmap>;

        // Download all costumes
        await Promise.all(
            keys.map(async key => {
                const url = costumePaths[key];
                result[key] = await CostumeLoader.loadSingleBitmap(url);
            })
        );

        return result;
    }

    // Loading helper
    private static async loadSingleBitmap(url: string): Promise<ImageBitmap> {
        const img = new Image();
        img.src = url;
        await img.decode(); 
        return await createImageBitmap(img);
    }

    // Static class
    private constructor() {}
}