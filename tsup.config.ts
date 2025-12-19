import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/client/index.ts', 'src/server/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    target: 'esnext',
    esbuildOptions(options) {
        options.alias = {
            // Server
            '@server': './src/server',
            // Client
            '@main': './src/client/main',
            '@sprites': './src/client/sprites',
            '@ctypes': './src/client/types'
        };
    }
});