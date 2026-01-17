import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import LocationMap from '../3d/LocationMap';

const AboutMapSection = () => {
  return (
    // IDを付与してCSSで特定できるようにする
    // 高さを300pxに固定して表示領域を確保
    <div id="about-map-container" style={{ width: '100%', height: '300px', position: 'relative', marginTop: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>

      {/* 操作ガイド */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 10,
        background: 'rgba(255,255,255,0.8)',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.7rem',
        color: '#666',
        pointerEvents: 'none'
      }}>
        3D MAP - DRAG TO ROTATE
      </div>

      {/* 3Dキャンバス */}
      <Canvas
        camera={{ position: [8, 8, 8], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
        <LocationMap />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      {/* ★最重要: グローバルの全画面固定設定をここで打ち消す */}
      <style>{`
        #about-map-container canvas {
          position: absolute !important; /* fixedを解除 */
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 1 !important;       /* 文字の下に潜り込まないように */
          background: #f9f9f9;
        }
      `}</style>
    </div>
  );
};

export default AboutMapSection;
