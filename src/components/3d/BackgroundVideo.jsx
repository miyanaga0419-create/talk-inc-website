import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';

const BackgroundVideo = ({ url, visible }) => {
    const { camera, size } = useThree(); // Use camera and size (canvas size)

    // Calculate aspect ratio of the screen/canvas
    const viewportAspect = size.width / size.height;

    // Fixed distance from camera
    const distance = 10;

    // Calculate visible height and width at that distance
    // 2 * distance * tan(FOV/2)
    // Degrees to radians: * Math.PI / 180
    const fovRad = (camera.fov * Math.PI) / 180;
    const heightAtDistance = 2 * Math.tan(fovRad / 2) * distance;
    const widthAtDistance = heightAtDistance * viewportAspect;

    const texture = useVideoTexture(url, {
        unsuspend: 'canplay',
        muted: true,
        loop: true,
        start: true,
        crossOrigin: "Anonymous"
    });

    const meshRef = useRef();

    // Calculate scaling to "cover" the computed plane dimensions
    const videoAspect = texture.image ? texture.image.videoWidth / texture.image.videoHeight : 16 / 9;

    // Base scale factors to match the frustum size
    let scaleX, scaleY;

    // Logic: Compare screen aspect vs video aspect
    if (viewportAspect > videoAspect) {
        // Screen is wider than video -> Match width, scale up height
        scaleX = widthAtDistance;
        scaleY = widthAtDistance / videoAspect;
    } else {
        // Screen is taller than video -> Match height, scale up width
        scaleY = heightAtDistance;
        scaleX = heightAtDistance * videoAspect;
    }

    // "Cinematic" multiplier: 1.2x to ensure bleed and immersive feel
    scaleX *= 1.2;
    scaleY *= 1.2;

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Smooth opacity transition
            meshRef.current.material.opacity = THREE.MathUtils.lerp(
                meshRef.current.material.opacity,
                visible ? 1.0 : 0,
                delta * 2
            );

            // Follow camera, maintaining fixed distance
            meshRef.current.position.z = state.camera.position.z - distance;
            meshRef.current.position.x = state.camera.position.x;
            meshRef.current.position.y = state.camera.position.y;
        }
    });

    return (
        <mesh ref={meshRef} scale={[scaleX, scaleY, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={0}
                depthTest={false}
                toneMapped={false}
            />
        </mesh>
    );
};

export default BackgroundVideo;
