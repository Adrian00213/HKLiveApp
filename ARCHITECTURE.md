# HKLive 架構文檔

## 項目結構

```
HKLiveApp/
├── SPEC.md                    # 產品規格文檔
├── CHANGELOG.md              # 開發日誌
├── backend/                   # 後端服務 (將來創建)
│   ├── src/
│   │   ├── index.ts         # 服務入口
│   │   ├── routes/          # API 路由
│   │   ├── controllers/     # 控制器
│   │   ├── services/         # 業務邏輯
│   │   ├── models/          # 數據模型
│   │   ├── socket/          # WebSocket 處理
│   │   └── middleware/      # 中間件
│   ├── package.json
│   └── tsconfig.json
└── HKLive/                   # Expo React Native App
    ├── App.tsx              # 主入口
    ├── app.json             # Expo 配置
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── screens/          # 頁面組件
        │   ├── MapScreen.tsx
        │   ├── InfoScreen.tsx
        │   └── ProfileScreen.tsx
        ├── components/       # 可重用組件
        │   ├── ui/           # UI 組件
        │   ├── map/          # 地圖相關
        │   ├── events/       # 活動相關
        │   ├── deals/        # 優惠相關
        │   └── discussion/    # 討論區相關
        ├── navigation/       # 導航配置
        │   └── AppNavigator.tsx
        ├── store/            # 狀態管理 (Zustand)
        │   └── appStore.ts
        ├── services/         # API 服務
        │   ├── api.ts        # API 客戶端
        │   ├── socket.ts     # WebSocket 客戶端
        │   └── mockData.ts    # Mock 數據
        ├── i18n/              # 國際化
        │   ├── translations.ts
        │   └── useTranslation.ts
        ├── types/            # TypeScript 類型
        │   └── index.ts
        ├── hooks/            # 自定義 Hooks
        ├── utils/            # 工具函數
        ├── constants/        # 常量
        └── assets/           # 靜態資源
```

---

## 技術架構

### 前端 (React Native / Expo)

| 技術 | 用途 |
|------|------|
| Expo SDK 52 | 基礎框架 |
| React Navigation 7 | 導航系統 |
| Zustand | 狀態管理 |
| MapLibre GL JS | 地圖顯示 |
| Socket.IO Client | 實時通訊 |
| Expo AV | 音頻/視頻 |
| Expo Image Picker | 圖片選擇 |
| Firebase Auth | 用戶認證 |
| Firebase Firestore | 雲端數據庫 |
| FCM | 推送通知 |

### 後端 (Node.js)

| 技術 | 用途 |
|------|------|
| Node.js 20 | 運行時 |
| Express.js | Web 框架 |
| Socket.IO | 實時通信 |
| Firebase Admin | 後端服務 |
| Cloud Functions | 無服務器函數 |
| OpenAPI 3.0 | API 文檔 |

---

## 數據模型

### 用戶 (User)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  language: 'zh-TW' | 'zh-CN' | 'en';
  district: string;
  favorites: string[];
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface UserSettings {
  notifications: boolean;
  locationSharing: boolean;
  theme: 'light' | 'dark' | 'auto';
}
```

### 事件 (Incident)
```typescript
interface Incident {
  id: string;
  type: 'accident' | 'event' | 'weather' | 'traffic' | 'other';
  lat: number;
  lng: number;
  title: string;
  description: string;
  imageUrl?: string;
  audioUrl?: string;
  upvotes: number;
  userId: string;
  createdAt: Date;
  expiresAt?: Date;
}
```

### 優惠 (Deal)
```typescript
interface Deal {
  id: string;
  merchantId: string;
  merchantName: string;
  title: string;
  description: string;
  discount: string;
  lat: number;
  lng: number;
  category: 'food' | 'shopping' | 'entertainment';
  imageUrl?: string;
  expiry: Date;
  createdAt: Date;
}
```

### 活動 (Event)
```typescript
interface Event {
  id: string;
  type: 'concert' | 'exhibition' | 'festival' | 'sports';
  title: string;
  venue: string;
  lat: number;
  lng: number;
  date: string;
  time: string;
  price: string;
  imageUrl?: string;
  attendees: number;
  interested: string[]; // user IDs
  createdAt: Date;
}
```

### 討論 (Discussion)
```typescript
interface Discussion {
  id: string;
  district: string;
  title: string;
  content: string;
  mediaUrls: string[];
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  upvotes: number;
  commentCount: number;
  createdAt: Date;
}

