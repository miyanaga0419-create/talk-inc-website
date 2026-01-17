import React, { useRef, useMemo } from 'react';
import { RoundedBox, Text, PresentationControls, Float, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 建物の共通パーツ
const Building = ({ position, args, color, label, opacity = 1 }) => {
    return (
        <group position={position}>
            <RoundedBox args={args} radius={0.05} smoothness={4}>
                <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.3} />
            </RoundedBox>
            {label && (
                <Text
                    position={[0, (args[1] / 2) + 0.4, 0]}
                    fontSize={0.25}
                    color="#333"
                    anchorX="center"
                    anchorY="bottom"
                    outlineWidth={0.02}
                    outlineColor="#fff"
                >
                    {label}
                </Text>
            )}
        </group>
    );
};

// 道路パーツ
const Road = ({ position, args, rotation = [0, 0, 0] }) => {
    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, rotation[2]]} receiveShadow>
            <planeGeometry args={args} />
            <meshBasicMaterial color="#dcdcdc" />
        </mesh>
    );
};

// --- 丸いドットのアニメーションルート ---
const RouteDots = () => {
    // 経路定義
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.8, 0.1, -2.0), // Start
            new THREE.Vector3(2.0, 0.1, -2.0),
            new THREE.Vector3(2.0, 0.1, 0.0),
            new THREE.Vector3(-0.5, 0.1, 0.0),
            new THREE.Vector3(-0.5, 0.1, 1.2),
            new THREE.Vector3(-1.0, 0.1, 1.2), // Goal
        ], false, 'catmullrom', 0.1); // 0.1 = 直線的に繋ぐ
    }, []);

    // ドットの数
    const numDots = 15;
    const dotsRef = useRef([]);

    // 初期化 (Ref配列作成)
    dotsRef.current = new Array(numDots).fill(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const speed = 0.15; // ゆっくり流れる速度

        dotsRef.current.forEach((mesh, i) => {
            if (mesh) {
                // 各ドットの進行度 (0~1) を計算
                // 時間 + オフセット(i/numDots) でずらす
                let t = (time * speed + i / numDots) % 1;

                // 経路上の位置を取得
                const pos = curve.getPoint(t);
                mesh.position.copy(pos);
            }
        });
    });

    return (
        <group>
            {/* ドットを生成 */}
            {new Array(numDots).fill(0).map((_, i) => (
                <mesh key={i} ref={el => dotsRef.current[i] = el}>
                    <sphereGeometry args={[0.08, 16, 16]} /> {/* 半径0.08の丸 */}
                    <meshBasicMaterial color="#ff4d4d" />
                </mesh>
            ))}
        </group>
    );
};

const LocationMap = () => {
    return (
        <group position={[0, -1, 0]}>
            <group scale={0.8} rotation={[0, -Math.PI / 4, 0]}> {/* Rotate 45deg to align with isometric camera */}

                {/* --- 道路網 --- */}
                <Road position={[-2.5, 0.01, 0]} args={[0.6, 12]} />
                <Road position={[-0.5, 0.01, 0]} args={[0.6, 12]} />
                <Road position={[2.0, 0.01, 0]} args={[1.2, 12]} />

                <Road position={[0, 0.01, -2.5]} args={[10, 0.6]} />
                <Road position={[0, 0.01, 0.0]} args={[10, 0.6]} />
                <Road position={[0, 0.01, 2.5]} args={[10, 0.6]} />

                <Road position={[-3, 0.01, -4]} args={[8, 0.6]} rotation={[0, 0, Math.PI / 4]} />

                {/* --- ナビゲーションルート (丸ドット版) --- */}
                <RouteDots />


                {/* --- 建物 --- */}

                {/* Talk109 */}
                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                    <Building
                        position={[-1.5, 0.8, 1.2]}
                        args={[1.0, 1.6, 1.0]}
                        color="#1a1a1a"
                        label="Talk 109"
                    />
                    <mesh position={[-1.5, 2.2, 1.2]}>
                        <coneGeometry args={[0.2, 0.5, 32]} />
                        <meshStandardMaterial color="#ff4d4d" />
                    </mesh>
                </Float>

                {/* 阪神高速 */}
                <group position={[4.0, 1.5, 0]}>
                    <RoundedBox args={[1.5, 0.1, 14]} radius={0.05}>
                        <meshStandardMaterial color="#999" />
                    </RoundedBox>
                    {[-5, -2, 1, 4].map((z, i) => (
                        <Building key={i} position={[0, -1, z]} args={[0.4, 2, 0.4]} color="#ccc" />
                    ))}
                    <Text position={[0, 0.5, 0]} fontSize={0.3} color="#666" rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
                        HANSHIN EXPWY
                    </Text>
                </group>

                {/* 肥後橋駅 */}
                <Building position={[2.8, 0.5, -2]} args={[0.8, 1, 3]} color="#ddd" label="肥後橋駅" />

                {/* KOHYO */}
                <Building position={[0.5, 0.4, 1.2]} args={[1.2, 0.8, 1.2]} color="#ddd" label="KOHYO" />

                {/* 日本興亜ビル */}
                <Building position={[0.5, 1, -1.2]} args={[1.2, 2.0, 1.2]} color="#ccc" label="日本興亜ビル" />

                {/* スーパーホテル */}
                <Building position={[-1.5, 0.6, 3.5]} args={[1, 1.2, 1]} color="#ddd" label="スーパーホテル" />


                {/* --- ベース地面 --- */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                    <planeGeometry args={[20, 20]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>

            </group>
        </group >
    );
};

export default LocationMap;
