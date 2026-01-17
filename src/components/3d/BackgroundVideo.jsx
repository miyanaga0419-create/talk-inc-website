import React, { useRef } from 'react';
import { useAspect, useVideoTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BackgroundVideo = ({ url, visible }) => {
    // スマホ対応版設定
    const texture = useVideoTexture(url, {
        // unsuspend: 'canplay', // ← これは絶対に削除！(スマホで止まる原因)
        muted: true,    // 自動再生に必須
        loop: true,
        start: true,
        playsInline: true, // iPhone対応に必須
        crossOrigin: "Anonymous",
    });

    // 画面サイズに合わせてアスペクト比を計算
    const scale = useAspect(1920, 1080, 1);
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current) {
            // フェードイン・アウトのアニメーション
            const targetOpacity = visible ? 1 : 0;
            meshRef.current.material.opacity = THREE.MathUtils.lerp(
                meshRef.current.material.opacity,
                targetOpacity,
                delta * 3
            );

            // 常にカメラの後ろをついてくるように配置
            const { position } = state.camera;
            meshRef.current.position.set(position.x, position.y, position.z - 10);
        }
    });

    return (
        <mesh ref={meshRef} scale={scale}>
            <planeGeometry />
            <meshBasicMaterial
                map={texture}
                toneMapped={false}
                transparent
                opacity={0} // 初期値
                depthTest={false} // トンネルより奥に表示
            />
        </mesh>
    );
};

export default BackgroundVideo;
