hack4pwd-ai-extension/
├── app/
│   ├── api/
│   │   ├── speech-to-text/
│   │   │   └── route.ts
│   │   ├── natural-language-understanding/
│   │   │   └── route.ts
│   │   ├── text-to-speech/
│   │   │   └── route.ts
│   │   ├── vision/
│   │   │   └── route.ts
│   │   └── user/
│   │       ├── settings/
│   │       │   └── route.ts
│   │       └── profile/
│   │           └── route.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AccessibilityControls.tsx
│   │   ├── SettingsForm.tsx
│   │   └── AdminDashboard/
│   │       ├── UserList.tsx
│   │       ├── AnalyticsChart.tsx
│   │       └── ModelPerformance.tsx
│   ├── models/
│   │   ├── speechToText.ts
│   │   ├── naturalLanguageUnderstanding.ts
│   │   ├── textToSpeech.ts
│   │   └── vision.ts
│   ├── utils/
│   │   ├── azureConfig.ts
│   │   ├── helperFunctions.ts
│   │   └── auth.ts
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   └── popup/
│       ├── popup.html
│       ├── popup.js
│       └── popup.css
├── public/
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── assets/
├── styles/
│   └── globals.css
├── lib/
│   └── prisma.ts
├── .env
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md