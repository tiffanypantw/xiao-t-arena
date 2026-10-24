import { Lock, Flag, ArrowUpRight, Check } from 'lucide-react';
import './islands.css';

export default function LearningRoadView({ theme, statuses, onStart }) {
  const complete = statuses.filter(s=>s==='done').length;
  const labels = {done:'徽章已獲得',playable:'可以開始',waiting:'先完成上一關',mystery:'準備中'};
  return <>
    <section className="xt-road-intro"><p className="xt-eyebrow">ADVENTURE ACADEMY · 冒險航線</p><h1 className="text-2xl font-black leading-relaxed">{theme.emoji} {theme.themeName}</h1><p className="text-sm text-muted-foreground mt-2 leading-relaxed">{theme.coreQ}</p><div className="xt-road-summary"><span>{theme.band} · {theme.season}</span><span>{complete} / {theme.weeks.length} 關獲得徽章</span></div><div className="xt-road-track" role="progressbar" aria-label="已獲徽章關卡" aria-valuemin={0} aria-valuemax={theme.weeks.length} aria-valuenow={complete}><span style={{width:`${complete/theme.weeks.length*100}%`}}/></div></section>
    <p className="text-xs text-muted-foreground mb-5 leading-relaxed">每座小島，練習一種新能力。依序前進，還沒公開的地方先留一點神祕。</p>
    <div aria-label="課程關卡" className="xt-road-grid">{theme.weeks.map((w,i)=>{
      const st=statuses[i];const playable=st==='playable'||st==='done';
      return <article className={`xt-road-stop is-${st}`} key={w.n}>
        <div className="xt-road-hex" aria-hidden="true">{st==='done'?<Check size={25}/>:st==='waiting'?<Lock size={21}/>:st==='mystery'?'?':w.n}</div>
        <div><span className="xt-road-state">W{w.n} · {labels[st]}</span><h3>{st==='mystery'?'尚未公開的小島':w.topic}</h3>{st==='mystery'?<p>老師正在準備新的冒險，之後再來看看。</p>:<>
          {w.sub&&<small>{w.sub}</small>}
          <details className="mt-2"><summary className="text-xs text-muted-foreground cursor-pointer py-1">{st==='done'?'我現在會什麼？':'這一關會學到什麼？'}</summary><p>{w.iCan}</p><p>{w.act}</p></details>
          {playable?<button className="xt-primary" onClick={()=>onStart(w.weekNumber)}>{st==='done'?'回去看看':'開始挑戰'}<ArrowUpRight size={15}/></button>:<p className="text-xs mt-2">🔒 拿到上一關的徽章後，這裡就會開放。</p>}
        </>}</div>
      </article>;
    })}</div><p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2"><Flag size={14}/> 每一步，都是你自己走出來的。</p>
  </>;
}
