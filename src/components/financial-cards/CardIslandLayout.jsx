import { Link } from 'react-router-dom';
import { cardAnalyticsEnabled } from './analytics';
import './cards.css';
export default function CardIslandLayout({children}){
 return <div className="flc-site"><header className="flc-header"><Link to="/card-island" className="flc-wordmark"><span>m<sup>＋</sup></span><span>MORE THAN TIFFANY<small>小 T 帶你看世界</small></span></Link><nav aria-label="牌卡島導航"><Link to="/islands">回到群島</Link><Link to="/resources">免費資源</Link><Link to="/card-island">牌卡圖鑑</Link></nav></header><main className="flc-main">{children}</main><footer className="flc-footer"><p>© 2026 More Than Tiffany. All Rights Reserved.</p><p>{cardAnalyticsEnabled()?'已啟用匿名牌卡事件統計；不傳送名字、帳號或作答內容。':'本階段統計尚未啟用，未蒐集瀏覽或挑戰事件。'}收藏只存於此瀏覽器，與課程獎勵分開。</p></footer></div>;
}
