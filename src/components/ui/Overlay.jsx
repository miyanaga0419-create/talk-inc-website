import React from 'react';
import { Scroll } from '@react-three/drei';

export const Overlay = () => {
    return (
        <Scroll html>

            {/* スクロール量に合わせた配置 (100vh = 1ページ分) 
         3Dシーン全体のページ数(pages)に合わせて調整してください。
         ここでは全体が9ページあると仮定して配置します。
      */}

            {/* --- ABOUT (Top) --- */}
            <div id="about" style={{ position: 'absolute', top: '0vh', left: 0, width: '100%', height: '10px' }} />

            {/* --- CONTACT (Bottom) --- */}
            {/* ページの一番下あたり (例: 850vh) */}
            <div id="contact" style={{ position: 'absolute', top: '850vh', left: 0, width: '100%', height: '10px' }} />

            {/* ※必要であれば他のセクションのアンカーもここに追加できます */}

        </Scroll>
    );
};
