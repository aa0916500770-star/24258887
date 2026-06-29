import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, getDocs, query, orderBy, serverTimestamp, getDoc, where } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { firebaseConfig, RESTAURANT_ID } from '../firebase-config.js';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rid = RESTAURANT_ID || 'default';
export { signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, getDocs, query, orderBy, serverTimestamp, getDoc, where };

export const paths = {
  restaurant: () => doc(db,'restaurants',rid),
  menu: () => collection(db,'restaurants',rid,'menu'),
  menuDoc: id => doc(db,'restaurants',rid,'menu',id),
  orders: () => collection(db,'restaurants',rid,'orders'),
  orderDoc: id => doc(db,'restaurants',rid,'orders',id)
};
export function money(n){return 'NT$ '+Number(n||0).toLocaleString('zh-TW')}
export function esc(s){return String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
export function uid(){return 'id'+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4)}
export function tableNo(){return new URLSearchParams(location.search).get('table')||localStorage.getItem('tableNo')||''}
export function saveTable(t){if(t)localStorage.setItem('tableNo',t)}
export function statusText(s){return ({new:'新訂單',cooking:'製作中',ready:'待送餐',served:'已送餐',paid:'已結帳',cancelled:'已取消'}[s]||s)}
export function statusClass(s){return 'pill s-'+s}
export function orderTotal(o){return (o.items||[]).reduce((s,i)=>s+(Number(i.price)||0)*(Number(i.qty)||0),0)}
export function optionText(o){return Object.entries(o||{}).map(([k,v])=>`${k}：${v}`).join(' / ')}
export async function compressImage(file,max=850,quality=.75){if(!file)return'';const data=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=data});const scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);return c.toDataURL('image/jpeg',quality)}
export function requireAdmin(){return new Promise(resolve=>onAuthStateChanged(auth,u=>{if(u)resolve(u);else location.href='login.html?next='+encodeURIComponent(location.pathname.split('/').pop()+location.search)}))}
