import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
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
  const [aboutOpen, setAboutOpen] = useState(false); // ABOUTパネル開閉

  return (
    <ErrorBoundary>
      {/* 1. ナビゲーション (Canvasの外) */}
      <Navigation onAboutClick={() => setAboutOpen(true)} />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#ececec']} />
        <fog attach="fog" args={['#ececec', 5, 40]} />

        <Suspense fallback={null}>
          {/* ページ数を増やしてシミュレーター用のスペースを確保 */}
          <ScrollControls pages={9} damping={0.2}>
            <Experience setAtBottom={setAtBottom} setShowSim={setShowSim} />
            {/* 2. アンカーポイント (HTMLオーバーレイ) */}
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
    </ErrorBoundary>
  );
}

export default App;
