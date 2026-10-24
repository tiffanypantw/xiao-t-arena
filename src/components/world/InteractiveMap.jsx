import {useEffect,useRef,useState} from 'react';
import {Map,Marker,AttributionControl,setWorkerUrl} from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import style from '@/data/world/explorer-style.json';
setWorkerUrl(workerUrl);
export default function InteractiveMap({stories,selected,onSelect,onFallback}){
 const container=useRef(null),mapRef=useRef(null),markers=useRef([]),selectRef=useRef(onSelect);selectRef.current=onSelect;
 const previousSelection=useRef(selected);
 const [ready,setReady]=useState(false),[notice,setNotice]=useState(''),[globe,setGlobe]=useState(true),[tilted,setTilted]=useState(false),[terrain,setTerrain]=useState(false),[zoom,setZoom]=useState(1.4);
 const reduced=useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 function camera(options){mapRef.current?.easeTo({...options,duration:reduced.current?0:800});}
 useEffect(()=>{
  let map,observer,timer,closed=false;
  try{
   map=new Map({container:container.current,style,center:[65,20],zoom:1.4,minZoom:.5,maxZoom:16,maxPitch:70,attributionControl:false,cooperativeGestures:true,canvasContextAttributes:{antialias:true},locale:{'CooperativeGesturesHandler.WindowsHelpText':'按住 Ctrl 再捲動，即可縮放地圖','CooperativeGesturesHandler.MacHelpText':'按住 ⌘ 再捲動，即可縮放地圖','CooperativeGesturesHandler.MobileHelpText':'用兩隻手指移動與縮放地圖','Map.Title':'小 T 互動世界地圖'}});
   mapRef.current=map;map.addControl(new AttributionControl({compact:true}));
   map.on('style.load',()=>{if(!closed)map.setProjection({type:'globe'});});
   map.once('load',()=>{if(closed)return;clearTimeout(timer);setReady(true);map.getCanvas().setAttribute('aria-label','互動地圖：方向鍵移動，＋或−縮放；也可使用下方按鈕。');});
   map.on('zoomend',()=>{if(!closed)setZoom(map.getZoom());});
   map.on('pitchend',()=>{if(!closed)setTilted(map.getPitch()>10);});
   map.on('error',()=>{if(!closed)setNotice('部分地圖資料暫時無法載入。你可以切換簡易地圖，或使用下方故事卡。');});
   map.getCanvas().addEventListener('webglcontextlost',()=>{if(!closed)onFallback();});
   observer=new ResizeObserver(()=>map.resize());observer.observe(container.current);
   timer=setTimeout(()=>{if(!closed&&!map.loaded())onFallback();},25000);
  }catch{onFallback();}
  return()=>{closed=true;clearTimeout(timer);observer?.disconnect();markers.current.forEach(m=>m.remove());markers.current=[];map?.remove();mapRef.current=null;};
 },[onFallback]);
 useEffect(()=>{
  const map=mapRef.current;if(!ready||!map)return;
  markers.current.forEach(m=>m.remove());
  markers.current=stories.map(s=>{
   const button=document.createElement('button');button.type='button';button.className=`wg-live-pin ${selected===s.id?'is-selected':''}`;button.setAttribute('aria-label',`${s.country}：${s.title}`);button.setAttribute('aria-pressed',String(selected===s.id));
   const icon=document.createElement('span');icon.textContent='✦';const label=document.createElement('b');label.textContent=`${s.country} · ${s.edition_label||s.episode_id}`;button.append(icon,label);
   button.addEventListener('click',()=>{selectRef.current(s.id);camera({center:[s.longitude,s.latitude],zoom:Math.max(4.5,map.getZoom())});});
   return new Marker({element:button,anchor:'bottom'}).setLngLat([s.longitude,s.latitude]).addTo(map);
  });
  return()=>{markers.current.forEach(m=>m.remove());markers.current=[];};
 },[ready,stories,selected]);
 useEffect(()=>{if(!ready||selected===previousSelection.current)return;previousSelection.current=selected;const story=stories.find(s=>s.id===selected);if(story)camera({center:[story.longitude,story.latitude],zoom:4.5,pitch:0,bearing:0});},[ready,selected,stories]);
 useEffect(()=>{const map=mapRef.current;if(!ready||!map)return;map.setProjection({type:globe?'globe':'mercator'});},[ready,globe]);
 useEffect(()=>{const map=mapRef.current;if(!ready||!map)return;try{map.setTerrain(terrain?{source:'mtt-terrain',exaggeration:1.5}:null);map.setLayoutProperty('mtt-hillshade','visibility',terrain?'visible':'none');}catch{setNotice('山地資料暫時無法載入，可繼續使用一般地圖。');}},[ready,terrain]);
 function world(){setTerrain(false);camera({center:[65,20],zoom:1.4,pitch:0,bearing:0});}
 function taiwan(){camera({center:[121,23.7],zoom:6.2,pitch:tilted?45:0,bearing:0});}
 function mountains(){const next=!terrain;setTerrain(next);if(next)camera({center:[121.05,23.5],zoom:9.5,pitch:65,bearing:-25});else camera({pitch:0,bearing:0});}
 return <section className="wg-map wg-live-map" aria-label="可縮放的立體世界地圖"><div className="wg-map-top"><span>✦ 小 T 的互動地球</span><span>拉近一點，世界還有更多細節</span></div><div className="wg-live-canvas" ref={container}>{!ready&&<div className="wg-map-loading" role="status">正在載入國界與地名…</div>}</div><div className="wg-live-toolbar" aria-label="地圖操作"><div><button disabled={!ready||zoom<=.5} onClick={()=>camera({zoom:Math.max(.5,zoom-1)})} aria-label="縮小地圖">−</button><button disabled={!ready||zoom>=16} onClick={()=>camera({zoom:Math.min(16,zoom+1)})} aria-label="放大地圖">＋</button><button disabled={!ready} onClick={world}>看全世界</button><button disabled={!ready} onClick={taiwan}>到台灣</button></div><div><button disabled={!ready} aria-pressed={globe} onClick={()=>setGlobe(v=>!v)}>{globe?'地球 → 平面':'平面 → 地球'}</button><button disabled={!ready} aria-pressed={tilted} onClick={()=>camera({pitch:tilted?0:45})}>{tilted?'回到俯視':'傾斜 45°'}</button><button disabled={!ready} aria-pressed={terrain} onClick={mountains}>{terrain?'關閉山地':'台灣山地 3D'}</button></div></div><p className="wg-map-help">拖曳探索 · 按鈕或雙指縮放 · 放大後顯示更多國名、城市與邊界。山地模式的高度放大 1.5 倍，方便觀察。</p>{notice&&<p className="wg-map-notice" role="status">{notice}</p>}<div className="wg-live-foot"><small>邊界與地名依地圖來源呈現，爭議界線依來源以虛線標示；不代表主權認定。底圖持續更新，非即時政治邊界公告。</small><button onClick={onFallback}>使用簡易地圖</button></div></section>;
}
