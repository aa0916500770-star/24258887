# Firebase 雲端商業版｜餐廳手機掃碼點餐系統

此版本使用 GitHub Pages + Firebase Firestore。後台新增菜色後，手機點餐、廚房、櫃台會即時同步。

## 功能
- 顧客掃碼點餐：桌號、分類、餐點照片、客製化選項、備註、送出訂單
- 後台管理：餐廳資料、菜單新增/編輯/刪除、照片、上下架
- 廚房 KDS：新訂單、製作中、待送餐、已送餐，即時更新
- 櫃台結帳：依桌號合併結帳、付款方式
- 營業統計：今日營業額、熱銷排行、近期已結帳訂單
- 桌號 QR：依桌數批量產生 QR Code

## Firebase 設定步驟
1. 到 Firebase Console 建立 Project。
2. 建立 Web App，複製 firebaseConfig。
3. 打開本系統的 `firebase-config.js`，貼上你的設定。
4. Firebase Console → Authentication → Sign-in method → 啟用 Email/Password。
5. Authentication → Users → Add user，建立管理員 Email / 密碼。
6. Firestore Database → Create database。
7. Firestore Rules 貼上下面規則並 Publish。
8. 將本資料夾上傳 GitHub Pages。

## Firestore Rules（正式版基本規則）

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null;

      match /menu/{menuId} {
        allow read: if true;
        allow write: if request.auth != null;
      }

      match /orders/{orderId} {
        allow create: if true;
        allow read, update, delete: if request.auth != null;
      }
    }
  }
}
```

## 注意事項
- firebaseConfig 可以放在前端，真正權限由 Firestore Rules 控制。
- 餐點照片目前壓縮後直接存 Firestore，適合一般菜單圖片。若照片很多，建議升級 Firebase Storage 版本。
- 顧客可以建立訂單；讀取與更新訂單需管理員登入，避免外部看到訂單資料。
- 管理員登入使用 Firebase Authentication 的 Email/Password。

## GitHub Pages 上傳
將資料夾內所有檔案上傳到 Repository 根目錄：
- index.html
- order.html
- admin.html
- kitchen.html
- cashier.html
- reports.html
- qrcode.html
- login.html
- firebase-config.js
- assets/

Settings → Pages → Deploy from branch → main → /root。
