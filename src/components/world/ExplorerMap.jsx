import {lazy,Suspense,useState,useCallback} from 'react';
import FlatExplorerMap from './FlatExplorerMap';
const InteractiveMap=lazy(()=>import('./InteractiveMap'));
export default function ExplorerMap(props){
 const [simple,setSimple]=useState(false);
 const fallback=useCallback(()=>setSimple(true),[]);
 if(simple)return <div><p className="wg-map-choice">正在使用簡易地圖。<button onClick={()=>setSimple(false)}>重試互動地球 ↗</button></p><FlatExplorerMap {...props}/></div>;
 return <Suspense fallback={<div className="wg-map-loading" role="status">正在準備你的互動地球…</div>}><InteractiveMap {...props} onFallback={fallback}/></Suspense>;
}
