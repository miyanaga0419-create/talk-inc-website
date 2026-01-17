import React, { useMemo, useRef, useState } from 'react';
import { useTexture, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// イージング関数 (TOP画面用)
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

const WebBrowser = ({ position, scale = 1, forWebSection = false }) => {
    // 画像パスは適宜合わせてください
    const rawTexture = useTexture('/textures/hyogo.png');
    const scroll = useScroll(); // スクロール検知用

    // --- サイズ設定 ---
    const width = 5.2;
    const headerHeight = 0.25;
    const screenHeight = 3.2;
    const radius = 0.05;

    // テクスチャの独立化
    const texture = useMemo(() => {
        const t = rawTexture.clone();
        t.wrapS = THREE.ClampToEdgeWrapping;
        t.wrapT = THREE.RepeatWrapping; // 縦方向は繰り返し
        t.anisotropy = 16;
        return t;
    }, [rawTexture]);

    // TOP画面アニメーション用
    const timer = useRef(0);
    const [ready, setReady] = useState(false);

    // ヘッダー形状
    const headerGeometry = useMemo(() => {
        const shape = new THREE.Shape();
        const w = width; const h = headerHeight; const r = radius;
        shape.moveTo(-w / 2, -h / 2); shape.lineTo(w / 2, -h / 2);
        shape.lineTo(w / 2, h / 2 - r); shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
        shape.lineTo(-w / 2 + r, h / 2); shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
        shape.lineTo(-w / 2, -h / 2);
        return new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
    }, [width, headerHeight, radius]);

    // --- アニメーションループ ---
    useFrame((state, delta) => {
        if (!texture.image) return;
        if (!ready) setReady(true);

        // 1. 比率計算 (画像を枠にフィットさせる設定)
        const imageAspect = texture.image.width / texture.image.height;
        const screenAspect = width / screenHeight;
        const repeatY = imageAspect / screenAspect;
        texture.repeat.set(1, repeatY);

        // 2. スタート位置 (画像の最上部)
        // ※ repeatY < 1 の場合は、画像の下が見えないようにオフセット調整
        const startY = repeatY < 1 ? 1 - repeatY : 0;

        // --- 分岐処理 ---
        if (forWebSection) {
            // ==========================================
            // 【A】WEBセクション用の動き (スクロール連動)
            // ==========================================

            // ★修正: スクロールの開始タイミングを遅くする
            // range(開始位置, 継続距離) -> 0〜1の値を返す
            // 0.65: スクロール全体の65%の位置から開始 (かなり遅め)
            const scrollValue = scroll.range(0.65, 0.35);

            if (scrollValue > 0) {
                // スクロール量に応じて移動（1.5倍速で動かす）
                // スタート位置から下に下がっていく
                let currentOffset = startY - (scrollValue * 1.5);

                // 無限ループさせるための計算 (1周したら戻る)
                // ※画像が下に流れていく表現にするためマイナス方向へ
                // repeatYを考慮してループ点を調整
                if (currentOffset < -repeatY) {
                    currentOffset = startY;
                }

                // 単純なリピート処理 (yが減り続けると画像がループする設定が必要)
                // ここでは簡易的に、一定量進んだら戻すのではなく、TextureのRepeatWrappingを利用して流し続ける
                texture.offset.y = startY - (scrollValue * 0.8); // 0.8は移動係数
            } else {
                // 開始前は定位置で待機
                texture.offset.y = startY;
            }

        } else {
            // ==========================================
            // 【B】TOP画面用の動き (自動15%スクロール)
            // ==========================================
            const targetY = startY - 0.15; // 15%下へ

            timer.current += delta;
            const delay = 1.0;    // 待機
            const duration = 2.0; // 移動時間

            let progress = (timer.current - delay) / duration;
            progress = Math.max(0, Math.min(1, progress));

            const ease = easeOutCubic(progress);
            texture.offset.y = THREE.MathUtils.lerp(startY, targetY, ease);
        }
    });

    return (
        <group position={position} scale={scale}>
            {/* Header */}
            <group position={[0, screenHeight / 2 + headerHeight / 2, 0]}>
                <mesh geometry={headerGeometry}>
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
                <group position={[-width / 2 + 0.2, 0, 0.06]}>
                    <mesh position={[0, 0, 0]}><circleGeometry args={[0.05, 32]} /><meshBasicMaterial color="#ff5f56" /></mesh>
                    <mesh position={[0.2, 0, 0]}><circleGeometry args={[0.05, 32]} /><meshBasicMaterial color="#ffbd2e" /></mesh>
                    <mesh position={[0.4, 0, 0]}><circleGeometry args={[0.05, 32]} /><meshBasicMaterial color="#27c93f" /></mesh>
                </group>
            </group>

            {/* Content */}
            <mesh position={[0, 0, 0]} visible={ready}>
                <planeGeometry args={[width, screenHeight]} />
                <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

export default WebBrowser;
