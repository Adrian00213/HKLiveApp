# HKLive App

> 香港即時生活平台 · 「香港，一触即发」

## 當前版本狀態

**Phase 1 完成** - 基本 UI 框架已建立

```
目前進度：
✅ 項目初始化 (Expo)
✅ 三頁面架構 (地圖/資訊/我的)
✅ Mock 數據
✅ 距離排序功能
✅ 口語化翻譯 (繁/簡/英)

下一步：
🔧 加入 MapLibre 地圖 SDK
🔧 連接後端 API
🔧 Firebase 認證
```

## 功能概覽

### 🗺️ 地圖頁
- 附近事件標記 (交通/活動/天氣/塞車)
- 由近到遠排序
- 事件詳情卡
- 舉報功能 (圖片/語音)

### 📱 資訊頁
- **活動** - 演唱會/展覽/市集/運動 (距離排序)
- **優惠** - 餐飲/購物/娛樂 著數 (距離排序)
- **交通** - 港鐵/巴士 到站時間 (距離排序)
- **天氣** - 溫度/AQHI 18區
- **討論區** - 圖片/影片/語音 匿名發布

### 👤 我的頁
- 用戶資料
- 收藏/留言/帖子
- 語言切換 (繁/簡/英)
- 通知設定

## 運行項目

```bash
cd ~/Projects/HKLiveApp/HKLive

# 安裝依賴
npm install

# 運行 iOS
npm run ios

# 運行 Android
npm run android

# 運行 Web
npm run web
```

## 技術棧

| 層 | 技術 |
|---|---|
| 框架 | React Native (Expo SDK 52) |
| 語言 | TypeScript |
| 導航 | React Navigation 7 |
| 狀態 | Zustand |
| 地圖 | MapLibre GL JS (待加入) |
| 後端 | Node.js + Express (規劃中) |
| 數據庫 | Firebase Firestore (規劃中) |
| 認證 | Firebase Auth (規劃中) |

## 項目結構

```
HKLiveApp/
├── SPEC.md              # 產品規格
├── ARCHITECTURE.md      # 架構文檔
├── CHANGELOG.md         # 開發日誌
└── HKLive/
    ├── App.tsx         # 主入口
    ├── src/
    │   ├── screens/    # 頁面
    │   ├── store/       # 狀態
    │   ├── services/    # 服務
    │   ├── i18n/        # 翻譯
    │   └── types/        # 類型
    └── package.json
```

## 語言

- 🇭🇰 繁體中文 (默认)
- 🇨🇳 簡體中文
- 🇺🇸 English

## License

Private - Adrian Chan
