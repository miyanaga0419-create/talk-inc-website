import React, { useState, useRef, useEffect } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import TunnelSystem from './TunnelSystem';
import TextSection from './TextSection';
import BackgroundVideo from './BackgroundVideo';
import WorksShowcase from './WorksShowcase';
import Effects from './Effects';

const videoUrl = "/movie.mp4";

const ExperienceContent = ({ setAtBottom, setShowSim }) => {
  const scroll = useScroll();
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const [videoVisible, setVideoVisible] = useState(false);
  const worldGroup = useRef();

  // --- マウスの状態管理 ---
  const isMouseInWindow = useRef(true);

  // --- ジャイロセンサーの状態管理 ---
  const deviceOrientation = useRef({ beta: 0, gamma: 0 });
  const hasGyro = useRef(false);

  useEffect(() => {
    // 1. PC: マウス監視
    const handleMouseEnter = () => { isMouseInWindow.current = true; };
    const handleMouseLeave = () => { isMouseInWindow.current = false; };

    // 2. Mobile: ジャイロ監視
    const handleOrientation = (event) => {
      if (event.beta !== null && event.gamma !== null) {
        hasGyro.current = true;
        deviceOrientation.current = { beta: event.beta, gamma: event.gamma };
      }
    };

    // 3. Scroll Logic
    const handleReset = () => { if (scroll.el) scroll.el.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleContactBack = () => { if (scroll.el) scroll.el.scrollTo({ top: scroll.el.scrollHeight * 0.83, behavior: 'smooth' }); };

    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('reset-scroll', handleReset);
    window.addEventListener('scroll-back-contact', handleContactBack);

    return () => {
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('reset-scroll', handleReset);
      window.removeEventListener('scroll-back-contact', handleContactBack);
    };
  }, [scroll]);

  useFrame((state, delta) => {
    const targetZ = -scroll.offset * 120;

    // 1. 世界のスクロール移動
    if (worldGroup.current) {
      worldGroup.current.position.z += (targetZ - worldGroup.current.position.z) * 0.08;

      // ★重要: 不具合の原因となる「回転」は完全にリセット・無効化
      worldGroup.current.rotation.x = 0;
      worldGroup.current.rotation.y = 0;
    }

    // 2. カメラの「位置」をずらす (パララックス効果)
    // 回転(Rotation)ではなく位置(Position)を動かすことで、奥に行ってもズレが大きくならず安全です。
    let targetX = 0;
    let targetY = 0;

    if (isMobile && hasGyro.current) {
      // --- スマホ (センサー有効時) ---
      const { beta, gamma } = deviceOrientation.current;
      // 傾きに応じて位置をずらす
      // gamma(左右) -> X移動, beta(前後) -> Y移動
      targetX = gamma * 0.02;
      targetY = (beta - 45) * 0.02;

    } else {
      // --- PC (マウス) ---
      if (isMouseInWindow.current) {
        // マウス位置に合わせてカメラを少し移動させる
        // state.pointer.x: 左(-1)～右(1) -> カメラも同じ方向に動かすと「覗き込む」感じになる
        targetX = state.pointer.x * 0.2; // 0.2は移動の範囲（強度）
        targetY = state.pointer.y * 0.2;
      } else {
        // 画面外なら中心(0)に戻す
        targetX = 0;
        targetY = 0;
      }
    }

    // ★カメラの「位置」をLerpでヌルっと更新
    // 元のカメラ位置(App.jsxで指定している [0, 0, 5]) を基準にするため、
    // xは targetX、yは targetY に近づける (zはScrollControlsなどが管理しないので固定でOK、ここでは触らない)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);

    // ★重要: カメラの「角度」は常に正面(0)に固定して不具合を防ぐ
    state.camera.rotation.x = 0;
    state.camera.rotation.y = 0;
    state.camera.rotation.z = 0;


    // --- Triggers (既存) ---
    const offset = scroll.offset;
    if (offset > 0.96) setAtBottom(true); else setAtBottom(false);
    if (offset > 0.92 && offset < 0.98) setShowSim(true); else setShowSim(false);
    if (offset > 0.78 && offset < 0.95) setVideoVisible(true); else setVideoVisible(false);
  });

  return (
    <>
      <BackgroundVideo url={videoUrl} visible={videoVisible} />
      <Effects />
      <group ref={worldGroup}>
        <TunnelSystem />
        <TextSection />
        <WorksShowcase />
      </group>
    </>
  );
}

const Experience = ({ setAtBottom, setShowSim }) => {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ExperienceContent setAtBottom={setAtBottom} setShowSim={setShowSim} />
    </>
  );
};

export default Experience;
