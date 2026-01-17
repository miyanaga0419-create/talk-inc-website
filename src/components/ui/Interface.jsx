import React, { useState, useEffect, useRef } from 'react';
import CostSimulator from './CostSimulator';
import AboutPanel from './AboutPanel';

const Interface = ({ atBottom, showSim, aboutOpen, setAboutOpen }) => {
    // シミュレーターからコンタクトへの強制遷移フラグ
    const [forceContact, setForceContact] = useState(false);

    // ★修正1: 表示状態を「維持」するためのフラグ (Sticky State)
    const [simActive, setSimActive] = useState(false);

    // シミュレーターを「手動で」閉じたかどうかのフラグ
    const [simDismissed, setSimDismissed] = useState(false);

    const [simData, setSimData] = useState(null);
    const scrollUpAcc = useRef(0);

    // ★修正2: シミュレーターの表示/非表示を制御するロジック
    useEffect(() => {
        // 条件: トリガー(showSim)がON ＆ 手動で閉じてない ＆ まだアクティブじゃない
        // → シミュレーターを「アクティブ(表示維持)」にする
        if (showSim && !simDismissed && !simActive) {
            setSimActive(true);
        }

        // 条件: トリガーエリアから外れた(showSimがOFFになった)
        // → 「閉じた履歴」をリセットする。
        // これにより、一度上に戻ってからまた降りてきた時に、再度開くようになります。
        if (!showSim) {
            setSimDismissed(false);
        }
    }, [showSim, simDismissed, simActive]);

    // ★修正3: 手動で閉じた時の処理
    const handleCloseSim = () => {
        setSimActive(false);     // 画面から消す
        setSimDismissed(true);   // 「今は閉じた」と記録する（ゾーンから出るまで有効）
    };

    // コンタクトへ飛ぶアクション
    const handleSimComplete = (data) => {
        if (data) setSimData(data);
        setSimActive(false);   // シミュレーターを閉じる
        setForceContact(true); // コンタクトを開く
    };

    // 強制フラグ(forceContact)がある時だけ開く（スクロール連動なし）
    const isContactVisible = forceContact;

    // Contactを閉じるアクション
    const handleCloseContact = () => {
        setForceContact(false);
        window.dispatchEvent(new CustomEvent('scroll-back-contact'));
        scrollUpAcc.current = 0;
    };

    // パネル内でのホイール検知
    const handlePanelWheel = (e) => {
        if (e.currentTarget.scrollTop <= 5 && e.deltaY < 0) {
            scrollUpAcc.current += Math.abs(e.deltaY);
            if (scrollUpAcc.current > 150) {
                handleCloseContact();
            }
        } else if (e.deltaY > 0) {
            scrollUpAcc.current = 0;
        }
    };

    // ロゴクリックでトップへ戻る
    const handleLogoClick = () => {
        setForceContact(false);
        window.dispatchEvent(new CustomEvent('reset-scroll'));
    };

    // データ整形用ヘルパー
    const getLabel = (key, value) => {
        if (value === 'other') return 'その他';
        if (key === 'type') {
            const map = {
                catalog: 'カタログ・パンフレット',
                leaflet: 'リーフレット・チラシ',
                poster: 'ポスター',
                newspaper: '新聞広告',
                logo: 'ロゴ制作'
            };
            return map[value] || value;
        }
        if (key === 'size') {
            const map = {
                a4: 'A4 / B5', a3: 'A3 / B4', a2: 'A2 / B2', a1: 'A1 / B1',
                small: '全2段〜3段 (小)', large: '全10段〜 (大)'
            };
            return map[value] || value;
        }
        if (key === 'pages') return `${value}ページ`;
        return value;
    };

    // テキストエリアへの初期値生成
    const generateMessage = () => {
        if (!simData) return '';
        const { selections, price } = simData;
        const { type, size, pages } = selections;

        let text = `【制作予定】\n`;
        text += `仕様：${getLabel('type', type)}\n`;
        if (size) text += `サイズ：${getLabel('size', size)}\n`;
        if (pages) text += `ページ数：${getLabel('pages', pages)}\n`;
        if (price) text += `概算お見積り合計：${price.toLocaleString()}円〜\n`;
        else if (type === 'other') text += `概算お見積り：要相談\n`;

        text += `※デザイン・企画料等の概算です。印刷費・撮影費は別途となります。\n\n------------------------\n\n`;
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

            {/* About Slide-in Panel */}
            <AboutPanel isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

            {/* Scroll Indicator */}
            {/* コンタクトが開いているか、シミュレーターが開いている(simActive)時は非表示 */}
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

            {/* Simulator Overlay */}
            {/* ★修正: showSimではなく、制御された simActive を使用 */}
            {/* これによりスクロールがズレても閉じなくなります */}
            <CostSimulator
                visible={simActive && !isContactVisible}
                onComplete={handleSimComplete}
                onClose={handleCloseSim}
            />

            <div
                className="contact-panel"
                onWheel={handlePanelWheel}
                style={{
                    transform: isContactVisible ? 'translateY(0%)' : 'translateY(100%)',
                    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
            >
                <div className="contact-content">
                    <h2 style={{ fontSize: '2rem', margin: '0 0 30px 0', fontFamily: 'Montserrat, sans-serif', fontWeight: '300', letterSpacing: '0.1em' }}>CONTACT</h2>

                    {/* シミュレーション結果表示エリア */}
                    {simData && (
                        <div style={{
                            background: '#f5f5f5',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '30px',
                            textAlign: 'left',
                            fontSize: '0.9rem',
                            border: '1px solid #ddd'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>制作予定項目</h4>
                            <p style={{ margin: '5px 0' }}><strong>仕様：</strong> {getLabel('type', simData.selections.type)}</p>
                            {simData.selections.size && <p style={{ margin: '5px 0' }}><strong>サイズ：</strong> {getLabel('size', simData.selections.size)}</p>}
                            {simData.selections.pages && <p style={{ margin: '5px 0' }}><strong>ページ数：</strong> {getLabel('pages', simData.selections.pages)}</p>}
                            <p style={{ margin: '10px 0', fontWeight: 'bold' }}>
                                概算お見積り合計：{simData.price ? simData.price.toLocaleString() : '---'}円〜
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                ※デザイン・企画料等の概算です。<br />印刷費・撮影費は別途となります。
                            </p>
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

                        <button type="submit" className="submit-btn">
                            送信する
                        </button>
                    </form>

                    <p style={{ marginTop: '30px', fontSize: '0.8rem', opacity: 0.6 }}>
                        株式会社トーク<br />
                        〒550-0002<br />
                        大阪市西区江戸堀1丁目19番10号<br />
                        三共肥後橋ビル5F<br />
                        TEL.06-6447-7606
                    </p>
                </div>
            </div>

            <style>{`
                    .contact-panel {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 85vh !important;
                        background: rgba(255,255,255,0.98) !important;
                        backdrop-filter: blur(10px);
                        border-top: 1px solid #ddd;
                        padding: 60px 20px;
                        box-sizing: border-box;
                        z-index: 60;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: center;
                        text-align: center;
                        overflow-y: auto;
                    }
                    .contact-content {
                        width: 100%;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .contact-form {
                        width: 100%;
                        text-align: left;
                    }
                    .form-row {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    @media (max-width: 600px) {
                        .form-row { flex-direction: column; gap: 0; margin-bottom: 0; }
                    }
                    .form-group {
                        flex: 1;
                        margin-bottom: 20px;
                    }
                    .form-group label {
                        display: block;
                        font-size: 0.9rem;
                        font-weight: bold;
                        margin-bottom: 8px;
                        color: #333;
                    }
                    .required {
                        color: #ff4d4f;
                        margin-left: 4px;
                    }
                    .form-group input, .form-group textarea {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: 1rem;
                        background: #f9f9f9;
                        transition: 0.3s;
                        box-sizing: border-box;
                    }
                    .form-group input:focus, .form-group textarea:focus {
                        border-color: #1a1a1a;
                        background: #fff;
                        outline: none;
                    }
                    .submit-btn {
                        display: block;
                        width: 100%;
                        max-width: 300px;
                        margin: 40px auto 0;
                        padding: 15px;
                        background: #1a1a1a;
                        color: white;
                        border: none;
                        border-radius: 50px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: transform 0.2s, background 0.2s;
                    }
                    .submit-btn:hover {
                        transform: scale(1.02);
                        background: #333;
                    }
                    .scroll-indicator {
                        position: fixed;
                        bottom: 40px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 10;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        color: #1a1a1a;
                        font-family: 'Montserrat', sans-serif;
                    }
                    .scroll-indicator span {
                        font-size: 0.75rem;
                        letter-spacing: 0.2em;
                        margin-bottom: 8px;
                        font-weight: 300;
                        opacity: 0.8;
                    }
                    .scroll-indicator .line {
                        width: 1px;
                        height: 50px;
                        background: rgba(0,0,0,0.1);
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
                        transform-origin: top;
                        animation: scroll-line 2.0s cubic-bezier(0.77, 0, 0.175, 1) infinite;
                    }
                    @keyframes scroll-line {
                        0% { transform: scaleY(0); transform-origin: top; }
                        40% { transform: scaleY(1); transform-origin: top; }
                        60% { transform: scaleY(1); transform-origin: bottom; }
                        100% { transform: scaleY(0); transform-origin: bottom; }
                    }
                `}</style>
        </>
    );
};

export default Interface;
