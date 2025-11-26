# Witcher 3 Command Center

An interactive roadmap and checklist for The Witcher 3: Wild Hunt, built with React, Vite, and Tailwind CSS.

## Features
- **Interactive Checklist**: Track your progress through missable quests, Gwent cards, and achievements.
- **Map Integration**: View locations directly within the app.
- **Gemini AI Integration**: Consult "Vesemir" or the "Codex" for advice and lore (requires API Key).
- **Responsive Design**: Works on desktop and mobile.

## Getting Started

### Prerequisites
- Node.js installed on your machine.

### Installation

1. Clone the repository (or download the source).
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. (Optional) Add your Google Gemini API Key to `.env` if you want to use the AI features.
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

## Deployment

### Cloudflare Pages

This project is ready to be deployed on [Cloudflare Pages](https://pages.cloudflare.com/) for free.

1. Push this repository to GitHub.
2. Log in to the Cloudflare Dashboard and go to **Pages**.
3. Click **Create a project** > **Connect to Git**.
4. Select your repository.
5. In **Build settings**, use the following configuration:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**.

Your app will be live on a `*.pages.dev` domain!

## Contributing
Feel free to open issues or submit pull requests!
