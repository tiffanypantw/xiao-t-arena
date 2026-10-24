import { useState } from 'react';
const key='mtt-financial-card-island:v1';
function read(){try{const value=JSON.parse(localStorage.getItem(key)||'{}');return {saved:Array.isArray(value.saved)?value.saved.filter(x=>typeof x==='string'):[],completed:Array.isArray(value.completed)?value.completed.filter(x=>typeof x==='string'):[]};}catch{return {saved:[],completed:[]};}}
export function useCardCollection(){
 const [collection,setCollection]=useState(read);
 const [storageWarning,setStorageWarning]=useState('');
 function change(type,id,toggle=false){setCollection(previous=>{
  const values=new Set(previous[type]);if(toggle&&values.has(id))values.delete(id);else values.add(id);
  const next={...previous,[type]:[...values]};try{localStorage.setItem(key,JSON.stringify(next));}catch{setStorageWarning('瀏覽器未允許儲存，紀錄只保留於本次頁面。');}return next;
 });}
 return {...collection,storageWarning,toggleSaved:id=>change('saved',id,true),complete:id=>change('completed',id)};
}
