import type { Vec3 } from '@ctypes/Vectors.ts';
import TSCMath from '@main/TSCMath.ts';
import Renderer3D from './Renderer3D.ts';

export default class WireframeRenderer3D extends Renderer3D {

    // Render (run every frame)
    public render() {
        const sinX = TSCMath.sin(this.camera.dirX);
        const cosX = TSCMath.cos(this.camera.dirX);
        const sinY = TSCMath.sin(this.camera.dirY);
        const cosY = TSCMath.cos(this.camera.dirY);
        const sinZ = TSCMath.sin(this.camera.dirZ);
        const cosZ = TSCMath.cos(this.camera.dirZ);

        for (const obj of this.objects) {

            const projected = this.project(this.getRelativeVertices(obj));

            this.color = obj.color || 'black';
    
            for (const f of obj.faces) {
    
                const [x, y] = projected[f[0]]!;
                this.goTo(x, y);
                this.down();
    
                for (const vIndex of f) {
                    const [x, y] = projected[vIndex]!;
                    this.goTo(x, y);
                }
    
                this.goTo(x, y);
                this.up();
            }
        }
    }
}