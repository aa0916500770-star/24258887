const DEFAULT_MENU = [
  {id:'m1',category:'主餐',name:'招牌滷肉飯',price:85,desc:'香滷五花、半熟蛋、酸菜，人氣必點。',icon:'🍚',photo:'',available:true},
  {id:'m2',category:'主餐',name:'炙燒鮭魚丼',price:220,desc:'炙燒鮭魚、醋飯、玉子燒與海苔絲。',icon:'🍣',photo:'',available:true}
];
const store = {
  get menu(){ return JSON.parse(localStorage.getItem('menu') || JSON.stringify(DEFAULT_MENU)); },
  set menu(v){ localStorage.setItem('menu', JSON.stringify(v)); },
  get settings(){ return JSON.parse(localStorage.getItem('settings') || '{"name":"幸福餐廳"}'); },
  set settings(v){ localStorage.setItem('settings', JSON.stringify(v)); }
};
let selectedPhoto = '';
const $ = id => document.getElementById(id);
function money(n){ return 'NT$' + Number(n).toLocaleString('zh-TW'); }
function esc(s){ return String(s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function render(){
  $('restaurantName').value = store.settings.name || '幸福餐廳';
  $('rows').innerHTML = store.menu.map(i => `
    <tr>
      <td>${i.photo ? `<img class="thumb" src="${i.photo}" alt="${esc(i.name)}">` : `<div class="thumb">${i.icon || '🍽️'}</div>`}</td>
      <td>${esc(i.category)}</td>
      <td>${esc(i.icon || '')} ${esc(i.name)}<br><small>${esc(i.desc || '')}</small></td>
      <td>${money(i.price)}</td>
      <td><button onclick="delItem('${i.id}')">刪除</button></td>
    </tr>`).join('');
}
function saveName(){
  store.settings = { name: $('restaurantName').value.trim() || '幸福餐廳' };
  alert('已儲存餐廳名稱');
}
function resetForm(){
  ['foodName','category','price','icon','desc','photo'].forEach(id => { if($(id)) $(id).value = ''; });
  selectedPhoto = '';
  $('photoPreview').textContent = '尚未選擇餐點照片';
}
function addMenu(){
  const foodName = $('foodName').value.trim();
  const category = $('category').value.trim() || '其他';
  const price = Number($('price').value);
  const icon = $('icon').value.trim() || '🍽️';
  const desc = $('desc').value.trim();
  if(!foodName){ alert('請輸入餐點名稱'); $('foodName').focus(); return; }
  if(!price || price <= 0){ alert('請輸入正確價格'); $('price').focus(); return; }
  const item = { id:'m' + Date.now(), name:foodName, category, price, icon, photo:selectedPhoto, desc, available:true };
  try{
    store.menu = [...store.menu, item];
  }catch(err){
    alert('新增失敗：照片檔案可能太大，請改用較小的照片，或先不要放照片再新增。');
    return;
  }
  resetForm();
  render();
  alert('已新增餐點');
}
function delItem(id){
  if(!confirm('確定刪除此餐點？')) return;
  store.menu = store.menu.filter(x => x.id !== id);
  render();
}
function resizeImage(file, maxSize = 900, quality = 0.78){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
$('photo').addEventListener('change', async e => {
  const file = e.target.files[0];
  if(!file){ selectedPhoto = ''; $('photoPreview').textContent = '尚未選擇餐點照片'; return; }
  if(!file.type.startsWith('image/')){ alert('請選擇圖片檔'); e.target.value=''; return; }
  $('photoPreview').textContent = '照片處理中...';
  try{
    selectedPhoto = await resizeImage(file);
    $('photoPreview').innerHTML = `<img src="${selectedPhoto}" alt="餐點照片預覽"><small>已選擇：${esc(file.name)}</small>`;
  }catch(err){
    selectedPhoto = '';
    $('photoPreview').textContent = '照片讀取失敗，請換一張圖片';
  }
});
render();
