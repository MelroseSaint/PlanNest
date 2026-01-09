# Plannest - Digital Planning Platform

**Plannest** (formerly Stars Binder) is a comprehensive digital planning tool designed for grade school and daycare teachers. It streamlines the creation of lesson plans, newsletters, and administrative documentation while providing AI-assisted activity suggestions.

## Recent Updates
- **SEO & Branding:** Implemented strict Google Search compliance (JSON-LD Organization schema, canonical tags, clean metadata).
- **Bug Fix:** Removed conflicting `importmap` to resolve React version mismatch and application crash.
- **Identity:** Finalized "Plannest" branding across all meta signals.

## Features

### 📅 Weekly Lesson Planning
- **Multi-Age Support:** Create plans for Infants, Toddlers, Preschool, Pre-K, and Grade School.
- **Detailed Activities:** Log activity titles, objectives (compliance), materials, and descriptions.
- **Reflections:** Add daily notes and pedagogical reflections.
- **Templates:** Save days or entire weeks as templates for quick reuse.

### 🤖 AI Integration
- **Activity Suggestions:** Uses Google Gemini API to generate age-appropriate activity ideas based on themes and available materials.
- **Offline Fallback:** Includes a robust set of built-in activity templates that work even without an internet connection.
- **Safe & Secure:** AI content is treated as suggestions, keeping the human teacher in control.

### 📰 Newsletters & Documents
- **Newsletter Editor:** Create monthly newsletters with "What's Going On", "Important Dates", and "Reminders".
- **Form Management:** Manage standard forms like Incident Reports, Substitute Instructions, and Licensing Checklists.
- **Print Ready:** Specialized print styles for professional hard copies.

### 💾 Data & Security
- **Local Storage:** All data stays on your device (LocalStorage).
- **Backup & Restore:** Export your entire binder to a JSON file for backup or transfer to another device.
- **Privacy First:** No sensitive child data is sent to the cloud.

## Project Structure

This project follows a separation of concerns pattern to ensure AI-generated content does not overwrite hand-coded UI components.

```
/
├── components/       # React UI components (Hand-coded, protected)
├── services/         # Business logic & API integration
│   ├── geminiService.ts   # Google GenAI integration
│   └── storageService.ts  # LocalStorage wrapper
├── styles/           # Global styles and Tailwind config
├── suggestions/      # Designated output folder for AI-generated content
├── types.ts          # TypeScript interfaces
├── App.tsx           # Main application controller
└── index.tsx         # Entry point
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key (optional, for AI features)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_API_KEY=your_google_gemini_api_key_here
   ```
   *Note: If no key is provided, the app will run in "Offline Mode" using built-in templates.*

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google GenAI SDK (`@google/genai`)
- **Persistence:** Browser LocalStorage

## Disclaimers

- **Educational Aid:** This tool is for planning purposes only and does not certify regulatory compliance.
- **Data Privacy:** Users should not enter sensitive medical or PII (Personally Identifiable Information) regarding children.
- **AI Content:** All AI-generated suggestions should be reviewed by a qualified professional before implementation.