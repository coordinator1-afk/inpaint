<img width="1280" alt="app" src="https://github.com/user-attachments/assets/f25811a5-a073-4b01-963e-880b5688c8e2" />

<p align="center">
    <h1 align="center">🎨 ArchLab POC – AI Interior Studio</h1>
    <p align="center">AI-powered interior design tool for architects & designers</p>
</p>

<p align="center">
  <a href="https://inpaint-one.vercel.app/">
    <img src="https://img.shields.io/badge/🌐-Live%20Demo-blue?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="#-quick-start">
    <img src="https://img.shields.io/badge/🚀-Quick%20Start-green?style=for-the-badge" alt="Quick Start">
  </a>
</p>

---

## ✨ What is ArchLab POC?

A full-featured AI interior design studio with a **3-step professional workflow**:

| Step | Name | Description |
|------|------|-------------|
| **B1** | **AI Generate Concept** | Upload sketch → AI renders photorealistic interior in 15s–25s |
| **B2** | **Layer Blend** | Mix AI render with original sketch to preserve structural accuracy |
| **B3** | **AI Inpaint** | Mask specific areas → AI replaces materials (sofa, cabinets, flooring) |

### 🔥 Key Features

- **Dual-Engine AI**: `Model Flash` (15s, 1 credit) for rapid concepts, `Model Pro` (45s, 5 credits) for photorealistic quality
- **Before/After Comparison**: Interactive slider to compare sketch vs AI render
- **Project Manager**: Save, organize, and version control your design projects
- **History Tree**: Filter and restore any previous render state (B1/B2/B3)
- **Material Inpainting**: Change sofa leather, wood cabinets, marble flooring with AI masking
- **50 Free Credits**: New users get 50 credits to try all features
- **Registration → Email Notification**: New signups trigger email alerts to the team

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm

### 1. Clone & Install

```bash
git clone https://github.com/coordinator1-afk/inpaint.git
cd inpaint
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Run Development Server

```bash
# Run on port 5050
npm run dev

# Or manually with custom port
npx vite --port=5050 --host=0.0.0.0
```

Open **http://localhost:5050** in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx    # Public landing page with signup/login
│   └── Studio.tsx         # Main 3-step interior design workspace
├── App.tsx                # Router (Landing ↔ Studio)
├── types.ts               # TypeScript interfaces
├── index.css              # Tailwind CSS + global styles
└── main.tsx               # React entry point
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Animations | Framer Motion |
| AI Engine | Google GenAI (Gemini) |
| Email | FormSubmit.co (client-side) |

---

## 📸 Features Preview

### 🖌️ B1 – AI Generate Concept
Upload your sketch, select mood/lighting, write a prompt, and AI renders a photorealistic concept in seconds.

### 🔀 B2 – Layer Blend
Adjust opacity to mix AI render with original sketch. Use eraser brush to reveal structural elements (beams, columns, windows).

### 🎯 B3 – AI Inpaint
Paint a red mask over furniture/materials, describe the change, and AI seamlessly replaces just that area.

---

## 📜 License

MIT

---

<p align="center">
  Built with ❤️ for architects & interior designers
</p>
