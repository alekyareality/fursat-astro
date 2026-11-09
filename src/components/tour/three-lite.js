// Only the three.js pieces the panorama uses, so Vite can tree-shake the rest
// (the old `import('three')` pulled the whole 745 KB module into one chunk).
export {
  AdditiveBlending, BufferAttribute, BufferGeometry, CylinderGeometry, DataTexture, DoubleSide, Group,
  LinearFilter, LinearMipmapLinearFilter, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, PerspectiveCamera, Points,
  Raycaster, Scene, ShaderMaterial, SphereGeometry, TextureLoader, Vector2, Vector3, VideoTexture, WebGLRenderer,
} from 'three';
