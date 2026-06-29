// 請到 Firebase Console 複製你的 Web app 設定後貼在這裡
// Project settings → Your apps → Web app → SDK setup and configuration → Config
export const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

// 同一個 Firebase 專案可放多間店，先用 default
export const RESTAURANT_ID = "default";
