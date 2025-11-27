# Witcher 3 Command Center

A "Pro" interactive checklist and roadmap for **The Witcher 3: Wild Hunt**, designed to help you track missable quests, Gwent cards, and achievements without spoilers.

## Tech Stack
- **React** + **Vite** (Fast frontend)
- **Tailwind CSS** (Styling)
- **Leaflet** (Interactive Maps)
- **Google Gemini** (Optional AI features)

## How to Run Locally

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Setup Environment (Optional)**
    If you want the AI features ("Vesemir" advice), copy `.env.example` to `.env` and add your Google Gemini API key.
    ```bash
    cp .env.example .env
    ```

3.  **Start the App**
    ```bash
    npm run dev
    ```
    Open the link shown in your terminal (usually `http://localhost:5173`).
