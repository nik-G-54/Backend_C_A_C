# VideoTube Backend — Complete Documentation

> **Project**: VideoTube Backend  
> **Stack**: Node.js · Express 5 · MongoDB (Mongoose) · Socket.io · Cloudinary · Groq AI (LLaMA 3.3) · OpenAI (Whisper + Embeddings) · PDFKit  
> **Entry Point**: `src/index.js`  
> **Port**: `4000` (from `.env`)

---

## Table of Contents

1. [Product Requirements Document (PRD)](#1-product-requirements-document-prd)
2. [System Architecture](#2-system-architecture)
3. [API Reference](#3-api-reference)
4. [Database Schema (MongoDB)](#4-database-schema-mongodb)
5. [Authentication Flow](#5-authentication-flow)
6. [AI Pipeline](#6-ai-pipeline)
7. [Real-time Chat (Socket.io)](#7-real-time-chat-socketio)
8. [Middleware Layer](#8-middleware-layer)
9. [Utilities](#9-utilities)
10. [Environment Variables](#10-environment-variables)
11. [Known Bugs & Issues](#11-known-bugs--issues)
12. [Dependencies](#12-dependencies)
13. [How to Run](#13-how-to-run)

---

## 1. Product Requirements Document (PRD)

### 1.1 Vision
VideoTube is a **YouTube-like video-sharing platform** enhanced with an **AI-powered learning assistant**. Users can upload, watch, like, comment on, and subscribe to video channels. A unique differentiator is the AI doubt-resolution system that lets students ask questions — either general or based on a specific video's transcript — and receive AI-generated answers.

### 1.2 Core Features

| # | Feature | Status |
|---|---------|--------|
| 1 | User Registration with Avatar & Cover Image | ✅ Implemented |
| 2 | Login / Logout with JWT (Access + Refresh Tokens) | ✅ Implemented |
| 3 | Token Refresh Flow | ✅ Implemented |
| 4 | Password Change | ✅ Implemented |
| 5 | Profile Update (name, email, avatar, cover image) | ✅ Implemented |
| 6 | Channel Profile with Subscriber Count | ✅ Implemented |
| 7 | Watch History | ✅ Implemented |
| 8 | Video Upload (Video + Thumbnail to Cloudinary) | ✅ Implemented |
| 9 | Video Feed (paginated, sorted by newest) | ✅ Implemented |
| 10 | Watch Video (auto-increment views) | ✅ Implemented |
| 11 | Like / Unlike Toggle | ✅ Implemented |
| 12 | Comment System (add, list, delete) | ✅ Implemented |
| 13 | Subscribe / Unsubscribe Toggle | ✅ Implemented |
| 14 | AI Doubt Resolution (general questions) | ✅ Implemented |
| 15 | AI Doubt History | ✅ Implemented |
| 16 | PDF Notes Generation from Doubt History | 🔧 Has bugs |
| 17 | Video-specific AI Q&A (transcript-based RAG) | 🔧 Has bugs |
| 18 | Real-time Live Chat per Video (Socket.io) | 🔧 Partial |
| 19 | Audio Extraction + Transcript Generation | 🔧 Services exist, not wired |
| 20 | Embedding-based Semantic Search (RAG) | 🔧 Services exist, not wired |

### 1.3 Target Users
- **Content Creators** — upload educational/general videos
- **Students / Viewers** — watch videos, ask AI questions, get PDF study notes
- **Community** — interact via comments and live chat

---

## 2. System Architecture

### 2.1 High-Level Architecture

```mermaid
graph TB
    Client["Client (Browser / Mobile)"]
    
    subgraph Server["Node.js Server"]
        Express["Express 5 App"]
        SocketIO["Socket.io Server"]
        
        subgraph MW["Middleware Layer"]
            Auth["JWT Auth"]
            Multer["Multer (File Upload)"]
            RateLimiter["Rate Limiter"]
            Helmet["Helmet (Security)"]
            CORS["CORS"]
        end
        
        subgraph Routes["Route Layer"]
            UserRoutes["/api/v1/users"]
            VideoRoutes["/api/v1/video"]
            LikeRoutes["/api/v1/likes"]
            CommentRoutes["/api/v1/commnets"]
            SubRoutes["/api/v1/subscriptions"]
            ChatRoutes["/api/v1/chat"]
            AIRoutes["/api/v1/ai"]
        end
        
        subgraph Controllers["Controller Layer"]
            UserCtrl["user.controller"]
            VideoCtrl["video.controller"]
            LikeCtrl["like.controller"]
            CommentCtrl["comment.controller"]
            SubCtrl["subscription.controller"]
            ChatCtrl["chat.controller"]
            AICtrl["ai.controller"]
        end
        
        subgraph Services["Service Layer"]
            AIService["ai.service (Groq LLaMA)"]
            AudioService["audio.service (FFmpeg)"]
            TranscriptService["transcript.service (Whisper)"]
            EmbeddingService["embedding.service (OpenAI)"]
            PDFService["pdf.service (PDFKit)"]
        end
    end
    
    MongoDB["MongoDB Atlas"]
    Cloudinary["Cloudinary CDN"]
    GroqAPI["Groq API"]
    OpenAIAPI["OpenAI API"]
    
    Client --> Express
    Client --> SocketIO
    Express --> MW --> Routes --> Controllers
    Controllers --> Services
    Controllers --> MongoDB
    Controllers --> Cloudinary
    AIService --> GroqAPI
    TranscriptService --> OpenAIAPI
    EmbeddingService --> OpenAIAPI
```

### 2.2 Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant RL as Rate Limiter
    participant H as Helmet + CORS
    participant R as Router
    participant JWT as JWT Auth Middleware
    participant Ctrl as Controller
    participant SVC as Service
    participant DB as MongoDB
    participant CDN as Cloudinary

    C->>RL: HTTP Request
    RL->>H: Pass (if under limit)
    H->>R: Route matching
    R->>JWT: Protected route check
    JWT->>JWT: Verify access token
    JWT->>DB: Fetch user by token._id
    JWT->>Ctrl: req.user attached
    Ctrl->>SVC: Business logic
    Ctrl->>DB: CRUD operations
    Ctrl->>CDN: Upload/delete files
    Ctrl->>C: ApiResponse JSON
```

### 2.3 Directory Structure

```
Backend/
├── .env                          # Environment variables
├── constant.js                   # DB_NAME = "videotube"
├── package.json                  # Dependencies & scripts
├── public/                       # Temp file storage (multer destination)
├── src/
│   ├── index.js                  # Entry: HTTP server + Socket.io + DB connect
│   ├── app.js                    # Express app config + route mounting
│   ├── db/index.js               # MongoDB connection via Mongoose
│   ├── Socket.io/socket.js       # Real-time chat socket events
│   ├── controller/               # 7 controller files
│   │   ├── ai.controller.js      # AI doubt resolution & PDF notes
│   │   ├── chat.controller.js    # Live chat message retrieval
│   │   ├── comment.controller.js # Add, get, delete comments
│   │   ├── like.controller.js    # Toggle like/unlike
│   │   ├── subscription.controller.js  # Toggle subscribe/unsubscribe
│   │   ├── user.controller.js    # Auth, profile, channel, watch history
│   │   └── video.controller.js   # Upload, feed, watch video
│   ├── models/                   # 8 Mongoose model files
│   │   ├── chatmessage.model.js  # Live chat messages
│   │   ├── comment.model.js      # Video comments
│   │   ├── dout.model.js         # AI doubt Q&A records
│   │   ├── like.model.js         # Video likes
│   │   ├── subscription.model.js # Channel subscriptions
│   │   ├── transcriptChunk.model.js  # Video transcript chunks + embeddings
│   │   ├── user.model.js         # Users with auth tokens
│   │   └── video.model.js        # Videos with metadata
│   ├── route/                    # 7 route files
│   │   ├── ai.route.js           # /api/v1/ai
│   │   ├── chat.route.js         # /api/v1/chat
│   │   ├── comment.route.js      # /api/v1/commnets
│   │   ├── like.route.js         # /api/v1/likes
│   │   ├── subscribe.route.js    # /api/v1/subscriptions
│   │   ├── user.route.js         # /api/v1/users
│   │   └── video.route.js        # /api/v1/video
│   ├── service/                  # 5 service files
│   │   ├── ai.service.js         # Groq LLaMA 3.3 integration
│   │   ├── audio.service.js      # FFmpeg audio extraction
│   │   ├── embedding.service.js  # OpenAI text embeddings
│   │   ├── pdf.service.js        # PDFKit note generation
│   │   └── transcript.service.js # OpenAI Whisper transcription
│   ├── middleware/               # Auth, Multer, Rate limiters
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── multer.js             # File upload configuration
│   │   └── ratelimmiter/
│   │       └── ratelimmiter.js   # Rate limiting rules
│   └── utils/                    # Shared utilities
│       ├── ApiError.js           # Custom error class
│       ├── ApiResponse.js        # Standardized response class
│       ├── asynchandler.js       # Async error wrapper
│       ├── cloudinary.js         # Upload to Cloudinary
│       ├── cosineSimilarity.js   # Vector similarity for RAG
│       ├── deletefilefromCloudinary.js  # Delete from Cloudinary
│       └── splitTranscript.js    # Transcript chunking for RAG
└── Readme/                       # Dev notes
```

---

## 3. API Reference

> **Base URL**: `http://localhost:4000/api/v1`  
> **Auth**: JWT Bearer token in `Authorization` header or `accessToken` cookie  
> **Response Format**: `{ statuscode, data, message, success }`

---

### 3.1 Users — `/api/v1/users`

| Method | Endpoint | Auth | Rate Limit | Middleware | Description |
|--------|----------|------|------------|------------|-------------|
| `POST` | `/register` | ❌ | 5 req / 15 min | Multer (avtar, coverImage) | Register new user |
| `POST` | `/login` | ❌ | 10 req / 5 min | — | Login, returns tokens in cookies |
| `POST` | `/logout` | ✅ | — | — | Clear tokens, logout |
| `POST` | `/refresh-token` | ❌ | — | — | Refresh access token |
| `POST` | `/change-password` | ✅ | — | — | Change password |
| `GET` | `/current-user` | ✅ | — | — | Get logged-in user profile |
| `PATCH` | `/update-account` | ✅ | — | — | Update fullname & email |
| `POST` | `/update-avtar` | ✅ | — | Multer (avtar) | Update avatar image |
| `POST` | `/cover-image` | ✅ | — | Multer (coverImage) | Update cover image |
| `GET` | `/c/:username` | ✅ | — | — | Get channel profile + subscriber counts |
| `GET` | `/history` | ✅ | — | — | Get watch history |

#### Register — Request Body (multipart/form-data)
```json
{
  "fullname": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123",
  "avtar": "<file>",
  "coverImage": "<file>"
}
```

#### Login — Request Body
```json
{
  "email": "john@example.com",
  "username": "johndoe",
  "password": "secret123"
}
```

#### Login — Response
```json
{
  "statuscode": 200,
  "data": {
    "user": { "_id": "...", "username": "johndoe", "email": "...", "avtar": {} },
    "accessToken": "eyJhbGciOiJIUzI1NiI...",
    "refreshToken": "eyJhbGciOiJIUzI1NiI..."
  },
  "message": "user login successfully",
  "success": true
}
```

#### Change Password — Request Body
```json
{
  "oldpassword": "secret123",
  "newpassword": "newsecret456"
}
```

#### Update Account — Request Body
```json
{
  "fullname": "John Updated",
  "email": "john.updated@example.com"
}
```

---

### 3.2 Videos — `/api/v1/video`

| Method | Endpoint | Auth | Middleware | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/upload` | ✅ | Multer (videoupload, thumbnailupload) | Upload video + thumbnail |
| `GET` | `/getallvideos?page=1&limit=10` | ❌ | — | Paginated video feed |
| `GET` | `/:videoId` | ❌ | — | Get video by ID (auto-increments views) |

#### Upload Video — Request Body (multipart/form-data)
```json
{
  "title": "Learn JavaScript",
  "description": "A complete JS tutorial",
  "videoupload": "<file>",
  "thumbnailupload": "<file>"
}
```

#### Upload Video — Response
```json
{
  "statuscode": 201,
  "data": {
    "_id": "...",
    "title": "Learn JavaScript",
    "description": "A complete JS tutorial",
    "videoFile": { "url": "https://res.cloudinary.com/...", "public_id": "..." },
    "thumbnail": { "url": "https://res.cloudinary.com/...", "public_id": "..." },
    "owner": "...",
    "views": 0,
    "isPublished": true
  },
  "message": "video uploaded successfully",
  "success": true
}
```

#### Get All Videos — Response
```json
{
  "statuscode": 200,
  "data": [
    {
      "_id": "...",
      "title": "Learn JavaScript",
      "videoFile": { "url": "..." },
      "thumbnail": { "url": "..." },
      "views": 42,
      "owner": { "username": "johndoe", "avtar": {} },
      "createdAt": "2026-03-20T..."
    }
  ],
  "message": "Video fetch successfully",
  "success": true
}
```

---

### 3.3 Likes — `/api/v1/likes`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/video/:videoId` | ✅ | Toggle like/unlike on a video |

---

### 3.4 Comments — `/api/v1/commnets`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/:videoId` | ✅ | Add a comment to a video |
| `GET` | `/:videoId` | ❌ | Get all comments on a video |
| `DELETE` | `/delete/:commentId` | ✅ | Delete own comment |

#### Add Comment — Request Body
```json
{
  "content": "Great video!"
}
```

#### Get Comments — Response
```json
{
  "statuscode": 200,
  "data": [
    {
      "_id": "...",
      "content": "Great video!",
      "video": "...",
      "owner": { "username": "johndoe", "avtar": {} },
      "createdAt": "2026-03-20T..."
    }
  ],
  "message": "Comments fetched successfully",
  "success": true
}
```

---

### 3.5 Subscriptions — `/api/v1/subscriptions`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/:channelId` | ✅ | Toggle subscribe/unsubscribe |

---

### 3.6 Chat — `/api/v1/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:videoId` | ❌ | Get all chat messages for a video |

> **Note:** Live chat messages are sent via Socket.io (see [Section 7](#7-real-time-chat-socketio)). This REST endpoint only retrieves message history.

---

### 3.7 AI — `/api/v1/ai`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ask` | ✅ | Ask a general AI question |
| `GET` | `/history` | ✅ | Get user's doubt history |
| `GET` | `/notes-pdf` | ✅ | Download doubt history as PDF |
| `POST` | `/video-doubt` | ✅ | Ask AI about a specific video |

#### Ask AI — Request Body
```json
{
  "question": "What is a closure in JavaScript?"
}
```

#### Ask AI — Response
```json
{
  "statuscode": 200,
  "data": {
    "_id": "...",
    "user": "...",
    "question": "What is a closure in JavaScript?",
    "answer": "A closure is a function that has access to...",
    "topic": "general",
    "createdAt": "..."
  },
  "message": "AI response generated successfully",
  "success": true
}
```

#### Video Doubt — Request Body
```json
{
  "videoId": "60d21b4667d0d8992e610c85",
  "question": "What did the speaker say about React hooks?"
}
```

---

## 4. Database Schema (MongoDB)

### 4.1 Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ VIDEO : owns
    USER ||--o{ COMMENT : writes
    USER ||--o{ LIKE : gives
    USER ||--o{ SUBSCRIPTION : subscribes
    USER ||--o{ SUBSCRIPTION : "is subscribed to"
    USER ||--o{ CHATMESSAGE : sends
    USER ||--o{ DOUBT : asks
    VIDEO ||--o{ COMMENT : has
    VIDEO ||--o{ LIKE : receives
    VIDEO ||--o{ CHATMESSAGE : has
    VIDEO ||--o{ TRANSCRIPTCHUNK : has

    USER {
        ObjectId _id PK
        String username UK
        String email UK
        String password
        String fullname
        Object avtar "url + public_id"
        Object coverImage "url + public_id"
        ObjectId[] watchHistory "ref Video"
        String refreshToken
    }

    VIDEO {
        ObjectId _id PK
        Object videoFile "url + public_id"
        Object thumbnail "url + public_id"
        String title
        String description
        Number duration
        Number views
        ObjectId owner FK "ref User"
        String transcript
        Boolean isPublished
    }

    COMMENT {
        ObjectId _id PK
        ObjectId video FK "ref Video"
        ObjectId owner FK "ref User"
        String content
    }

    LIKE {
        ObjectId _id PK
        ObjectId video FK "ref Video"
        ObjectId likes FK "ref User"
    }

    SUBSCRIPTION {
        ObjectId _id PK
        ObjectId subscriber FK "ref User"
        ObjectId channel FK "ref User"
    }

    CHATMESSAGE {
        ObjectId _id PK
        ObjectId video FK "ref Video"
        ObjectId user FK "ref User"
        String message
    }

    DOUBT {
        ObjectId _id PK
        ObjectId user FK "ref User"
        String question
        String answer
        String topic "default: general"
    }

    TRANSCRIPTCHUNK {
        ObjectId _id PK
        ObjectId video FK "ref Video"
        String text
        Number[] embedding
    }
```

### 4.2 Model Details

| Model | File | Key Fields | Indexes |
|-------|------|------------|---------|
| **User** | `src/models/user.model.js` | username, email, password (bcrypt hashed), avtar, coverImage, watchHistory, refreshToken | `username` (unique, indexed) |
| **Video** | `src/models/video.model.js` | videoFile, thumbnail, title, description, duration, views, owner, transcript | `owner: 1`, `createdAt: -1` |
| **Comment** | `src/models/comment.model.js` | video, owner, content | — |
| **Like** | `src/models/like.model.js` | video, likes (user ref) | — |
| **Subscription** | `src/models/subscription.model.js` | subscriber, channel (both User refs) | — |
| **ChatMessage** | `src/models/chatmessage.model.js` | video, user, message | — |
| **Doubt** | `src/models/dout.model.js` | user, question, answer, topic | — |
| **TranscriptChunk** | `src/models/transcriptChunk.model.js` | video, text, embedding (Number[]) | — |

### 4.3 User Model — Hooks & Methods

| Feature | Description |
|---------|-------------|
| **Pre-save hook** | Automatically hashes password with bcrypt (salt rounds = 10) before saving, only when `password` field is modified |
| `isPasswordCorrect(password)` | Compares plaintext password against stored hash using `bcrypt.compare()` |
| `generateAccessToken()` | Creates JWT with `{ _id, email, username, fullname }`, signed with `ACCESS_TOKEN_SECRET`, expires in `1d` |
| `generateRefreshToken()` | Creates JWT with `{ _id }`, signed with `REFRESH_TOKEN_SECRET`, expires in `10d` |

---

## 5. Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as MongoDB

    Note over C,S: Registration
    C->>S: POST /api/v1/users/register (form-data)
    S->>S: Validate fields, check duplicates
    S->>S: Upload avtar + coverImage to Cloudinary
    S->>DB: Create User (password auto-hashed via pre-save hook)
    S->>C: 201 { user } (no password/refreshToken)

    Note over C,S: Login
    C->>S: POST /api/v1/users/login { email, password }
    S->>DB: Find user by email/username
    S->>S: bcrypt.compare(password)
    S->>S: Generate accessToken (1d) + refreshToken (10d)
    S->>DB: Save refreshToken on User document
    S->>C: 200 { user, accessToken, refreshToken } + httpOnly cookies

    Note over C,S: Authenticated Request
    C->>S: GET /api/v1/users/current-user (Bearer token)
    S->>S: jwtverify middleware decodes token
    S->>DB: Find user by decoded._id
    S->>S: Attach user to req.user
    S->>C: 200 { user }

    Note over C,S: Token Refresh
    C->>S: POST /api/v1/users/refresh-token
    S->>S: Verify refreshToken from cookie/body
    S->>DB: Match against stored refreshToken
    S->>S: Generate new accessToken + refreshToken
    S->>C: 200 { newAccessToken, newRefreshToken }

    Note over C,S: Logout
    C->>S: POST /api/v1/users/logout (Bearer token)
    S->>DB: Unset refreshToken from User document
    S->>S: Clear accessToken & refreshToken cookies
    S->>C: 200 { "user log out" }
```

**Token Config:**
- **Access Token**: signed with `ACCESS_TOKEN_SECRET`, expires in `1d`
- **Refresh Token**: signed with `REFRESH_TOKEN_SECRET`, expires in `10d`
- Both set as `httpOnly`, `secure` cookies

---

## 6. AI Pipeline

### 6.1 General Doubt Resolution (Working ✅)

```mermaid
graph LR
    Q["Student Question"] --> Groq["Groq API (LLaMA 3.3 70B)"]
    Groq --> A["AI Answer"]
    A --> DB["Save to Doubt collection"]
    DB --> Res["Return to student"]
```

- Uses **Groq SDK** with `llama-3.3-70b-versatile` model
- System prompt: *"You are a helpful learning assistant that explains programming concepts clearly."*
- Each Q&A is persisted in the `Doubt` collection for history & PDF export

### 6.2 Video-Specific RAG Pipeline (Planned, not fully wired)

```mermaid
graph TB
    Upload["Video Upload"] --> FFmpeg["Extract Audio (FFmpeg)"]
    FFmpeg --> Whisper["Speech-to-Text (OpenAI Whisper)"]
    Whisper --> Transcript["Full Transcript"]
    Transcript --> Split["Split into 200-word chunks"]
    Split --> Embed["Generate Embeddings (OpenAI)"]
    Embed --> Store["Store TranscriptChunks in MongoDB"]
    
    Question["Student Question"] --> QEmbed["Embed Question"]
    QEmbed --> Search["Cosine Similarity Search"]
    Search --> BestChunk["Most Relevant Chunk"]
    BestChunk --> LLM["Groq LLaMA 3.3"]
    LLM --> Answer["Context-aware Answer"]
```

**Supporting Services:**

| Service | File | Technology | Purpose |
|---------|------|------------|---------|
| AI | `src/service/ai.service.js` | Groq SDK (LLaMA 3.3) | Generate AI responses |
| Audio | `src/service/audio.service.js` | fluent-ffmpeg | Extract audio from video files |
| Transcript | `src/service/transcript.service.js` | OpenAI Whisper | Audio → text transcription |
| Embedding | `src/service/embedding.service.js` | OpenAI `text-embedding-3-small` | Generate vector embeddings |
| PDF | `src/service/pdf.service.js` | PDFKit | Export doubt history as PDF |

**Supporting Utilities:**
- `src/utils/cosineSimilarity.js` — Vector similarity calculation
- `src/utils/splitTranscript.js` — Chunk transcript into 200-word blocks

---

## 7. Real-time Chat (Socket.io)

File: `src/Socket.io/socket.js`

### Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `connection` | Server ← Client | — | New client connected |
| `join-video-room` | Server ← Client | `videoId` | Join a video's chat room |
| `recived-message` | Server → Room | `{ user, message }` | Broadcast message to room |
| `disconnect` | Server ← Client | — | Client disconnected |

### Client Usage Example
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

// Join a video room
socket.emit("join-video-room", "VIDEO_ID_HERE");

// Listen for messages
socket.on("recived-message", (data) => {
  console.log(`${data.user}: ${data.message}`);
});

// Send a message (when implemented)
socket.emit("send-message", { 
  videoId: "VIDEO_ID_HERE", 
  user: "username", 
  message: "Hello!" 
});
```

> ⚠️ **Warning:** The Socket.io implementation is incomplete. The `send-message` listener is missing — the `io.to(videoId).emit(...)` call is outside any event handler and references undefined variables. Messages are not being persisted to the `ChatMessage` model.

---

## 8. Middleware Layer

### 8.1 JWT Authentication — `src/middleware/auth.middleware.js`
- Extracts token from `cookies.accessToken` or `Authorization: Bearer <token>` header
- Verifies with `ACCESS_TOKEN_SECRET`
- Looks up user in DB, excludes password & refreshToken
- Attaches user object to `req.user`

### 8.2 File Upload — `src/middleware/multer.js`
- Uses `multer.diskStorage` to store uploaded files
- **Destination**: `./public` directory
- **Filename**: Original filename preserved
- Used for avatar, cover image, video, and thumbnail uploads

### 8.3 Rate Limiters — `src/middleware/ratelimmiter/ratelimmiter.js`

| Limiter | Window | Max Requests | Applied To |
|---------|--------|-------------|------------|
| `ApiRatelimiter` | 15 min | 100 | General API (not currently used) |
| `registerratelimt` | 15 min | 5 | `/register` |
| `logginratelimit` | 5 min | 10 | `/login` |

### 8.4 Security — Helmet
- Enabled globally via `app.use(helmet())` to set secure HTTP headers
- Protects against common vulnerabilities (XSS, clickjacking, etc.)

---

## 9. Utilities

| Utility | File | Purpose |
|---------|------|---------|
| **ApiError** | `src/utils/ApiError.js` | Custom error class with `statuscode`, `message`, `errors[]` — extends native `Error` |
| **ApiResponse** | `src/utils/ApiResponse.js` | Standardized response: `{ statuscode, data, message, success }` where `success = statuscode < 400` |
| **asynchandler** | `src/utils/asynchandler.js` | Higher-order function that wraps async route handlers, catches Promise rejections and forwards to `next(err)` |
| **uploadOnCloudinary** | `src/utils/cloudinary.js` | Uploads local file to Cloudinary with `resource_type: "auto"`, deletes local copy after upload, returns Cloudinary response |
| **deletefilefromCloudinary** | `src/utils/deletefilefromCloudinary.js` | Delete file from Cloudinary by `public_id` |
| **cosineSimilarity** | `src/utils/cosineSimilarity.js` | Compute cosine similarity between two embedding vectors (for RAG search) |
| **splitTranscript** | `src/utils/splitTranscript.js` | Split transcript text into 200-word chunks for embedding generation |

---

## 10. Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `CROSS_ORI` | CORS allowed origins | `*` |
| `ACCESS_TOKEN_SECRET` | JWT access token signing key | `your-secret-key` |
| `ACCESS_TOKEN_EXPIRY` | Access token TTL | `1d` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token signing key | `your-secret-key` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token TTL | `10d` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `582355621587992` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-cloudinary-secret` |
| `CLOUDINARY_URL` | Cloudinary full URL | `cloudinary://key:secret@cloud-name` |
| `GROQ_API_KEY` | Groq API key for LLaMA 3.3 | `gsk_...` |
| `OPENAI_API_KEY` | OpenAI API key (for Whisper & Embeddings) | `sk-...` |

> ⚠️ **Caution:** `OPENAI_API_KEY` is referenced in `embedding.service.js` and `transcript.service.js` but is **not defined** in the current `.env`. The RAG pipeline will fail without it.

---

## 11. Known Bugs & Issues

> ⚠️ **Important:** The following issues were identified during static code analysis. They should be addressed before production deployment.

### Critical Bugs

| # | File | Issue |
|---|------|-------|
| 1 | `src/middleware/auth.middleware.js` (L7) | `jwtverify` uses `asynchandler` but signature is `(req, res)` — missing `next` parameter. `next()` is called on line 26 but it's undefined. |
| 2 | `src/controller/ai.controller.js` (L83) | `generateNotes` has `(res, req)` — parameters are **swapped**. |
| 3 | `src/controller/ai.controller.js` (L90) | `if(doubts)` should be `if(!doubts.length)` — condition is inverted. |
| 4 | `src/controller/ai.controller.js` (L107) | `Video.find(ById(videoId))` — syntax error, should be `Video.findById(videoId)`. |
| 5 | `src/controller/ai.controller.js` (L124) | `bestChunk` is referenced but never defined. |
| 6 | `src/controller/like.controller.js` (L28) | `res.stauts(200),json(...)` — typo (`stauts` → `status`) and comma instead of dot. |
| 7 | `src/controller/like.controller.js` (L18) | Querying `likedBy` field but model uses `likes`. |
| 8 | `src/controller/subscription.controller.js` (L46) | Returns `newSubscription` but variable is named `newSubscriber`. |
| 9 | `src/controller/video.controller.js` (L98) | `Like` is used but never imported. |
| 10 | `src/controller/video.controller.js` (L101) | `console(...)` — missing `.log`. |
| 11 | `src/Socket.io/socket.js` (L13) | `io.to(videoId).emmit(...)` — typo (`emmit` → `emit`) and placed outside event handler; `videoId`, `user`, `message` are undefined. |
| 12 | `src/utils/splitTranscript.js` (L2) | Splits on empty string `""` instead of space `" "`. |
| 13 | `src/utils/splitTranscript.js` (L7) | Infinite loop: `i+chunkSize` doesn't mutate `i` — should be `i+=chunkSize`. |
| 14 | `src/service/pdf.service.js` (L17-22) | Uses `iteam` as parameter but `item` in the body — `ReferenceError`. |
| 15 | `src/models/user.model.js` (L29) | `reuired` typo — should be `required`. |
| 16 | `src/middleware/ratelimmiter/ratelimmiter.js` | `windowsMs` — should be `windowMs` (express-rate-limit API). |

### Architectural Issues

| # | Issue | Recommendation |
|---|-------|----------------|
| 1 | Video upload route field names (`videoupload`, `thumbnailupload`) don't match controller expectations (`video`, `thumbnail`) | Align multer field names with `req.files` access patterns |
| 2 | No validation library (Joi, Zod) — all validation is manual | Add schema validation for request bodies |
| 3 | User registration stores `avtar.url` as a string but model defines it as `{ url, public_id }` object | Fix registration controller to save the full object |
| 4 | `DB_NAME` is extracted but never used in the connection string | Append `/${DB_NAME}` to `MONGO_URI` |
| 5 | No `OPENAI_API_KEY` in `.env` — transcript & embedding services will crash | Add the key or disable unused services |
| 6 | The `ApiRatelimiter` (general) is defined but never mounted | Mount it globally or remove it |
| 7 | Comment route path is `/commnets` (typo) | Fix to `/comments` |

---

## 12. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | 5.2.1 | Web framework |
| `mongoose` | 9.2.0 | MongoDB ODM |
| `socket.io` | 4.8.3 | Real-time WebSocket communication |
| `jsonwebtoken` | 9.0.3 | JWT generation & verification |
| `bcrypt` | 6.0.0 | Password hashing |
| `cloudinary` | 2.9.0 | Cloud file storage (images, videos) |
| `multer` | 2.0.2 | Multipart form-data file uploads |
| `cors` | 2.8.6 | Cross-Origin Resource Sharing |
| `helmet` | 8.1.0 | HTTP security headers |
| `cookie-parser` | 1.4.7 | Parse cookies from requests |
| `express-rate-limit` | 8.2.1 | API rate limiting |
| `groq-sdk` | 1.1.1 | Groq AI (LLaMA) integration |
| `@google/generative-ai` | 0.24.1 | Google Gemini (commented out, unused) |
| `openai` | 6.31.0 | OpenAI Whisper + Embeddings |
| `fluent-ffmpeg` | 2.1.3 | Audio extraction from video |
| `ffmpeg-static` | 5.3.0 | Static FFmpeg binary |
| `pdfkit` | 0.18.0 | PDF generation |
| `axios` | 1.13.6 | HTTP client (unused currently) |
| `dotenv` | 17.2.4 | Environment variable loader |
| `nodemon` | 3.1.11 | Dev: auto-restart on file changes |

---

## 13. How to Run

```bash
# 1. Clone the repository
git clone <repo-url>
cd Backend

# 2. Install dependencies
npm install

# 3. Create .env with required variables (see Section 10)
cp .env.example .env  # then fill in your values

# 4. Start development server
npm run dev
# → Server runs on http://localhost:4000
```

The `dev` script: `nodemon -r dotenv/config --experimental-json-modules src/index.js`

### Testing with Postman

1. **Register** → `POST http://localhost:4000/api/v1/users/register` (form-data with avatar & cover image files)
2. **Login** → `POST http://localhost:4000/api/v1/users/login` (get access token from response)
3. **Set Auth Header** → `Authorization: Bearer <accessToken>`
4. **Upload Video** → `POST http://localhost:4000/api/v1/video/upload` (form-data with video & thumbnail files)
5. **Ask AI** → `POST http://localhost:4000/api/v1/ai/ask` (JSON body with `question`)

---

## License

ISC

---

*Documentation generated on March 20, 2026*