interface Comment {
  id: string;
  discussionId: string;
  content: string;
  mediaUrl?: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: Date;
}
```

---

## API 設計

### 認證
```
POST   /api/auth/register     # 註冊
POST   /api/auth/login        # 登入
POST   /api/auth/logout       # 登出
GET    /api/auth/me           # 當前用戶
```

### 地圖/事件
```
GET    /api/incidents         # 獲取附近事件 (nearby)
POST   /api/incidents         # 舉報事件
GET    /api/incidents/:id     # 事件詳情
POST   /api/incidents/:id/upvote  # 點讚
```

### 優惠
```
GET    /api/deals             # 附近優惠 (nearby)
GET    /api/deals/:id         # 優惠詳情
```

### 活動
```
GET    /api/events            # 附近活動 (nearby)
GET    /api/events/:id         # 活動詳情
POST   /api/events/:id/interested  # 標記感興趣
```

### 討論區
```
GET    /api/discussions       # 討論列表 (district, sort)
POST   /api/discussions       # 發帖
GET    /api/discussions/:id    # 帖子詳情
POST   /api/discussions/:id/comments  # 留言
POST   /api/discussions/:id/upvote     # 點讚
POST   /api/media/upload      # 上傳媒體
```

### 交通
```
GET    /api/transport/mtr-status    # MTR 狀態
GET    /api/transport/bus-arrival    # 巴士到站 (stop_id)
```

### 天氣
```
GET    /api/weather/aqhi       # AQHI 18區
GET    /api/weather/forecast   # 7日預測
```

---

## WebSocket 事件

### 客戶端 → 服務器
```
join:district     # 加入地區房間
leave:district    # 離開地區房間
subscribe:incident # 訂閱事件更新
```

### 服務器 → 客戶端
```
incident:new      # 新事件
incident:update   # 事件更新
incident:upvote   # 事件被讚
discussion:new     # 新帖
discussion:update # 帖更新
weather:alert     # 天氣警告
transport:update  # 交通更新
```

---

## 文件上傳

### 支持格式
| 類型 | MIME | 大小 |
|------|------|------|
| 圖片 | image/jpeg, image/png, image/gif | 10MB |
| 視頻 | video/mp4, video/quicktime | 50MB |
| 音頻 | audio/m4a, audio/mpeg, audio/wav | 10MB |

### 上傳流程
1. 客戶端請求預簽名 URL
2. 直接上傳到 Storage
3. 返回 public URL

---

## 自動化功能

### 智能推送
| 觸發條件 | 推送內容 |
|---------|---------|
| 用戶進入新區域 | 該區最新優惠 |
| 活動開始前 1 小時 | 活動提醒 |
| 附近交通事故 | 繞路建議 |
| 天氣突變 | 天氣警告 |

### 數據刷新策略
| 數據類型 | 刷新頻率 |
|---------|---------|
| 地圖標記 | 實時 (WebSocket) |
| 優惠 | 5 分鐘 |
| 活動 | 10 分鐘 |
| 討論區 | 下拉刷新 |
| 天氣 | 30 分鐘 |
| MTR 狀態 | 1 分鐘 |

---

## 部署架構

```
┌─────────────────┐
│   iOS / Android │
│    (Expo App)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Firebase Auth  │
│  Firebase FCM   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloud Functions │
│  (Node.js API)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Firestore DB    │
│ Cloud Storage   │
└─────────────────┘
```

---

## 開發階段

### Phase 1 ✅ (已完成)
- [x] 項目初始化
- [x] 基本 UI 框架
- [x] 三頁面導航
- [x] Mock 數據
- [x] 翻譯系統

### Phase 2 🔧 (下一步)
- [x] UI 細節優化
- [x] 口語化翻譯
- [x] 距離排序
- [ ] MapLibre 地圖 SDK
- [ ] 真實 API 整合

### Phase 3 📋 (規劃中)
- [ ] Firebase 認證
- [ ] 後端 API
- [ ] WebSocket 實時
- [ ] 媒體上傳

### Phase 4 🚀 (發布)
- [ ] App Store 審核
- [ ] Google Play 審核
- [ ] 正式發布
