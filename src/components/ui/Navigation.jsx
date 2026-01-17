import React, { useState } from 'react';

// 親コンポーネントから onAboutClick を受け取る
const Navigation = ({ onAboutClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    // スムーズスクロール関数
    const scrollToSection = (id) => {
        setIsOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // ABOUTクリック時の処理
    const handleAbout = () => {
        setIsOpen(false);
        if (onAboutClick) {
            onAboutClick();
        }
    };

    // PCメニューのスタイル
    const itemStyle = {
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#333',
        textDecoration: 'none',
        letterSpacing: '0.05em',
        padding: '6px 10px',
        fontFamily: '"Noto Sans JP", sans-serif',
        transition: 'opacity 0.2s',
    };

    // スマホメニューのスタイル
    const mobileItemStyle = {
        ...itemStyle,
        color: '#fff',
        fontSize: '20px',
        padding: '15px',
        marginBottom: '10px',
    };

    // ★ハンバーガーラインの共通設定 (細く、角を丸く)
    const lineStyle = {
        position: 'absolute',
        left: '50%',
        top: '50%', // 全て中心に置く
        width: '24px', // ★幅を小さく (40px -> 24px)
        height: '1.5px', // ★線を細く (3px -> 1.5px)
        background: isOpen ? '#fff' : '#333',
        borderRadius: '1px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // なめらかなアニメーション
        transformOrigin: 'center', // 回転軸を中心にする
        marginLeft: '-12px', // widthの半分だけ左にずらしてセンタリング
        marginTop: '-0.75px', // heightの半分だけ上にずらしてセンタリング
    };

    return (
        <>
            <header style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '100%',
                padding: '20px 30px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                zIndex: 1000,
                pointerEvents: 'none'
            }}>

                {/* PC用メニュー */}
                <nav className="desktop-menu" style={{
                    pointerEvents: 'auto',
                    display: 'flex',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.9)',
                    padding: '8px 15px',
                    borderRadius: '30px',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                    <div onClick={handleAbout} style={itemStyle} onMouseOver={e => e.target.style.opacity = 0.6} onMouseOut={e => e.target.style.opacity = 1}>ABOUT</div>
                    <a href="https://www.talk109.co.jp/" target="_blank" rel="noreferrer" style={itemStyle} onMouseOver={e => e.target.style.opacity = 0.6} onMouseOut={e => e.target.style.opacity = 1}>WORKS</a>
                    <div onClick={() => scrollToSection('contact')} style={itemStyle} onMouseOver={e => e.target.style.opacity = 0.6} onMouseOut={e => e.target.style.opacity = 1}>CONTACT</div>
                </nav>

                {/* スマホ用ハンバーガーボタン */}
                <button
                    className="mobile-burger"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        pointerEvents: 'auto',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        width: '50px',  // タップ判定は大きく
                        height: '50px',
                        position: 'relative',
                        zIndex: 1001,
                        display: 'none', // CSSで制御
                        padding: 0,
                    }}
                >
                    {/* 上の線: 閉じる時は45度回転、通常時は上に8pxずらす */}
                    <span style={{
                        ...lineStyle,
                        transform: isOpen ? 'rotate(45deg)' : 'translateY(-7px)'
                    }} />

                    {/* 真ん中の線: 閉じる時は透明、通常時は中心 */}
                    <span style={{
                        ...lineStyle,
                        opacity: isOpen ? 0 : 1
                    }} />

                    {/* 下の線: 閉じる時は-45度回転、通常時は下に8pxずらす */}
                    <span style={{
                        ...lineStyle,
                        transform: isOpen ? 'rotate(-45deg)' : 'translateY(7px)'
                    }} />
                </button>
            </header>

            {/* スマホ用 フルスクリーンメニュー */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: '#1a1a1a',
                zIndex: 999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'opacity 0.4s ease, visibility 0.4s',
                opacity: isOpen ? 1 : 0,
                visibility: isOpen ? 'visible' : 'hidden',
                pointerEvents: isOpen ? 'auto' : 'none',
            }}>
                <div onClick={handleAbout} style={mobileItemStyle}>ABOUT</div>
                <a href="https://www.talk109.co.jp/" target="_blank" rel="noreferrer" style={mobileItemStyle}>WORKS</a>
                <div onClick={() => scrollToSection('contact')} style={mobileItemStyle}>CONTACT</div>
            </div>

            {/* レスポンシブ切り替え用 CSS */}
            <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-burger { display: block !important; }
        }
      `}</style>
        </>
    );
};

export default Navigation;
