import React from 'react';
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing';

const Effects = () => {
    return (
        <EffectComposer>
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
    );
};

export default Effects;
