import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, useScroll } from '@react-three/drei';

const TEXTURES_ROW1 = [
    '/textures/paper-01.jpg',
    '/textures/paper-02.jpg',
    '/textures/paper-03.jpg',
    '/textures/paper-04.jpg',
    '/textures/paper-05.jpg',
    '/textures/paper-06.jpg',
    '/textures/paper-07.jpg'
];

const TEXTURES_ROW2 = [
    '/textures/paper-04.jpg',
    '/textures/paper-05.jpg',
    '/textures/paper-06.jpg',
    '/textures/paper-07.jpg',
    '/textures/paper-08.jpg',
    '/textures/paper-09.jpg',
    '/textures/paper-10.jpg'
];

const A4_RATIO = [1.5, 2.12];

const Row = ({ y, delay, textures, scroll, direction = 1 }) => {
    const groupRef = useRef();
    const { viewport } = useThree();
    const gap = 1.8;
    const totalWidth = (textures.length - 1) * gap;

    useFrame((state) => {
        const offset = scroll.offset;

        // Delay logic: Shift the "effective" offset for this row
        const startT = 0.38 + delay;
        const endT = 0.55 + delay;

        let targetState = 0; // 0: Right (Hidden), 1: Center (Visible), 2: Left (Hidden)

        if (offset < startT) targetState = 0;
        else if (offset >= startT && offset < endT) targetState = 1;
        else targetState = 2;

        // Target Position X
        let targetX = 0;
        if (targetState === 0) targetX = viewport.width + 10;
        else if (targetState === 1) targetX = 0;
        else targetX = -viewport.width - 10;

        // Opacity Target
        let targetOpacity = 0;
        if (targetState === 1) targetOpacity = 0.98;
        else targetOpacity = 0;

        if (groupRef.current) {
            // Slide ease
            groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.08;

            // Individual animation
            groupRef.current.children.forEach((child, i) => {
                child.position.y = Math.sin(state.clock.elapsedTime * 1.5 + i + (y * 10)) * 0.05;
                child.rotation.z = Math.sin(state.clock.elapsedTime * 1 + i + (y * 10)) * 0.02;

                if (child.material) {
                    child.material.opacity += (targetOpacity - child.material.opacity) * 0.05;
                }
            });
        }
    });

    return (
        <group ref={groupRef} position={[0, y, 48]}>
            {textures.map((tex, i) => {
                const x = (i * gap) - (totalWidth / 2);
                return (
                    <mesh key={i} position={[x, 0, 0]}>
                        <planeGeometry args={A4_RATIO} />
                        <meshBasicMaterial map={tex} transparent opacity={0} />
                    </mesh>
                );
            })}
        </group>
    );
};

const WorksShowcase = () => {
    const scroll = useScroll();
    const textures1 = useTexture(TEXTURES_ROW1);
    const textures2 = useTexture(TEXTURES_ROW2);

    return (
        <>
            {/* 上段: 標準タイミング - 画像セット1 */}
            <Row y={2.2} delay={0} scroll={scroll} textures={textures1} />

            {/* 下段: 少し遅れて登場 - 画像セット2 (paper-06 ~ paper-12) */}
            <Row y={-0.1} delay={0.05} scroll={scroll} textures={textures2} />
        </>
    );
};

export default WorksShowcase;
