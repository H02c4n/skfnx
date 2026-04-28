frontend/
├── public/
│   └── locales/
│       ├── en/common.json
│       ├── sv/common.json
│       └── tr/common.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── providers.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Loader.tsx
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventGrid.tsx
│   │   │   ├── CalendarPreview.tsx
│   │   │   └── EventFilters.tsx
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   └── BlogFilters.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── UpcomingEvents.tsx
│   │   │   ├── AboutPreview.tsx
│   │   │   └── BoardSection.tsx
│   │   └── dashboard/
│   │       ├── ProfileInfo.tsx
│   │       ├── RegisteredEvents.tsx
│   │       └── MembershipStatus.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSettings.ts
│   │   └── useEvents.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── .env.local
└── package.json