# HKLive App - 香港即時生活平台

📱 香港人的即時生活資訊 App

## 功能

- 🗺️ **地圖** - 附近事件即時顯示（交通/活動/天氣/塞車）
- 📱 **資訊** - 優惠/交通/天氣/討論區
- 👤 **我的** - 收藏/設定/語言切換

## 技術

- React Native (Expo SDK 54)
- TypeScript
- Firebase (Auth / Firestore / Storage)
- Socket.IO (實時更新)

## 開發

```bash
cd HKLive
npm install
npx expo start
```

## GitHub Actions

每當你 push 到 main 分支，會自動：

1. **Build Android APK** - Android 安裝包
2. **Build iOS** - iOS 安裝包（需要 Apple Developer）

APK 會喺 Actions tab download。

## Firebase Setup

1. 去 [Firebase Console](https://console.firebase.google.com)
2. 建立項目
3. 開通 Authentication (Email/Password)
4. 開通 Firestore Database
5. 開通 Storage
6. 複製 Config 到 `src/services/firebase.ts`

## 授權

Private - Adrian Chan
