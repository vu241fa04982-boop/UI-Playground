# UI Playground 🎨⚡

> **Design UI without guessing CSS.**  
> Visually experiment with UI properties, see changes instantly, generate clean CSS / SCSS / Tailwind, and save your designs.

A complete, production-quality, responsive developer tool and component laboratory built with **React**, **TypeScript**, and **Vite**, precisely following the futuristic dark developer-tool aesthetic from the design reference.

---

## ✨ Features

- **Futuristic Dark Developer Aesthetic**: Deep navy backgrounds (`#020817`, `#07152B`, `#0B1D3A`), crisp glowing cyan, purple (`#7C3AED`, `#8B5CF6`) and pink accents (`#EC4899`), glass-like panels, and subtle neon glows.
- **Three-Column Studio Workspace**:
  - **Left**: Comprehensive Style Controls & 26+ Component Category Library.
  - **Center**: Live interactive Canvas Preview with simulated **Desktop**, **Tablet**, and **Mobile** device viewports.
  - **Right**: Real-time **Generated CSS**, **SCSS** (nested), and **Tailwind CSS** code editor with line numbers and one-click copy.
- **Comprehensive Control Suite**:
  - **Layout & Sizing**: Width, height, max/min dimensions, margins, padding (0–200px+), gap, flex direction, and alignment.
  - **Borders & Corners**: Linked or independent 4-corner controls (Top-Left, Top-Right, Bottom-Right, Bottom-Left) supporting 0 to 200px+, custom widths, border styles, and colors.
  - **Colors & Gradients**: Solid colors, Linear gradients (custom degree angles), Radial gradients, opacity slider, and live color pickers with hex inputs.
  - **Typography**: Font family selector (Inter, Plus Jakarta Sans, Roboto, Poppins, Fira Code, JetBrains Mono, etc.), font sizes up to 72px+, weights, letter spacing, alignment, and transforms.
  - **Rich Shadows**: Multi-axis X/Y offsets, blur spread, shadow color, and inset/outer toggle.
  - **Transforms & 3D**: Real-time Translate X/Y, Scale (50%–150%), Rotate (-180° to 180°), and Skew.
  - **Interactive Hover States**: Hover scale, hover lift (Translate Y), hover border highlight, hover shadow glow, and real-time cursor reaction in preview.
  - **Transitions & CSS Animations**: Presets for *Fade In*, *Slide Up*, *Slide Down*, *Bounce*, *Pulse*, *Float*, *Glow*, *Shake*, and *Rotate 360°* with duration, iteration counts, and generated `@keyframes`.
  - **Editable Content**: Live inline text editing for headings, descriptions, button labels, and badges.
- **26+ Component Library**:
  - *Basic*: Card, Button, Input, Textarea, Select, Checkbox, Radio, Toggle Switch.
  - *UI*: Navbar, Badge, Alert, Modal, Tooltip, Dropdown, Tabs, Accordion, Avatar, Progress Bar, Notification Toast.
  - *Advanced*: Profile Card, Login Form, Pricing Card, Hero Section, Image Card, Loading Spinner, Skeleton Loader.
- **Local Persistence & Saved Designs**:
  - Save custom configurations to `localStorage` under `ui-playground-designs`.
  - Dedicated `/saved` page with miniature visual previews, instant reload into Playground, and delete management.
  - Seeded starter templates included for quick inspiration.
- **Dark & Light Mode**:
  - Built-in theme engine with custom light theme palette and localStorage persistence.
- **Frontend Authentication Screens**:
  - Dedicated `/login` and `/signup` routes with password visibility toggle, matching the dark futuristic theme, ready for future Supabase connection.

---

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser:
   ```
   http://localhost:3000
   ```

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── common/             # ThemeToggle, Toast, Modal, SliderInput, ColorPicker
│   ├── icons/              # Crisp vector SVGs (waveform logo, devices, tools)
│   ├── layout/             # Navbar, Footer
│   └── playground/         # StyleControls, LivePreview, ComponentRenderer,
│                           # CodeEditor, DeviceSelector, ComponentSelector,
│                           # ExploreComponentsBar, SaveDesignModal
├── context/
│   ├── ThemeContext.tsx    # Dark/Light theme state
│   └── PlaygroundContext.tsx # Central design state and controls
├── data/
│   ├── initialComponents.ts# Presets and metadata for 26 components
│   ├── fontFamilies.ts     # Curated developer fonts
│   └── animationPresets.ts # CSS keyframes
├── pages/
│   ├── HomePage.tsx        # Hero showcase, interactive widget, workflow steps
│   ├── PlaygroundPage.tsx  # Main 3-column studio matching reference image
│   ├── SavedPage.tsx       # Saved designs gallery with visual cards
│   ├── LoginPage.tsx       # Styled authentication screen
│   └── SignupPage.tsx      # Styled registration screen
├── types/
│   └── playground.ts       # TypeScript interfaces
├── utils/
│   ├── cssGenerator.ts     # CSS compiler with media queries & keyframes
│   ├── scssGenerator.ts    # SCSS nested compiler
│   ├── tailwindGenerator.ts# Tailwind utility generator
│   └── storage.ts          # localStorage persistence
├── App.tsx                 # Route configuration
├── main.tsx                # Application bootstrap
└── index.css               # Theme styling and animations
```
