import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const TOTAL_COUNT = 120; // 密度を上げる (80 -> 120)
const TUNNEL_LENGTH = 30;
const PAPER_SIZE = [1.5, 2.1, 0.02];

// ユーザー定義のテクスチャ
const TEXTURE_FILES = [
    '/textures/paper-01.jpg',
    '/textures/paper-02.jpg',
    '/textures/paper-03.jpg',
    '/textures/paper-04.jpg',
    '/textures/paper-05.jpg',
];

const TunnelSystem = () => {
    const { viewport } = useThree();
    const textures = useTexture(TEXTURE_FILES);

    useEffect(() => {
        textures.forEach(tex => { tex.colorSpace = THREE.SRGBColorSpace; });
    }, [textures]);

    const groupedParticles = useMemo(() => {
        const groups = Array.from({ length: TEXTURE_FILES.length }, () => []);
        for (let i = 0; i < TOTAL_COUNT; i++) {
            const textureIndex = Math.floor(Math.random() * TEXTURE_FILES.length);

            // --- 修正ポイント: 配置ロジック ---
            // VISION(z=25)の手前でほぼ見えなくなるように、奥行き範囲を手前に寄せる (-10 ~ 20)
            const z = (Math.random() * TUNNEL_LENGTH) - 10;

            const theta = Math.random() * Math.PI * 2;

            // 修正: 半径の最小値を下げて中央寄りの配置を増やす (Min: 2.0, Max: 9.0)
            const radius = 2.0 + Math.random() * 7.0;

            const x = Math.cos(theta) * radius;
            const y = Math.sin(theta) * radius;

            groups[textureIndex].push({
                position: new THREE.Vector3(x, y, z),
                rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
                rotationSpeed: (Math.random() - 0.5) * 0.01, // 回転も少しゆっくりに
                scale: 0.5 + Math.random() * 0.5,
            });
        }
        return groups;
    }, []);

    const meshRefs = useRef([]);
    meshRefs.current = groupedParticles.map((_, i) => meshRefs.current[i] ?? React.createRef());
    const dummy = new THREE.Object3D();

    useFrame(() => {
        groupedParticles.forEach((group, groupIndex) => {
            const mesh = meshRefs.current[groupIndex]?.current;
            if (!mesh) return;
            group.forEach((particle, i) => {
                particle.rotation.x += particle.rotationSpeed;
                particle.rotation.y += particle.rotationSpeed;
                dummy.position.copy(particle.position);
                dummy.rotation.copy(particle.rotation);
                dummy.scale.set(particle.scale, particle.scale, particle.scale);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            });
            mesh.instanceMatrix.needsUpdate = true;
        });
    });

    return (
        <>
            {groupedParticles.map((group, index) => (
                <instancedMesh
                    key={TEXTURE_FILES[index]}
                    ref={meshRefs.current[index]}
                    args={[null, null, group.length]}
                >
                    <boxGeometry args={PAPER_SIZE} />
                    <meshStandardMaterial map={textures[index]} transparent opacity={0.9} />
                </instancedMesh>
            ))}
        </>
    );
};

export default TunnelSystem;
