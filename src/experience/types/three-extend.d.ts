import * as THREE from "three";

declare module "@react-three/postprocessing" {
  interface EffectComposerProps {
    camera?: THREE.Camera;
    scene?: THREE.Scene;
  }
}
