voicey-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── stt/
│   │   │   │   └── route.ts
│   │   │   ├── tts/
│   │   │   │   └── route.ts
│   │   │   ├── vision/
│   │   │   │   └── route.ts
│   │   │   └── nlu/
│   │   │       └── route.ts
│   │   ├── (auth)/   -- maybe later
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/ -- maybe later
│   │   │   └── page.tsx
│   │   ├── settings/ -- maybe later
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── VoiceAssistant.tsx
│   │   ├── WakeWordDetector.tsx
│   │   └── WebPageAnalyzer.tsx
│   ├── hooks/
│   │   ├── useAzureSpeech.ts
│   │   ├── useAzureVision.ts
│   │   └── useWebSockets.ts
│   ├── lib/
│   │   ├── azure/
│   │   │   ├── speechClient.ts
│   │   │   └── visionClient.ts
│   │   ├── prisma.ts
│   │   └── openai.ts
│   ├── utils/
│   │   ├── audio.ts
│   │   ├── domManipulation.ts
│   │   └── imageProcessing.ts
│   └── types/
│       └── index.d.ts
├── public/
│   ├── models/
│   │   └── wake-word-model.json
│   └── fonts/
├── prisma/
│   └── schema.prisma
├── tests/
│   ├── unit/
│   └── integration/
├── extension/
│   ├── src/
│   │   ├── content-scripts/
│   │   │   └── index.ts
│   │   ├── background/
│   │   │   └── index.ts
│   │   └── popup/
│   │       ├── index.html
│   │       └── index.ts
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/
│   └── webpack.config.js
├── scripts/
│   └── build-extension.js
├── .env
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md