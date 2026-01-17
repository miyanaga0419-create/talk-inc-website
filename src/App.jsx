import React from 'react';
import { Canvas } from '@react-three/fiber';

// 非常にシンプルな回転する箱
const SpinningBox = () => {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshNormalMaterial />
    </mesh>
  );
};

function App() {
  return (
    // 外枠を強制的に画面いっぱいに広げるスタイル
    <div style={{ width: '100vw', height: '100vh', background: '#333', position: 'fixed', top: 0, left: 0 }}>

      {/* 3Dキャンバス */}
      <Canvas
        camera={{ position: [0, 0, 5] }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <SpinningBox />
      </Canvas>

      {/* テスト用UI */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 9999 }}>
        <h1>MOBILE TEST</h1>
        <p>If you see a colorful box, WebGL is working.</p>
      </div>

    </div>
  );
}

export default App;
