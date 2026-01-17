import React from 'react';
import { useTexture } from '@react-three/drei';

const ImagePlane = ({ url, position, scale = [1, 1, 1], rotation = [0, 0, 0] }) => {
    const texture = useTexture(url);
    return (
        <mesh position={position} scale={scale} rotation={rotation}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} transparent opacity={0.9} toneMapped={false} />
        </mesh>
    );
};

export default ImagePlane;
