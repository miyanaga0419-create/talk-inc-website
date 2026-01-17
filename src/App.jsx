import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Loader } from '@react-three/drei'; // ★Loaderを追加
import Experience from './components/3d/Experience';
import Interface from './components/ui/Interface';
import Navigation from './components/ui/Navigation';
import { Overlay } from './components/ui/Overlay';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [atBottom, setAtBottom] = useState(false);
  const [showSim, setShowSim] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <ErrorBoundary>
      <Navigation onAboutClick={() => setAboutOpen(true)} />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={1} /* ★重要: スマホの負荷を下げるため [1, 2] ではなく 1 に固定 */
      >
        <color attach="background" args={['#ececec']} />
        <fog attach="fog" args={['#ececec', 5, 40]} />

        <Suspense fallback={null}>
          <ScrollControls pages={9} damping={0.2}>
            <Experience setAtBottom={setAtBottom} setShowSim={setShowSim} />
            <Overlay />
          </ScrollControls>
        </Suspense>
      </Canvas>

      <Interface
        atBottom={atBottom}
        showSim={showSim}
        aboutOpen={aboutOpen}
        setAboutOpen={setAboutOpen}
      />

      {/* ★追加: ロード画面を表示 */}
      <Loader
        containerStyles={{ background: '#ececec' }} // 背景色
        innerStyles={{ background: '#333', width: '200px', height: '10px' }} // バーの枠
        barStyles={{ background: '#1a1a1a', height: '10px' }} // バーの中身
        dataStyles={{ color: '#333', fontSize: '1rem', fontWeight: 'bold' }} // 文字
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`} // 文字の内容
      />
    </ErrorBoundary>
  );
}

export default App;
