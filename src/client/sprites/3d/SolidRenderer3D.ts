import TSCMath from '@main/TSCMath.ts';
import CustomPolygon from '@sprites/CustomPolygon.ts';
import type { Vec3 } from '@ctypes/Vectors.ts';
import Renderer3D from './Renderer3D.ts';
import Pen from '@sprites/Pen.ts';

type FaceDepth = {
    face: number[];
    depth: number;
};

export default class SolidRenderer3D extends Renderer3D {

    public AMBIENT_LIGHT_INTENSITY = 0.25;
    public DIRECTED_LIGHT_INTENSITY = 0.75;
    public DIRECTED_LIGHT_DIR: Vec3 = [0, 1, 0];

    // Render (run every frame)
    public render() {
        const sinX = TSCMath.sin(this.camera.dirX);
        const cosX = TSCMath.cos(this.camera.dirX);
        const sinY = TSCMath.sin(this.camera.dirY);
        const cosY = TSCMath.cos(this.camera.dirY);
        const sinZ = TSCMath.sin(this.camera.dirZ);
        const cosZ = TSCMath.cos(this.camera.dirZ);

        // Calculate the lighting normal relative to the cameras rotation
        let lx = this.DIRECTED_LIGHT_DIR[0];
        let ly = this.DIRECTED_LIGHT_DIR[1];
        let lz = this.DIRECTED_LIGHT_DIR[2];

        // yaw
        const lx1 = lx * cosY - lz * sinY;
        const lz1 = lx * sinY + lz * cosY;

        // pitch
        const ly2 = ly * cosX - lz1 * sinX;
        const lz2 = ly * sinX + lz1 * cosX;

        // roll
        const lx3 = lx1 * cosZ - ly2 * sinZ;
        const ly3 = lx1 * sinZ + ly2 * cosZ;

        const lightDir = TSCMath.normalize([lx3, ly3, lz2]);

        for (const obj of this.objects) {

            const { h, s, l } = SolidRenderer3D.stringToHSL(obj.color || 'black');

            // Camera relative vertices
            const relativeVerts = this.getRelativeVertices(obj);

            // Face depth calculation
            const faces: FaceDepth[] = obj.faces.map(face => {
                let z = 0;
                for (const i of face) z += relativeVerts[i]![2];
                return { face, depth: z / face.length };
            });

            // Painter's algorithm (face sorting)
            faces.sort((a, b) => b.depth - a.depth);

            const projected = this.project(relativeVerts);

            // Render faces
            for (const { face } of faces) {

                // Calculate face normal using Newell's method (works for polygons with any number of vertices)
                let nx = 0, ny = 0, nz = 0;
                for (let i = 0; i < face.length; i++) {
                    const v1 = relativeVerts[face[i]!]!;
                    const v2 = relativeVerts[face[(i + 1) % face.length]!]!;
                    nx += (v1[1] - v2[1]) * (v1[2] + v2[2]);
                    ny += (v1[2] - v2[2]) * (v1[0] + v2[0]);
                    nz += (v1[0] - v2[0]) * (v1[1] + v2[1]);
                }
                const normal = TSCMath.normalize([nx, ny, nz] as Vec3);

                // Calculate lighting: dot product between normal and light direction
                const diffuse = Math.max(0, TSCMath.dot(normal, lightDir));
                const brightness =
                    this.AMBIENT_LIGHT_INTENSITY +
                    diffuse * this.DIRECTED_LIGHT_INTENSITY;

                // Adjust the brightness
                const litL = Math.min(100, Math.max(5, l + brightness * 50));
                const color = `hsl(${h}, ${s}%, ${litL}%)`;

                // Draw the polygon
                const vertices = face.map(vIndex => projected[vIndex]!);
                Pen.drawSprite(CustomPolygon, { vertices, color });
            }
        }
    }

    // String -> HSL conversion helper
    public static stringToHSL(color: string) {

        // String to RGB
        const el = document.createElement('div');
        el.style.color = color;

        document.body.appendChild(el);
        const rgb = getComputedStyle(el).color;
        document.body.removeChild(el);

        let [r, g, b] = rgb.match(/\d+/g)!.map(Number) as [number, number, number];

        // RGB to HSL
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        let l = (max + min) / 2;

        if (max === min)
            h = s = 0; // achromatic
        else {
            const d = max - min;
            s = l > 0.5
                ? d / (2 - max - min)
                : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }

        return { h, s: s * 100, l: l * 100 };
    }
}