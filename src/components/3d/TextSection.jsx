import React, { useState, useRef } from 'react';
import { Text, RoundedBox, useScroll, useVideoTexture } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import WebBrowser from './WebBrowser'; // Import

const Section = ({ z, children }) => {
    return <group position={[0, 0, z]}>{children}</group>;
};

// --- 動画背景コンポーネント (全画面対応版) ---
const MovieBackground = () => {
    const { viewport } = useThree();

    const texture = useVideoTexture("/movie.mp4", {
        // unsuspend行を削除しました
        muted: true,
        loop: true,
        start: true,
        playsInline: true,
        crossOrigin: "Anonymous"
    });

    // 画面いっぱいに表示するための計算
    // Z=-5 に配置する場合、カメラ(Z=5)からの距離は10
    // viewport.width/height は Z=0 (距離5) でのサイズなので、2倍すれば Z=-5 でピッタリになる
    const scaleFactor = 2.0;

    // さらにアスペクト比を維持して「隙間なく埋める(cover)」ための補正
    // 動画のアスペクト比(16:9 = 1.77) と 画面のアスペクト比を比較
    const screenAspect = viewport.width / viewport.height;
    const videoAspect = 16 / 9;

    let finalWidth, finalHeight;

    if (screenAspect > videoAspect) {
        // 画面の方が横長 → 横幅に合わせて縦をはみ出させる
        finalWidth = viewport.width * scaleFactor;
        finalHeight = finalWidth / videoAspect;
    } else {
        // 画面の方が縦長 → 縦幅に合わせて横をはみ出させる
        finalHeight = viewport.height * scaleFactor;
        finalWidth = finalHeight * videoAspect;
    }

    return (
        <mesh position={[0, 0, -5]} scale={[finalWidth, finalHeight, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={texture} toneMapped={false} fog={false} />
        </mesh>
    );
};

const NumberCounter = ({ target = 3500 }) => {
    const [count, setCount] = useState(0);
    const hasStarted = useRef(false);
    const scroll = useScroll();
    const { viewport } = useThree();
    const isMobile = viewport.width < 5;
    const textRef = useRef();
    const scale = useRef(1);
    const velocity = useRef(0);
    const isBouncing = useRef(false);

    useFrame(() => {
        if (!hasStarted.current && scroll.offset > 0.38) hasStarted.current = true;
        if (hasStarted.current && count < target) {
            const diff = target - count;
            const speed = Math.max(Math.ceil(diff * 0.01), 3);
            let next = count + speed;
            if (next >= target) {
                next = target;
                velocity.current = 0.3;
                isBouncing.current = true;
            }
            setCount(next);
        }
        if (isBouncing.current && textRef.current) {
            const stiffness = 0.15;
            const damping = 0.8;
            const displacement = scale.current - 1;
            const force = -stiffness * displacement;
            velocity.current += force;
            velocity.current *= damping;
            scale.current += velocity.current;
            textRef.current.scale.setScalar(scale.current);
            if (Math.abs(velocity.current) < 0.001 && Math.abs(displacement) < 0.001) {
                isBouncing.current = false;
                scale.current = 1;
                textRef.current.scale.setScalar(1);
            }
        }
    });

    return (
        <group position={[0, -0.5, 0]}>
            <Text font="https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Regular.woff" fontSize={isMobile ? 0.25 : 0.3} color="#666" anchorX="center" anchorY="middle" position={[0, 0.5, 0]} letterSpacing={0.1}>TOTAL PROJECTS</Text>
            <Text ref={textRef} font="https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Bold.woff" fontSize={isMobile ? 1.2 : 1.5} color="#1a1a1a" anchorX="center" anchorY="middle" position={[0, -0.2, 0]}>{count.toLocaleString()}+</Text>
        </group>
    );
};

const ResponsiveText = ({ children, type = "body", align = "center", ...props }) => {
    const { viewport } = useThree();
    const isMobile = viewport.width < 5;
    const styles = {
        title: { size: isMobile ? 0.57 : 0.78, weight: 900, height: 1.2, color: "#1a1a1a" },
        subtitle: { size: isMobile ? 0.35 : 0.48, weight: 300, height: 1.2, color: "#444" },
        body: { size: isMobile ? 0.22 : 0.3, weight: 400, height: 1.62, color: "#333" }
    };
    const currentStyle = styles[type] || styles.body;
    const maxWidth = isMobile ? viewport.width * 0.9 : viewport.width * 0.6;

    return (
        <Text
            font="https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Regular.woff"
            fontSize={currentStyle.size}
            maxWidth={maxWidth}
            lineHeight={currentStyle.height}
            textAlign={align}
            anchorX={align}
            anchorY="middle"
            color={currentStyle.color}
            // props受け渡し
            {...props}
        >
            {children}
        </Text>
    );
};

const Button3D = ({ text, link, position }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <group position={position || [0, -0.5, 0]} onClick={() => window.open(link, '_blank')} onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }} onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }} scale={hovered ? 1.05 : 1}>
            <RoundedBox args={[3.5, 0.8, 0.1]} radius={0.4} smoothness={4}><meshBasicMaterial color={hovered ? "#333" : "#1a1a1a"} /></RoundedBox>
            <ResponsiveText type="body" position={[0, 0, 0.11]} color="white" scale={1}>{text}</ResponsiveText>
        </group>
    );
};

