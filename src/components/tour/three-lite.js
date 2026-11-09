// Only the three.js pieces the panorama uses, so Vite can tree-shake the rest
// (the old `import('three')` pulled the whole 745 KB module into one chunk).
export {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Points, Raycaster,
  Vector2, Vector3, DataTexture, TextureLoader, VideoTexture, CanvasTexture,
  ShaderMaterial, MeshBasicMaterial,
  CylinderGeometry, CircleGeometry, PlaneGeometry, TorusGeometry, SphereGeometry,
  BufferGeometry, BufferAttribute,
  LinearSRGBColorSpace, LinearFilter, LinearMipmapLinearFilter,
  DoubleSide, AdditiveBlending,
} from 'three';
