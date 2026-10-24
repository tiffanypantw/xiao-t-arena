import { useRef, useState } from 'react';
import { emitCardEvent } from './analytics';
export default function CardChallenge({card,completed,onComplete}){
 const [started,setStarted]=useState(false);const [choice,setChoice]=useState('');const [checked,setChecked]=useState(false);
 const completionEmitted=useRef(false);
 const challenge=card.challenge;if(!challenge)return null;
 const correct=choice===challenge.correct_option_id;
 return <section className="flc-challenge" aria-labelledby="challenge-title"><p className="flc-eyebrow">ONE SMALL DECISION</p><h2 id="challenge-title">把概念，帶進一個小選擇</h2>
 {!started?<><p>不用留下名字，也沒有分數排名。試著替自己的想法找一個理由。</p><button className="flc-primary" onClick={()=>{setStarted(true);emitCardEvent('start_challenge',card);}}>開始思考挑戰 →</button>{completed&&<p className="flc-muted">這個瀏覽器曾完成這張卡的挑戰；可以再練一次。</p>}</>:<form onSubmit={e=>{e.preventDefault();if(!choice)return;setChecked(true);if(correct){if(!completionEmitted.current){completionEmitted.current=true;emitCardEvent('complete_challenge',card);onComplete(card.card_id);}}}}>
 <fieldset><legend>{challenge.prompt}</legend>{challenge.options.map(option=><label key={option.id} className={`flc-option ${choice===option.id?'is-selected':''}`}><input type="radio" name={'challenge-'+card.card_id} value={option.id} checked={choice===option.id} onChange={()=>{setChoice(option.id);setChecked(false);}} required/><span>{option.text}</span></label>)}</fieldset>
 <button className="flc-primary" type="submit" disabled={!choice||checked}>{checked?'已查看解析':'確認選擇'}</button>
 {checked&&<div className="flc-feedback" role="status"><strong>{correct?'完成這次思考 ✓':'再想一想「下一個最佳選項」'}</strong><p>{challenge.explanation}</p>{!correct&&<p>換一個選項再試一次。選擇內容不會上傳。</p>}</div>}
 </form>}
 </section>;
}
