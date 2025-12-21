```bash
pdf-chat-app/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home (Upload + Chat)
│
│   ├── api/                      # Server APIs
│   │   ├── upload/
│   │   │   └── route.ts          # PDF ingestion (parse, chunk, embed)
│   │   │
│   │   ├── chat/
│   │   │   └── route.ts          # RAG chat (query + response)
│   │   │
│   │   └── health/
│   │       └── route.ts          # (Optional) Health check
│   │
│   ├── globals.css               # Global styles
│   └── favicon.ico
│
├── components/                   # UI Components (shadcn-based)
│   ├── chat/
│   │   ├── Chat.tsx              # Main chat container
│   │   ├── MessageList.tsx       # Messages wrapper
│   │   ├── MessageBubble.tsx     # User / AI message UI
│   │   └── ChatInput.tsx         # Input + Send button
│   │
│   ├── upload/
│   │   └── UploadPDF.tsx         # PDF upload component
│   │
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── textarea.tsx
│       └── scroll-area.tsx
│
├── lib/                          # Core logic (no UI)
│   ├── openai.ts                 # OpenAI client
│   ├── pinecone.ts               # Pinecone client
│   ├── pdf.ts                    # PDF parsing helpers
│   ├── chunk.ts                  # Text chunking logic
│   └── embeddings.ts             # Embedding helpers
│
├── types/                        # TypeScript types
│   ├── chat.ts                   # Chat message types
│   └── pdf.ts                    # PDF metadata types
│
├── utils/                        # Small utilities
│   ├── constants.ts              # Models, chunk size, topK
│   └── validators.ts             # File size / type validation
│
├── public/                       # Static assets
│   └── logo.png
│
├── .env.local                    # Secrets
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```
