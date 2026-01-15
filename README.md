# D-MIND Web

![D-MIND Logo](public/icon-512.png)

**D-MIND** (Disaster Management & Intelligence Network Dashboard) เป็นระบบเว็บแอปพลิเคชันสำหรับติดตามและจัดการภัยพิบัติในประเทศไทย พัฒนาด้วย React และ TypeScript

## ✨ Features

- 🗺️ **แผนที่แบบ Real-time** - แสดงพื้นที่เสี่ยงภัยด้วย MapLibre GL JS
- 🌧️ **ติดตามสภาพอากาศ** - ข้อมูลจากกรมอุตุนิยมวิทยา, Open-Meteo, RainViewer
- 🌐 **แผ่นดินไหว** - ข้อมูลแผ่นดินไหวแบบ Real-time จาก USGS
- 📰 **ข่าวสารภัยพิบัติ** - อัปเดตข่าวสารและคู่มือฉุกเฉิน
- 🔔 **ระบบแจ้งเตือน** - แจ้งเตือนภัยพิบัติตามตำแหน่ง
- 📱 **Responsive Design** - รองรับทุกขนาดหน้าจอ

## 🛠️ Technologies

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Maps**: MapLibre GL JS
- **Data Fetching**: TanStack Query
- **State Management**: Zustand
- **Mobile**: Capacitor (cross-platform)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/kchayta32/d-mind-web.git

# Navigate to project directory
cd d-mind-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/     # React components
│   ├── articles/   # ข่าวสารและบทความ
│   ├── emergency-manual/  # คู่มือฉุกเฉิน
│   ├── map/        # Map components
│   └── ui/         # shadcn/ui components
├── hooks/          # Custom React hooks
├── lib/            # Utilities และ API clients
├── pages/          # Page components
└── stores/         # Zustand stores
```

## 📊 Data Sources

| แหล่งข้อมูล | ประเภท | ลิงก์ |
|------------|--------|------|
| กรมอุตุนิยมวิทยา | พยากรณ์อากาศ | [tmd.go.th](https://www.tmd.go.th) |
| Open-Meteo | Weather API | [open-meteo.com](https://open-meteo.com) |
| RainViewer | Radar ฝน | [rainviewer.com](https://www.rainviewer.com) |
| USGS | แผ่นดินไหว | [usgs.gov](https://earthquake.usgs.gov) |
| OpenStreetMap | แผนที่พื้นฐาน | [openstreetmap.org](https://www.openstreetmap.org) |

## 📝 License

This project is developed for educational purposes.

## 👥 Contributors

- **kchayta32** - Developer

---

Made with ❤️ for Thailand Disaster Management
