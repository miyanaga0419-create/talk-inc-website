import React, { useState } from 'react';

// 料金データ
const PRICES = {
    catalog: { base: 60000, unit: 30000 },
    leaflet: { a4: 160000, a3: 260000 },
    poster: { a2: 150000, a1: 200000 },
    newspaper: { small: 40000, large: 150000 },
    logo: { base: 50000 },
};

const CostSimulator = ({ visible, onComplete, onClose }) => {
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({});
    const [slideDir, setSlideDir] = useState('next');

    if (!visible) return null;

    // 計算ロジック
    const calculatePrice = (currentSelections) => {
        const { type, size, pages } = currentSelections;
        if (!type || type === 'other') return null;
        if (type === 'catalog' && typeof pages === 'number') return PRICES.catalog.base + (PRICES.catalog.unit * pages);
        if (type === 'leaflet') return size === 'a3' ? PRICES.leaflet.a3 : PRICES.leaflet.a4;
        if (type === 'poster') return size === 'a1' ? PRICES.poster.a1 : PRICES.poster.a2;
        if (type === 'newspaper') return size === 'large' ? PRICES.newspaper.large : PRICES.newspaper.small;
        if (type === 'logo') return PRICES.logo.base;
        return 0;
    };

    const handleSelect = (key, value) => {
        const newSelections = { ...selections, [key]: value };
        setSelections(newSelections);
        setSlideDir('next');

        if (value === 'other') {
            onComplete({ selections: newSelections, price: null });
            return;
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setSlideDir('back');
        setStep(prev => Math.max(0, prev - 1));
    };

    const animStyle = {
        animation: slideDir === 'next' ? 'slideInRight 0.4s ease' : 'slideInLeft 0.4s ease',
    };

    // --- 各ステップの描画 ---
    const renderStep0 = () => (
        <div style={animStyle} className="sim-screen">
            <h3 className="sim-title">
                さあ、新しいプロジェクトを<br />始めましょう。
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '30px', textAlign: 'center' }}>
                ご検討中のジャンルをお選びください。<br />概算の費用感をシミュレーションできます。
            </p>

            <ul className="sim-options">
                <li onClick={() => handleSelect('type', 'catalog')}>カタログ・パンフレット</li>
                <li onClick={() => handleSelect('type', 'leaflet')}>リーフレット・チラシ</li>
                <li onClick={() => handleSelect('type', 'newspaper')}>新聞広告</li>
                <li onClick={() => handleSelect('type', 'poster')}>ポスター</li>
                <li onClick={() => handleSelect('type', 'logo')}>ロゴ</li>
                <li onClick={() => handleSelect('type', 'other')}>その他</li>
            </ul>
        </div>
    );

    const renderStep1 = () => {
        const type = selections.type;
        if (type === 'logo') return renderResult();

        return (
            <div style={animStyle} className="sim-screen">
                <h3 className="sim-title">サイズは？</h3>
                <ul className="sim-options">
                    {type === 'newspaper' ? (
                        <>
                            <li onClick={() => handleSelect('size', 'small')}>全2段〜3段 (小)</li>
                            <li onClick={() => handleSelect('size', 'large')}>全10段〜 (大)</li>
                        </>
                    ) : (
                        <>
                            <li onClick={() => handleSelect('size', 'a4')}>A4 / B5</li>
                            {type !== 'catalog' && <li onClick={() => handleSelect('size', 'a3')}>A3 / B4</li>}
                            {type === 'poster' && <li onClick={() => handleSelect('size', 'a1')}>A1 / B1</li>}
                            {type === 'poster' && <li onClick={() => handleSelect('size', 'a2')}>A2 / B2</li>}
                        </>
                    )}
                    <li onClick={() => handleSelect('size', 'other')}>その他</li>
                </ul>
            </div>
        );
    };

    const renderStep2 = () => {
        if (selections.type !== 'catalog') return renderResult();
        return (
            <div style={animStyle} className="sim-screen">
                <h3 className="sim-title">ページ数は？</h3>
                <ul className="sim-options">
                    {[4, 8, 12, 16].map(p => <li key={p} onClick={() => handleSelect('pages', p)}>{p}ページ</li>)}
                    <li onClick={() => handleSelect('pages', 'other')}>その他</li>
                </ul>
            </div>
        );
    };

    const renderResult = () => {
        const price = calculatePrice(selections);
        return (
            <div style={animStyle} className="sim-screen result">
                <h3 className="sim-title">概算お見積り</h3>
                <div className="price-display">
                    <span className="amount">{price ? price.toLocaleString() : '---'}</span>
                    <span className="unit">円〜</span>
                </div>
                <p className="note">※デザイン・企画料等の概算です。<br />印刷費・撮影費は別途となります。</p>
                <button className="cta-button" onClick={() => onComplete({ selections, price })}>この内容でお問い合わせへ</button>
            </div>
        );
    };

    return (
        <div className="simulator-container">
            <div className="simulator-card">
                {/* 閉じるボタン: 左上、元のグレーデザイン */}
                <button className="sim-close-btn" onClick={onClose}>×</button>

                {/* 戻るボタン: 右上に配置 */}
                {step > 0 && (
                    <button className="back-btn" onClick={handleBack}>＜ 戻る</button>
                )}

                <div className="screen-wrapper">
                    {step === 0 && renderStep0()}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderResult()}
                </div>
            </div>

            <style>{`
                .simulator-container {
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    display: flex; justify-content: center; align-items: center;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(5px);
                    z-index: 1500;
                }
                .simulator-card {
                    width: 90%; max-width: 400px;
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                    padding: 40px 30px;
                    position: relative;
                    min-height: 400px;
                }
                
                /* 閉じるボタン: 左上、グレー丸、黒文字 */
                .sim-close-btn {
                    position: absolute; 
                    top: 20px; left: 20px; /* 左上 */
                    width: 40px; height: 40px;
                    background: #f0f0f0; 
                    border-radius: 50%;
                    border: none;
                    font-size: 20px; color: #666; /* 文字色: グレー */
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: 0.2s; z-index: 10;
                }
                .sim-close-btn:hover { background: #e0e0e0; color: #333; }
                
                /* 戻るボタン: 右上 */
                .back-btn {
                    position: absolute; top: 25px; right: 20px; /* 右上 */
                    background: none; border: none; font-weight: bold; cursor: pointer; color: #999;
                    z-index: 10;
                }

                .sim-title {
                    margin-top: 10px; margin-bottom: 20px; text-align: center;
                    font-family: sans-serif; font-weight: 700; font-size: 1.4rem;
                }
                
                .sim-options { list-style: none; padding: 0; }
                .sim-options li {
                    padding: 15px; border-bottom: 1px solid #eee;
                    cursor: pointer; transition: 0.2s; position: relative;
                }
                .sim-options li:hover { background: #f9f9f9; padding-left: 20px; }
                .sim-options li::after { content: '>'; position: absolute; right: 10px; color: #ccc; }
                .price-display { text-align: center; margin: 30px 0; color: #1a1a1a; }
                .amount { font-size: 2.5rem; font-weight: 900; margin-right: 5px; }
                .cta-button {
                    width: 100%; padding: 15px; background: #1a1a1a; color: #fff;
                    border: none; border-radius: 50px; font-weight: bold; cursor: pointer;
                    transition: 0.3s; margin-top: 20px;
                }
                .cta-button:hover { transform: scale(1.02); }
                .note { font-size: 0.75rem; color: #999; text-align: center; }
                
                @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideInLeft { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

                /* ★スマホ対応: 文字被り防止の徹底 */
                @media (max-width: 600px) {
                    .simulator-card {
                        padding: 30px 20px;
                    }
                    .sim-title {
                        /* ボタンと被らないよう、余白を大きく確保(70px) */
                        margin-top: 70px;
                        font-size: 1.2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CostSimulator;
