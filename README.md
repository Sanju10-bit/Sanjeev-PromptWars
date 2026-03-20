# Universal Context Bridge

A production-ready, full-stack web application powered by Google Gemini that acts as a universal bridge between unstructured human input and structured, actionable outcomes for societal benefit.

## Features Let's you

- **Multi-modal Input**: Accept text descriptions and upload evidence (images).
- **Intelligent Processing**: Automatically extracts intent, urgency, categories, and actionable items.
- **Action Engine**: Generates step-by-step guidance based on AI context.
- **Modern UI**: A sleek, dark-mode accessible interface for rapid parsing of information.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Vanilla CSS
- **Backend**: Node.js + Express + TypeScript
- **AI Core**: Google Gemini API (`gemini-2.5-flash` model for multi-modal reasoning and JSON schema output)

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Google Gemini API Key

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your Gemini API key to `.env`: `GEMINI_API_KEY=your_key_here`
4. Start the backend DEV server:
   ```bash
   npm run dev
   ```
   The API will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The UI will run on `http://localhost:5173`.

## API Documentation

### POST `/api/process`
Accepts multi-modal data and returns structured JSON insights.

**Request (multipart/form-data):**
- `textContext` (string, optional) - Free-form text input.
- `image` (file, optional) - Image file upload.

**Response (JSON):**
```json
{
  "intent": "Seek emergency medical assistance",
  "category": "Emergency",
  "urgency_level": "CRITICAL",
  "key_entities": ["Highway 101", "multiple cars", "severe accident"],
  "recommended_actions": ["Call 911 immediately", "Do not move injured parties unless in danger of fire", "Provide exact cross-street to dispatcher"],
  "confidence_score": "98%",
  "sources": ["General Emergency Guidelines"]
}
```

## Testing Requirements
The implementation is structured for extensibility. You can add Jest/Cypress later for E2E tests, the backend functions like `processInput` are modular and easy to unit test.
