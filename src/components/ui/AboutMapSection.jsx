import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import LocationMap from '../3d/LocationMap';

const AboutMapSection = () => {
  return (
    <div className="map-3d-wrapper">
      <div className="map-3d-overlay">
        <span>3D MAP - DRAG TO ROTATE</span>
      </div>
      <Canvas camera={{ position: [8, 8, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
        <LocationMap />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableDamping={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      <style>{`
                .map-3d-wrapper {
                    width: 100%;
                    max-width: 100%; /* Ensure it doesn't overflow parent */
                    min-width: 0;   /* Crucial for grid containers */
                    height: 300px;
                    background: #f9f9f9;
                    border-radius: 8px;
                    margin-top: 20px;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid #eee;
                }
        .map-3d-overlay {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 10;
          background: rgba(255,255,255,0.9);
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          color: #666;
          pointer-events: none;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
};

export default AboutMapSection;
