const DEFAULT_MENU = [
  {id:'m1', category:'主餐', name:'招牌滷肉飯', price:85, desc:'香滷五花、半熟蛋、酸菜，人氣必點。', icon:'🍚', available:true},
  {id:'m2', category:'主餐', name:'炙燒鮭魚丼', price:220, desc:'炙燒鮭魚、醋飯、玉子燒與海苔絲。', icon:'🍣', available:true},
  {id:'m3', category:'主餐', name:'唐揚雞咖哩飯', price:180, desc:'酥炸唐揚雞搭配濃郁日式咖哩。', icon:'🍛', available:true},
  {id:'m4', category:'小菜', name:'胡麻時蔬', price:65, desc:'季節青菜佐特製胡麻醬。', icon:'🥗', available:true},
  {id:'m5', category:'小菜', name:'炸豆腐', price:75, desc:'外酥內嫩，附蘿蔔泥醬汁。', icon:'🍢', available:true},
  {id:'m6', category:'飲品', name:'冷泡烏龍茶', price:55, desc:'清爽回甘，去油解膩。', icon:'🍵', available:true},
  {id:'m7', category:'飲品', name:'檸檬氣泡飲', price:80, desc:'新鮮檸檬與氣泡水。', icon:'🍋', available:true}
];
const store = {
  get menu(){ return JSON.parse(localStorage.getItem('menu') || JSON.stringify(DEFAULT_MENU)); },
  set menu(v){ localStorage.setItem('menu', JSON.stringify(v)); },
  get orders(){ return JSON.parse(localStorage.getItem('orders') || '[]'); },
  set orders(v){ localStorage.setItem('orders', JSON.stringify(v)); },
  get settings(){ return JSON.parse(localStorage.getItem('settings') || '{"name":"幸福餐廳"}'); },
  set settings(v){ localStorage.setItem('settings', JSON.stringify(v)); }
};
let cart = {}; let currentCategory = '全部';
function money(n){return 'NT$' + Number(n).toLocaleString('zh-TW');}
function tableNo(){ return new URLSearchParams(location.search).get('table') || 'A01'; }
function initCustomer(){
  if(!document.getElementById('menuList')) return;
  document.getElementById('restaurantName').textContent = store.settings.name;
  document.getElementById('tableLabel').textContent = `桌號：${tableNo()}`;
  renderTabs(); renderMenu(); renderCart();
}
function renderTabs(){
  const cats = ['全部', ...new Set(store.menu.map(x=>x.category))];
  categoryTabs.innerHTML = cats.map(c=>`<button class="${c===currentCategory?'active':''}" onclick="currentCategory='${c}';renderTabs();renderMenu();">${c}</button>`).join('');
}
function renderMenu(){
  const items = store.menu.filter(x=>x.available && (currentCategory==='全部'||x.category===currentCategory));
  menuList.innerHTML = items.map(item=>`
    <article class="menu-card">
      <div class="food-img">${item.photo ? `<img src="${item.photo}" alt="${item.name}">` : (item.icon || '🍽️')}</div>
      <div class="food-info">
        <h3>${item.name}</h3><p>${item.desc || ''}</p>
        <div class="row"><span class="price">${money(item.price)}</span><button class="add-btn" onclick="addToCart('${item.id}')">加入</button></div>
      </div>
    </article>`).join('');
}
function addToCart(id){ cart[id]=(cart[id]||0)+1; renderCart(); toggleCart(true); }
function changeQty(id, diff){ cart[id]=(cart[id]||0)+diff; if(cart[id]<=0) delete cart[id]; renderCart(); }
function renderCart(){
  if(!document.getElementById('cartItems')) return;
  const menu = store.menu; const rows = Object.entries(cart).map(([id,qty])=>({item:menu.find(x=>x.id===id), qty})).filter(x=>x.item);
  cartItems.innerHTML = rows.length ? rows.map(({item,qty})=>`
    <div class="cart-item"><div class="row"><strong>${item.name}</strong><span>${money(item.price*qty)}</span></div>
    <div class="row"><small>${money(item.price)} / 份</small><div class="qty"><button onclick="changeQty('${item.id}',-1)">−</button><span>${qty}</span><button onclick="changeQty('${item.id}',1)">＋</button></div></div></div>`).join('') : '<p style="color:#777">尚未加入餐點</p>';
  const total = rows.reduce((s,x)=>s+x.item.price*x.qty,0); cartTotal.textContent = money(total); cartCount.textContent = rows.reduce((s,x)=>s+x.qty,0);
}
function toggleCart(show){ cartPanel.classList.toggle('open', show); }
function submitOrder(){
  const rows = Object.entries(cart).map(([id,qty])=>({item:store.menu.find(x=>x.id===id), qty})).filter(x=>x.item);
  if(!rows.length){ alert('請先選擇餐點'); return; }
  const order = {id:'O'+Date.now(), table:tableNo(), status:'新訂單', note:orderNote.value.trim(), time:new Date().toLocaleString('zh-TW'), items:rows.map(x=>({id:x.item.id,name:x.item.name,price:x.item.price,qty:x.qty})), total:rows.reduce((s,x)=>s+x.item.price*x.qty,0)};
  store.orders = [order, ...store.orders]; cart={}; orderNote.value=''; renderCart(); toggleCart(false); alert('訂單已送出！');
}
initCustomer();
