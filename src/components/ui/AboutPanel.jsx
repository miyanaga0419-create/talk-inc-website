import React from 'react';
import AboutMapSection from './AboutMapSection';

const AboutPanel = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const historyData = [
        { date: '1996年04月01日', event: '神戸市中央区にて有限会社トーク　設立' },
        { date: '1998年02月18日', event: '大阪地区制作強化の為　有限会社ラコンテ　設立' },
        { date: '2000年09月14日', event: 'インターネットビジネス及びソフトウエア開発を目的とした株式会社ユービック設立に放送出版シー・アールと共同参画' },
        { date: '2001年06月11日', event: '東京でのテレビコマーシャルの企画制作業務の為有限会社ブランドワン　設立' },
        { date: '2001年07月24日', event: '株式会社トーク　組織変更' },
        { date: '2005年10月14日', event: '兵庫県の広告制作会社として初めてプライバシーマーク取得\n認定番号【第A830060(01)号】' },
        { date: '2010年07月29日', event: '運営する「netdesign.tv」が兵庫県の『経営革新計画』事業として承認される\n承認番号【神戸（県）第1504号】\n※ netdesign.tvは現在改修のため一時停止中' },
        { date: '2010年10月28日', event: 'チャイナステージ有限会社とワークス株式会社と共同で、対中国ビジネスプロモーションを総合的にサポートするための企画制作ユニット「JC-gate」を立ち上げる' },
        { date: '2014年04月01日', event: '完全成果報酬型のECサイトの運営開始' },
        { date: '2019年06月01日', event: 'ECプラットホーム「Magento」による他言語・他通貨決済対応のECサイトの構築・実施' },
        { date: '2020年04月01日', event: '新型コロナ対応を機に働き方改革としてオフィス縮小、テレワーク等を実施' },
        { date: '2021年04月01日', event: '会社設立25周年を迎える' },
        { date: '2024年02月01日', event: '神戸事務所を大阪事務所に移転し大阪事務所を本店とする' },
    ];

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(255, 255, 255, 0.98)',
                zIndex: 2000,
                overflowY: 'auto',
                padding: '40px',
                paddingTop: '120px',
                boxSizing: 'border-box',
                pointerEvents: 'auto',
            }}
        >
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    width: '40px',
                    height: '40px',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '50%',
                    fontSize: '20px',
                    color: '#666',
                    cursor: 'pointer',
                    zIndex: 2001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: '0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#e0e0e0'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
            >
                ×
            </button>

            <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: '"Noto Sans JP", sans-serif', paddingBottom: '80px' }}>
                <h2 style={{ fontSize: '2rem', borderBottom: '2px solid #333', paddingBottom: '1rem', marginBottom: '2rem', letterSpacing: '0.1em' }}>
                    ABOUT
                </h2>

                <div style={{ lineHeight: '1.8', fontSize: '1rem', color: '#444' }}>
                    <dl style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '15px' }}>
                        <dt style={{ fontWeight: 'bold', borderRight: '2px solid #eee' }}>名　称</dt>
                        <dd style={{ margin: 0 }}>株式会社 トーク</dd>

                        <dt style={{ fontWeight: 'bold', borderRight: '2px solid #eee' }}>所在地</dt>
                        <dd style={{ margin: 0 }}>
                            〒550-0002<br />
                            大阪市西区江戸堀1丁目19番10号<br />
                            三共肥後橋ビル5F<br />
                            TEL.06-6447-7606　FAX.06-6447-7607
                        </dd>

                        <dt style={{ fontWeight: 'bold', borderRight: '2px solid #eee' }}>設　立</dt>
                        <dd style={{ margin: 0 }}>1996年（平成8年）4月1日</dd>

                        <dt style={{ fontWeight: 'bold', borderRight: '2px solid #eee' }}>代表取締役</dt>
                        <dd style={{ margin: 0 }}>藤山佳男</dd>
                    </dl>

                    {/* ★修正ポイント: ここでマップの高さを固定する！ */}
                    <div style={{
                        width: '100%',
                        height: '400px', /* 高さを400pxに制限 */
                        background: '#f9f9f9',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        margin: '30px 0',
                        border: '1px solid #eee'
                    }}>
                        <AboutMapSection />
                    </div>

                    <div style={{ marginTop: '15px', marginBottom: '60px' }}>
                        <a
                            href="https://www.google.com/maps/place/%E3%80%92550-0002+%E5%A4%A7%E9%98%AA%E5%BA%9C%E5%A4%A7%E9%98%AA%E5%B8%82%E8%A5%BF%E5%8C%BA%E6%B1%9F%E6%88%B8%E5%A0%80%EF%BC%91%E4%B8%81%E7%9B%AE%EF%BC%91%EF%BC%99%E2%88%92%EF%BC%91%EF%BC%90+%E4%B8%89%E5%85%B1%E8%82%A5%E5%BE%8C%E6%A9%8B%E3%83%93%E3%83%AB+5f/@34.689204,135.4950659,16z"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                background: '#1a1a1a',
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                borderRadius: '4px',
                                fontWeight: 'bold'
                            }}
                        >
                            Google Mapで見る
                        </a>
                    </div>

                    <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '30px', letterSpacing: '0.1em' }}>
                        HISTORY
                    </h3>

                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {historyData.map((item, index) => (
                            <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '1.1rem', color: '#1a1a1a' }}>
                                    {item.date}
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                                    {item.event}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AboutPanel;
