# Project Architecture & Logic Documentation

This document provides a detailed overview of the Portfolio Website's architecture, logic, and structure to assist developers and AI assistants in maintaining and extending the codebase.

## 1. Tech Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS for utility-first styling and Vanilla CSS for custom components.
- **Animations**: Framer Motion for page transitions and component animations.
- **3D Interaction**: Spline (@splinetool/react-spline) for the interactive Whobee robot.
- **Icons**: Lucide-React.

## 2. Project Structure
```text
portfolio_v6/
├── src/
│   ├── components/       # Reusable UI components (Footer, SideNav, Robot, etc.)
│   ├── data/             # Static data files (projects, certs, achievements)
│   ├── pages/            # Main page sections and detail views
│   │   ├── SinglePage.tsx   # The main scrolling landing page
│   │   ├── ProjectDetailPage.tsx
│   │   ├── CertDetailPage.tsx
│   │   └── AchievementDetailPage.tsx
│   ├── App.tsx           # Root component, handles global state and routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles and design system tokens
└── public/               # Static assets (images, music)
```

## 3. Core Logic & State Management

### A. Routing & Navigation
The app uses a "Single Page Detail View" pattern. Instead of a traditional router, `App.tsx` manages a `detail` state:
- `detail === null`: Renders the `SinglePage` component (home sections).
- `detail !== null`: Renders the corresponding Detail Page component.
- **Transitions**: Managed by `AnimatePresence` in `App.tsx` with `mode="wait"` to ensure clean unmounting and mounting of pages.

### B. Audio System
- **Singleton Audio**: Background music is managed via a `useRef` in `App.tsx` to prevent multiple instances.
- **User Activation**: Playback starts on the first user interaction (click/touch) to satisfy browser autoplay policies.
- **Music Toggle**: Managed via `toggleMusic` callback passed to `HudOverlay`.

### C. Whobee 3D Robot
- Located in `src/components/RobotWhobee.tsx`.
- Uses a Spline scene URL. It is embedded in the `Footer` and becomes interactive on mouse hover/movement.

## 4. Version History & Changelog

### v1.0.0 (Current)
- **Initial Build**: Integrated React, Tailwind, and Framer Motion.
- **Bug Fix (Media Page)**: Resolved "vanishing content" issue by moving `AnimatePresence` to the root `App.tsx` and using stable keys.
- **Bug Fix (Audio)**: Fixed "double sound" issue by refactoring `useEffect` to handle `StrictMode` double-mounting and using a persistent `audioRef`.
- **Feature (Whobee Robot)**: Replaced CSS robot with Spline-based 3D Whobee robot.
- **Feature (Documentation)**: Added `ARCH_DOC.md` for AI/developer guidance.

## 5. Maintenance Guide for AI
- **Adding Projects**: Update `src/data/projects.ts`. The UI will automatically generate cards and detail pages.
- **Adding Sounds**: Ensure sounds are added to `public/assets` and referenced correctly in `App.tsx`.
- **Styling Changes**: Use CSS variables in `index.css` for global theme updates (colors, fonts).
- **Z-Index Convention**:
  - `Background`: 0
  - `Main Content`: 10
  - `SideNav/Overlay`: 950
  - `HudOverlay`: 1000
  - `Cursor`: 99999

## 6. Known Issues & Future Work
- **Performance**: 3D Spline scene might be heavy on lower-end mobile devices; consider adding a static fallback if performance drops.
- **SFX Toggle**: Current UI only toggles Music; adding a separate SFX toggle in `HudOverlay` is a planned improvement.
