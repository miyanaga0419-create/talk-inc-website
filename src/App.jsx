import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Loader } from '@react-three/drei';
import Experience from './components/3d/Experience';
import Interface from './components/ui/Interface';
import Navigation from './components/ui/Navigation';
import { Overlay } from './components/ui/Overlay';

function App() {
  const [atBottom, setAtBottom] = useState(false);
  const [showSim, setShowSim] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <Navigation onAboutClick={() => setAboutOpen(true)} />

      {/* スマホ対応: position: fixed で画面に固定 */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
          dpr={1} /* ★重要: スマホのクラッシュ防止のため画質を1に固定 */
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
      </div>

      <Interface
        atBottom={atBottom}
        showSim={showSim}
        aboutOpen={aboutOpen}
        setAboutOpen={setAboutOpen}
      />

      <Loader />
    </>
  );
}

export default App;
