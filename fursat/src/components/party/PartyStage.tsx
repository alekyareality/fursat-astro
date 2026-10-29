import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react';

const StageCanvas = lazy(() => import('./StageCanvas'));

class Guard extends Component<{ children: ReactNode; onFail: () => void }, { bad: boolean }> {
  state = { bad: false };
  static getDerivedStateFromError() { return { bad: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.bad ? null : this.props.children; }
}

function canRun(): boolean {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    const n = navigator as any;
    if (n.connection?.saveData) return false;
    if ((n.deviceMemory && n.deviceMemory <= 2) || (n.hardwareConcurrency && n.hardwareConcurrency <= 2)) return false;
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
}

export default function PartyStage({ poster }: { poster: string }) {
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { setLive(canRun()); }, []);
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 420, aspectRatio: '8 / 5', margin: '0 auto 8px' }}>
      <img src={poster} alt="A gold serving cloche on a Fursat plate" width={640} height={400} decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
      {live && (
        <Guard onFail={() => setLive(false)}>
          <Suspense fallback={null}>
            <div style={{ position: 'absolute', inset: 0, opacity: ready ? 1 : 0, transition: 'opacity .18s cubic-bezier(.16,1,.3,1)' }}>
              <StageCanvas onReady={() => setReady(true)} />
            </div>
          </Suspense>
        </Guard>
      )}
    </div>
  );
}
