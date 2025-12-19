import type { Vec3 } from '../../types/Vectors.ts';
import TSCMath from '../../TSCMath.ts';
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

            const projected = this.project(
                obj.vertices.map(v => {
                    let x = v[0] * obj.size + obj.x - this.camera.x;
                    let y = v[1] * obj.size + obj.y - this.camera.y;
                    let z = v[2] * obj.size + obj.z - this.camera.z;

                    // Y (yaw)
                    let x1 = x * cosY - z * sinY;
                    let z1 = x * sinY + z * cosY;

                    // X (pitch)
                    let y2 = y * cosX - z1 * sinX;
                    let z2 = y * sinX + z1 * cosX;

                    // Z (roll)
                    let x3 = x1 * cosZ - y2 * sinZ;
                    let y3 = x1 * sinZ + y2 * cosZ;

                    return [x3, y3, z2] as Vec3;
                })
            );

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