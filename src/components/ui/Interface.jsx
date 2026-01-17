import React, { useState, useEffect, useRef } from 'react';
import CostSimulator from './CostSimulator';
import AboutPanel from './AboutPanel';

const Interface = ({ atBottom, showSim, aboutOpen, setAboutOpen }) => {
    const [forceContact, setForceContact] = useState(false);
    const [simDismissed, setSimDismissed] = useState(false);
    const [simData, setSimData] = useState(null);
    const scrollUpAcc = useRef(0);
    const [simActive, setSimActive] = useState(false);

    // --- シミュレーター制御 ---
    useEffect(() => {
        if (showSim && !simDismissed && !simActive) {
            setSimActive(true);
        }
        if (!showSim) {
            setSimDismissed(false);
        }
    }, [showSim, simDismissed, simActive]);

    const handleCloseSim = () => {
        setSimActive(false);
        setSimDismissed(true);
    };

    const handleSimComplete = (data) => {
        if (data) setSimData(data);
        setSimActive(false);
        setForceContact(true);
    };

    // --- コンタクトパネル制御 ---
    const isContactVisible = forceContact;

    const handleCloseContact = () => {
        setForceContact(false);
        window.dispatchEvent(new CustomEvent('scroll-back-contact'));
        scrollUpAcc.current = 0;
    };

    const handlePanelWheel = (e) => {
        if (e.currentTarget.scrollTop <= 5 && e.deltaY < 0) {
            scrollUpAcc.current += Math.abs(e.deltaY);
            if (scrollUpAcc.current > 150) handleCloseContact();
        } else if (e.deltaY > 0) {
            scrollUpAcc.current = 0;
        }
    };

    const handleLogoClick = () => {
        setForceContact(false);
        window.dispatchEvent(new CustomEvent('reset-scroll'));
    };

    const getLabel = (key, value) => {
        if (value === 'other') return 'その他';
        if (key === 'type') return { catalog: 'カタログ', leaflet: 'チラシ', poster: 'ポスター', newspaper: '新聞', logo: 'ロゴ' }[value] || value;
        if (key === 'size') return { a4: 'A4/B5', a3: 'A3/B4', a2: 'A2/B2', a1: 'A1/B1', small: '小', large: '大' }[value] || value;
        if (key === 'pages') return `${value}P`;
        return value;
    };

    const generateMessage = () => {
        if (!simData) return '';
        const { selections, price } = simData;
        let text = `【制作予定】\n仕様：${getLabel('type', selections.type)}\n`;
        if (selections.size) text += `サイズ：${getLabel('size', selections.size)}\n`;
        if (selections.pages) text += `ページ数：${getLabel('pages', selections.pages)}\n`;
        if (price) text += `概算：${price.toLocaleString()}円〜\n`;
        else if (selections.type === 'other') text += `概算：要相談\n`;
        text += `\n------------------------\n\n`;
        return text;
    };

    return (
        <>
            <div className="ui-layer" style={{ zIndex: 20, pointerEvents: 'none' }}>
                <div
                    className="logo"
                    onClick={handleLogoClick}
                    style={{ pointerEvents: 'auto', fontWeight: '300', cursor: 'pointer' }}
                >
                    TALK
                </div>
            </div>

            <AboutPanel isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

            {/* Scroll Indicator */}
            <div
                className="scroll-indicator"
                style={{
                    opacity: (isContactVisible || simActive || atBottom) ? 0 : 1,
                    pointerEvents: 'none',
                    transition: 'opacity 0.5s'
                }}
            >
                <span>SCROLL</span>
                <div className="line"></div>
            </div>

            <CostSimulator
                visible={simActive && !isContactVisible}
                onComplete={handleSimComplete}
                onClose={handleCloseSim}
            />

            {/* --- CONTACT PANEL --- */}
            <div
                className="contact-panel"
                onWheel={handlePanelWheel}
                style={{
                    transform: isContactVisible ? 'translateY(0%)' : 'translateY(100%)',
                    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
            >
                {/* 閉じるボタン */}
                <button
                    className="contact-close-btn"
                    onClick={handleCloseContact}
                    style={{ opacity: isContactVisible ? 1 : 0, transition: 'opacity 0.5s 0.3s' }}
                >
                    ×
                </button>

                <div className="contact-content">
                    <h2 style={{ fontSize: '2rem', margin: '0 0 30px 0', fontFamily: 'Montserrat, sans-serif', fontWeight: '300', letterSpacing: '0.1em' }}>CONTACT</h2>

                    {simData && (
                        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '30px', textAlign: 'left', fontSize: '0.9rem', border: '1px solid #ddd' }}>
                            <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>制作予定項目</h4>
                            <p style={{ margin: '5px 0' }}><strong>仕様：</strong> {getLabel('type', simData.selections.type)}</p>
                            <p style={{ margin: '10px 0', fontWeight: 'bold' }}>概算：{simData.price ? simData.price.toLocaleString() : '---'}円〜</p>
                        </div>
                    )}

                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>貴社名</label>
                                <input type="text" placeholder="株式会社トーク" />
                            </div>
                            <div className="form-group">
                                <label>お名前 <span className="required">*</span></label>
                                <input type="text" placeholder="山田 太郎" required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>メールアドレス <span className="required">*</span></label>
                                <input type="email" placeholder="example@talk-inc.com" required />
                            </div>
                            <div className="form-group">
                                <label>電話番号</label>
                                <input type="tel" placeholder="078-000-0000" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>お問い合わせ内容 <span className="required">*</span></label>
                            <textarea
                                key={simData ? 'sim-loaded' : 'default'}
                                rows="8"
                                placeholder="ご用件をご記入ください"
                                defaultValue={generateMessage()}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">送信する</button>
                    </form>

                    <p style={{ marginTop: '30px', fontSize: '0.8rem', opacity: 0.6 }}>
                        株式会社トーク<br />〒550-0002 大阪市西区江戸堀1丁目19番10号<br />三共肥後橋ビル5F<br />TEL.06-6447-7606
                    </p>
                </div>
            </div>

            <style>{`
                /* --- Scroll Indicator Styles (修正版) --- */
                .scroll-indicator {
                    position: fixed;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #1a1a1a;
                    font-family: 'Montserrat', sans-serif;
                }
                .scroll-indicator span {
                    font-size: 0.75rem;
                    letter-spacing: 0.2em;
                    margin-bottom: 12px;
                    /* letter-spacingによる右側の余白を打ち消して視覚的にセンターにする */
                    margin-right: -0.2em; 
                    font-weight: 300;
                    opacity: 0.8;
                }
                .scroll-indicator .line {
                    width: 1px;
                    height: 60px; /* 線を少し長く */
                    background: rgba(0,0,0,0.1); /* 背景のガイドライン */
                    position: relative;
                    overflow: hidden;
                }
                .scroll-indicator .line::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #1a1a1a;
                    /* 上から下へ流れるアニメーション */
                    animation: scroll-down 2.0s cubic-bezier(0.77, 0, 0.175, 1) infinite;
                }
                @keyframes scroll-down {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }

                /* --- Contact Panel Styles --- */
                .contact-panel {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh !important;
                    background: rgba(255,255,255,0.98) !important;
                    backdrop-filter: blur(10px);
                    padding: 60px 20px;
                    padding-top: 120px;
                    box-sizing: border-box;
                    z-index: 60;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    text-align: center;
                    overflow-y: auto;
                }
                .contact-close-btn {
                    position: absolute;
                    top: 20px; 
                    left: 20px; 
                    width: 40px; 
                    height: 40px;
                    background: #f0f0f0; 
                    border-radius: 50%;
                    border: none;
                    font-size: 20px; 
                    color: #666;
                    cursor: pointer;
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    z-index: 100;
                    transition: 0.2s;
                }
                .contact-close-btn:hover { background: #e0e0e0; color: #333; }
                
                .contact-content { width: 100%; max-width: 800px; margin: 0 auto; }
                .contact-form { width: 100%; text-align: left; }
                .form-row { display: flex; gap: 20px; margin-bottom: 20px; }
                @media (max-width: 600px) { .form-row { flex-direction: column; gap: 0; margin-bottom: 0; } }
                .form-group { flex: 1; margin-bottom: 20px; }
                .form-group label { display: block; font-size: 0.9rem; font-weight: bold; margin-bottom: 8px; color: #333; }
                .required { color: #ff4d4f; margin-left: 4px; }
                .form-group input, .form-group textarea {
                    width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; background: #f9f9f9; transition: 0.3s; box-sizing: border-box;
                }
                .form-group input:focus, .form-group textarea:focus { border-color: #1a1a1a; background: #fff; outline: none; }
                .submit-btn {
                    display: block; width: 100%; max-width: 300px; margin: 40px auto 0; padding: 15px; background: #1a1a1a; color: white; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s, background 0.2s;
                }
                .submit-btn:hover { transform: scale(1.02); background: #333; }
            `}</style>
        </>
    );
};

export default Interface;
