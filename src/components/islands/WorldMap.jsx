import { useId, useRef, useState } from 'react';
import { PLACES } from './places';

// Original low-poly geometry projected from x/y/z. No network or persistence.
function point(x, y, z, angle, zoom) {
  return [500 + (x * Math.cos(angle) - z * Math.sin(angle)) * zoom,
    340 + ((x * Math.sin(angle) + z * Math.cos(angle)) * .57 - y) * zoom];
}
export default function WorldMap({ selected = 'academy', onSelect, growth = false }) {
  const [angle, setAngle] = useState(-.15);
  const [zoom, setZoom] = useState(1);
  const [night, setNight] = useState(false);
  const gesture = useRef(null);
  const shadowId = useId().replace(/:/g, '');
  const p = (x, y, z) => point(x, y, z, angle, zoom);
  const points = (vs) => vs.map(v => p(...v).join(',')).join(' ');
  const poly = (vs, fill, key, props = {}) => <polygon key={key} points={points(vs)} fill={fill} {...props} />;
  const box = (x, z, w, d, h, color, key, base = 16) => {
    const bottom = [[x-w/2,base,z-d/2],[x+w/2,base,z-d/2],[x+w/2,base,z+d/2],[x-w/2,base,z+d/2]];
    const top = bottom.map(([a,,c]) => [a,base+h,c]);
    const sides = bottom.map((v,j) => ({j, vs:[v,bottom[(j+1)%4],top[(j+1)%4],top[j]], depth:p(...v)[1]+p(...bottom[(j+1)%4])[1]})).sort((a,b)=>a.depth-b.depth);
    return <g key={key}>{sides.map(({j,vs})=>poly(vs,[color,'#c9bea7',color,'#b5ac99'][j],j))}{poly(top,'#fff1d7','top')}</g>;
  };
  const order = [...PLACES].sort((a,b)=>p(a.x,0,a.z)[1]-p(b.x,0,b.z)[1]);
  const reset = () => {setAngle(-.15);setZoom(1);};
  return <div className={`xt-map ${night ? 'xt-map-night' : ''}`}>
    <div className="xt-map-heading"><span><i /> XIAO-T ARCHIPELAGO</span><span>點選小島，看看有什麼</span></div>
    <div className="xt-map-canvas" onPointerDown={e=>{
      if(e.button!==0 || e.target.closest('button'))return;
      gesture.current={x:e.clientX,angle,pointer:e.pointerId};e.currentTarget.setPointerCapture(e.pointerId);
    }} onPointerMove={e=>{if(gesture.current?.pointer===e.pointerId)setAngle(gesture.current.angle+(e.clientX-gesture.current.x)*.004);}}
    onPointerUp={()=>{gesture.current=null;}} onPointerCancel={()=>{gesture.current=null;}}>
      <svg viewBox="0 0 1000 680" aria-hidden="true" focusable="false">
        <defs><filter id={shadowId} x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#4c705e" floodOpacity=".17" /></filter></defs>
        {Array.from({length:23},(_,j)=><path key={`wave-${j}`} d={`M${(j*137)%990} ${(j*83)%610+40}q8 5 17 0`} stroke={night?'#bac9b82b':'#8bb4a136'} fill="none" />)}
        {PLACES.filter(i=>i.id!=='dock').map(i=>{const a=p(0,8,0),b=p(i.x,8,i.z);return <g key={`bridge-${i.id}`}><path d={`M${a}L${b}`} stroke="#ac9975" strokeWidth={12*zoom}/><path d={`M${a}L${b}`} stroke="#f4e7c5" strokeWidth={8*zoom} strokeDasharray="3 2"/></g>;})}
        {order.map((i,idx)=>{
          const ring=Array.from({length:6},(_,j)=>[i.x+Math.cos(j*Math.PI/3)*116,16,i.z+Math.sin(j*Math.PI/3)*116]);
          const low=ring.map(([x,,z])=>[x,-5,z]);
          const structures=i.kind==='museum'?[{x:0,z:-10,w:80,d:50,h:51}]:i.kind==='tower'?[{x:0,z:-15,w:30,d:30,h:94},{x:42,z:23,w:34,d:30,h:28}]:i.kind==='dock'?[{x:-20,z:-10,w:44,d:38,h:48},{x:35,z:15,w:29,d:31,h:28}]:[{x:-33,z:-13,w:39,d:33,h:45},{x:28,z:11,w:33,d:30,h:32},{x:6,z:-43,w:28,d:25,h:i.kind==='academy'?65:39}];
          return <g key={i.id}>
            {poly(low,'#b9cbbd','shadow',{filter:`url(#${shadowId})`})}
            {ring.map((v,j)=>{const k=(j+1)%6;return p(...v)[1]+p(...ring[k])[1]>p(i.x,16,i.z)[1]*2?poly([v,ring[k],low[k],low[j]],j%2?'#c7b893':'#ded0ac',`edge-${j}`):null;})}
            {poly(ring,i.land,'land',{stroke:selected===i.id?'#c99656':'#fff5de',strokeWidth:selected===i.id?4:3})}
            {poly(Array.from({length:6},(_,j)=>[i.x+Math.cos(j*Math.PI/3)*83,17,i.z+Math.sin(j*Math.PI/3)*83]),'none','path',{stroke:'#f8f1db',strokeWidth:8*zoom})}
            {structures.sort((a,b)=>p(i.x+a.x,0,i.z+a.z)[1]-p(i.x+b.x,0,i.z+b.z)[1]).map((b,n)=>{
              const x=i.x+b.x,z=i.z+b.z,y=16+b.h;
              return <g key={`building-${n}`}>{box(x,z,b.w,b.d,b.h,i.color,'body')}
                {i.kind==='museum'?box(x,z,b.w+9,b.d+8,6,'#ded3b6','roof',y):<>
                  {poly([[x-b.w/2-3,y,z-b.d/2-3],[x+b.w/2+3,y,z-b.d/2-3],[x+b.w/2+3,y+14,z],[x-b.w/2-3,y+14,z]],'#d9b28a','roof1')}
                  {poly([[x-b.w/2-3,y,z+b.d/2+3],[x+b.w/2+3,y,z+b.d/2+3],[x+b.w/2+3,y+14,z],[x-b.w/2-3,y+14,z]],'#ac7959','roof2')}
                </>}
                {[0,1].map(v=>poly([[x-10+v*17,30,z+b.d/2+.1],[x-4+v*17,30,z+b.d/2+.1],[x-4+v*17,41,z+b.d/2+.1],[x-10+v*17,41,z+b.d/2+.1]],night?'#ffda85':'#fcf0ce',`window-${v}`))}
                {i.id==='museum'&&growth&&<circle cx={p(x,y+18,z)[0]} cy={p(x,y+18,z)[1]} r={12*zoom} fill="#e8b84e" stroke="#fff3c8" strokeWidth="3"/>}
              </g>;
            })}
            {Array.from({length:6},(_,n)=>{const a=n*1.7+idx,x=i.x+Math.cos(a)*88,z=i.z+Math.sin(a)*76,t=p(x,39,z),s=p(x,16,z);return <g key={`tree-${n}`}><ellipse cx={s[0]} cy={s[1]} rx={11*zoom} ry={4*zoom} fill="#577b5e23"/><path d={`M${s}L${t}`} stroke="#9a855e" strokeWidth={4*zoom}/><circle cx={t[0]} cy={t[1]-5*zoom} r={(11+n%2)*zoom} fill={['#8da87f','#a7bf8e','#7c9d75'][n%3]}/><circle cx={t[0]-3*zoom} cy={t[1]-9*zoom} r={6*zoom} fill="#c6d6ae66"/></g>;})}
          </g>;
        })}
      </svg>
      {PLACES.map(i=>{const xy=p(i.x,0,i.z+84);return <button key={i.id} className={`xt-map-label ${selected===i.id?'is-selected':''}`} aria-label={i.name} style={{left:`${xy[0]/10}%`,top:`${(xy[1]+12)/6.8}%`,'--label-top':`${(xy[1]+12)/8}%`}} onClick={()=>onSelect(i.id)} aria-pressed={selected===i.id}><span className="xt-label-dot" style={{background:i.color}}/><span className="xt-label-name">{i.name}</span><span className="xt-label-number">{i.number}</span>{i.id==='museum'&&growth&&<b aria-label="已有收藏">✦</b>}</button>;})}
    </div>
    <div className="xt-map-bottom"><span>✧ <span>拖曳轉個方向<br/><small>也可以使用右側或下方的場所清單</small></span></span><div role="group" aria-label="地圖視角"><button onClick={()=>setZoom(Math.max(.7,zoom-.1))} aria-label="縮小地圖">−</button><button onClick={()=>setZoom(Math.min(1.25,zoom+.1))} aria-label="放大地圖">＋</button><button onClick={reset} aria-label="重設地圖">⌂</button><button onClick={()=>setNight(!night)} aria-label="夜晚模式" aria-pressed={night}>{night?'☀':'☾'}</button></div></div>
  </div>;
}
