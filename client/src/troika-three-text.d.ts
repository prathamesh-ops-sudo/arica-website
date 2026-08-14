declare module 'troika-three-text' {
  import * as THREE from 'three';

  export class Text extends THREE.Mesh {
    text: string;
    fontSize: number;
    color: number | string;
    anchorX: number | string;
    anchorY: number | string;
    outlineWidth: number | string;
    outlineColor: number | string;
    sync(callback?: () => void): void;
  }

  export function configureTextBuilder(config: { useWorker?: boolean }): void;
}
