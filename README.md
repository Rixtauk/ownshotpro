# OwnShot MVP

AI-powered image enhancement using Google Gemini API.

## Features

- Drag & drop image upload (PNG, JPEG, WebP - max 8MB)
- 4 enhancement presets: Interior, Product, People, General
- Configurable aspect ratio: Match Original, 1:1, 4:5, 16:9, 3:2, 9:16
- Output sizes: 1K, 2K, 4K
- Enhancement strength slider (0-100%)
- Strict preservation mode to prevent object addition/removal
- Local download of enhanced images

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with your Gemini API key:

```bash
GEMINI_API_KEY=your_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Google Gemini API (@google/genai)
- react-dropzone

## Project Structure

```
├── app/
│   ├── api/enhance/route.ts  # Image enhancement API endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── Dropzone.tsx          # Drag/drop file upload
│   ├── OptionsForm.tsx       # Enhancement options form
│   ├── BeforeAfter.tsx       # Image comparison view
│   └── OutputPanel.tsx       # Generate button & download
├── lib/
│   ├── gemini.ts             # Gemini API wrapper
│   ├── presets.ts            # Enhancement presets
│   ├── promptBuilder.ts      # Dynamic prompt generation
│   ├── validators.ts         # File validation
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript types
```

## API

### POST /api/enhance

Enhances an uploaded image using Gemini AI.

**Request (FormData):**
- `file`: Image file (required)
- `preset`: Enhancement preset (interior/product/people/general)
- `aspectRatio`: Output aspect ratio (match/1:1/4:5/16:9/3:2/9:16)
- `imageSize`: Output size (1K/2K/4K)
- `strength`: Enhancement strength (0-100)
- `strictPreservation`: Prevent object changes (true/false)

**Response:**
- Success: Binary PNG image with `Content-Type: image/png`
- Error: JSON with `error` field