// --- メインコンポーネント ---
const TextSection = () => {
    const { viewport } = useThree();
    const isMobile = viewport.width < 5;

    return (
        <>
            <Section z={0}>
                <ResponsiveText type="title" position={[0, isMobile ? 0.8 : 1.2, 0]} scale={2.5}>TALK</ResponsiveText>
                <ResponsiveText type="body" position={[0, isMobile ? -0.3 : -0.8, 0]}>SINCE 1996</ResponsiveText>
                <ResponsiveText type="subtitle" position={[0, isMobile ? -1.3 : -2.0, 0]}>想いをカタチにする、クリエイティブ。</ResponsiveText>
            </Section>

            <Section z={25}>
                <group position={[0, 0, 0]}>
                    <ResponsiveText type="title" align="center" position={[0, isMobile ? 1.5 : 1.5, 0]} scale={2.5}>VISION</ResponsiveText>
                    <ResponsiveText type="subtitle" align="center" position={[0, isMobile ? 0.0 : -0.5, 0]}>対話から生まれる、確かな価値。</ResponsiveText>
                    <ResponsiveText type="body" align="center" position={[0, isMobile ? -1.5 : -2.5, 0]}>
                        30年の経験と実績。{"\n"}企画•グラフィックからWeb•動画まで、{"\n"}あらゆる課題を総合的にプロデュースします。
                    </ResponsiveText>
                </group>
            </Section>

            <Section z={50}>
                <ResponsiveText type="title" position={[0, isMobile ? 3.8 : 4.5, 0]} scale={2.5}>WORKS</ResponsiveText>
                <NumberCounter target={3500} />
                <Button3D text="TALKの実績はこちら" link="https://www.talk109.co.jp/" position={[0, isMobile ? -2.5 : -2.5, 0]} />
            </Section>

            <Section z={75}>
                <ResponsiveText type="title" position={[0, isMobile ? 3.5 : 4.0, 0]} scale={2.5}>WEB</ResponsiveText>
                <ResponsiveText type="subtitle" position={[0, isMobile ? 2.1 : 2.3, 0]}>ブランド価値を高める、Web体験。</ResponsiveText>

                <WebBrowser
                    position={[0, isMobile ? -1.5 : -3.0, 0]}
                    scale={isMobile ? 1.5 : 2.4}
                    forWebSection={true}
                />
            </Section>

            {/* --- MOVIE SECTION --- */}
            <Section z={100}>
                {/* 1. 背景動画: 画面サイズに合わせて拡大・全画面表示 */}
                <MovieBackground />

                {/* 2. 文字: 手前(z=2)に配置 + 白文字 + カリング無効化 */}
                <ResponsiveText
                    type="title"
                    position={[0, isMobile ? 1.5 : 1.5, 2]}
                    scale={2.5}
                    color="white"
                    frustumCulled={false}
                >
                    MOVIE
                </ResponsiveText>

                <ResponsiveText
                    type="subtitle"
                    position={[0, isMobile ? 0.0 : -0.5, 2]}
                    color="white"
                    frustumCulled={false}
                >
                    視点を変える。心を動かす。
                </ResponsiveText>

                <ResponsiveText
                    type="body"
                    position={[0, isMobile ? -1.5 : -2.0, 2]}
                    color="white"
                    frustumCulled={false}
                >
                    ドローン空撮から企業PVまで。{"\n"}企画•撮影•編集をワンストップで。
                </ResponsiveText>
            </Section>
        </>
    );
};

export default TextSection;
