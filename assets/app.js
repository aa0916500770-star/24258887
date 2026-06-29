const APP_KEY = 'twRestaurantCommercialV1';
const ADMIN_PIN_KEY = 'twRestaurantAdminPinV1';

const demoMenu = [
  {id:uid(), category:'招牌主餐', name:'招牌牛肉飯', price:180, photo:'', desc:'香滷牛肉、青菜、半熟蛋', options:[{name:'飯量', choices:['正常','加飯 +20','少飯']},{name:'口味', choices:['正常','少鹽','加辣']}], available:true},
  {id:uid(), category:'招牌主餐', name:'雞腿排套餐', price:220, photo:'', desc:'酥煎雞腿、白飯、湯品、小菜', options:[{name:'主食', choices:['白飯','麵','冬粉']}], available:true},
  {id:uid(), category:'小菜', name:'燙青菜', price:60, photo:'', desc:'時令青菜', options:[{name:'醬料', choices:['蒜蓉','醬油膏','不要醬']}], available:true},
  {id:uid(), category:'飲品', name:'紅茶', price:35, photo:'', desc:'古早味紅茶', options:[{name:'冰量', choices:['正常冰','少冰','去冰']},{name:'甜度', choices:['正常甜','半糖','無糖']}], available:true}
];

function uid(){ return 'id' + Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4); }
function money(n){ return 'NT$ ' + Number(n||0).toLocaleString('zh-TW'); }
function nowText(){ return new Date().toLocaleString('zh-TW',{hour12:false}); }
function todayKey(){ return new Date().toISOString().slice(0,10); }
function esc(s){ return String(s??'').replace(/[&<>'"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m])); }
function getTable(){ return new URLSearchParams(location.search).get('table') || localStorage.getItem('currentTable') || ''; }
function saveTable(t){ if(t) localStorage.setItem('currentTable', t); }

function loadData(){
  const raw = localStorage.getItem(APP_KEY);
  if(raw){ try { return JSON.parse(raw); } catch(e){} }
  const data = {restaurant:{name:'示範餐廳', phone:'', address:'', taxRate:0, serviceRate:0, tables:20}, menu:demoMenu, orders:[], closed:[]};
  saveData(data); return data;
}
function saveData(data){ localStorage.setItem(APP_KEY, JSON.stringify(data)); window.dispatchEvent(new StorageEvent('storage',{key:APP_KEY})); }
function setPin(pin){ localStorage.setItem(ADMIN_PIN_KEY, pin || '1234'); }
function getPin(){ return localStorage.getItem(ADMIN_PIN_KEY) || '1234'; }
function ensureAdmin(){
  if(sessionStorage.getItem('adminOK')==='1') return true;
  const pin = prompt('請輸入管理員密碼（預設 1234）');
  if(pin === getPin()){ sessionStorage.setItem('adminOK','1'); return true; }
  alert('密碼錯誤'); location.href='index.html'; return false;
}

function statusLabel(s){ return ({new:'新訂單', cooking:'製作中', ready:'待送餐', served:'已送餐', paid:'已結帳', cancelled:'已取消'}[s]||s); }
function statusClass(s){ return 'status-' + s; }
function orderTotal(order){ return (order.items||[]).reduce((sum,it)=>sum+(Number(it.price)||0)*(Number(it.qty)||0),0); }
function optionText(opts){ return Object.entries(opts||{}).map(([k,v])=>`${k}：${v}`).join(' / '); }

async function compressImage(file, max=900, quality=.78){
  if(!file) return '';
  if(!file.type.startsWith('image/')) return '';
  const dataUrl = await new Promise((res,rej)=>{const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file);});
  const img = await new Promise((res,rej)=>{const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=dataUrl;});
  const scale = Math.min(1, max / Math.max(img.width,img.height));
  const canvas = document.createElement('canvas'); canvas.width=Math.round(img.width*scale); canvas.height=Math.round(img.height*scale);
  const ctx = canvas.getContext('2d'); ctx.drawImage(img,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

function download(filename, text){
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type:'application/json'})); a.download=filename; a.click(); URL.revokeObjectURL(a.href);
}
