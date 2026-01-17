import React, { useState } from 'react';
import { useVideoTexture } from '@react-three/drei';

const VideoPlane = ({ url, position, scale = [1, 1, 1], rotation = [0, 0, 0] }) => {
    const texture = useVideoTexture(url, {
        unsuspend: 'canplay',
        muted: true,
        loop: true,
        start: true,
        crossOrigin: "Anonymous"
    });

    return (
        <mesh position={position} scale={scale} rotation={rotation}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    );
};

export default VideoPlane;
