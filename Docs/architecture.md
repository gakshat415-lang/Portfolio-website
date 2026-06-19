# Architecture Overview: Zero-Cost Portfolio System

This document outlines the architecture for the zero-cost, lightweight, and robust portfolio system described in the system context. It provides a detailed breakdown of the technology stack, data flow, infrastructure, and frontend architecture required to achieve the goals.

## 1. High-Level System Architecture

The architecture relies on a decoupled, yet cohesive approach using modern serverless and edge-based free-tier services. 

### Recommended Technology Stack
*   **Frontend & API Gateway (Fullstack Framework):** Next.js (App Router) or Nuxt.js
    *   *Why:* Offers seamless integration of static site generation (for markdown), server-side API routes (for zero-cost backend endpoints), and optimized asset delivery. Hosted for free on Vercel or Netlify.
*   **Database (Dynamic Data):** Supabase (Free Tier) or MongoDB Atlas (M0 Free Cluster)
    *   *Why:* Generous free tiers, excellent developer experience, and simple integrations for storing comments and newsletter emails.
*   **Content Management:** Git / GitHub
    *   *Why:* Zero cost, version-controlled markdown (`.md`) and JSON files for projects, about me, and newsletter content.
*   **Email Dispatch:** Brevo (Free Tier) or Resend (Free Tier)
    *   *Why:* Provides free emails/day via API/SMTP, perfect for newsletter subscriptions and transactional emails.
*   **Asset Storage:** Cloudinary (Free Tier) or GitHub Repository (Raw Assets)
    *   *Why:* High-speed global CDNs for images and media assets at no cost.

---

## 2. Infrastructure & Data Flow

### 2.1 Data Engine (Hybrid Approach)

The system utilizes a dual-strategy data engine to minimize database operations and maximize caching:

1.  **Static Content (Build-time / Runtime Parsing):**
    *   Content such as Projects, About Me, and Newsletter articles are authored in Markdown.
    *   The framework parses these files from the repository and serves them directly as HTML/JSON payloads.
    *   *Logical Schema Mapping (Static):*
        *   `projects`: Frontmatter (`id`, `title`, `published_at`) + Markdown Body
        *   `newsletters`: Frontmatter (`id`, `issue_number`, `title`, `sent_at`) + Markdown Body

2.  **Dynamic Content (Database Core):**
    *   Handles stateful user interactions without requiring user authentication.
    *   *Database Schema (Relational/Document):*
        *   **`comments` Table/Collection:**
            *   `id` (UUID/ObjectId)
            *   `entity_id` (String - References Project ID or Newsletter ID)
            *   `guest_name` (String)
            *   `comment_text` (Text)
            *   `timestamp` (Datetime)
        *   **`subscribers` Table/Collection:**
            *   `email` (String, Unique)
            *   `subscribed_at` (Datetime)

### 2.2 Security & Spam Containment

To manage unauthenticated inputs (`POST /api/comments`, `POST /api/newsletter/subscribe`), robust zero-cost security mechanisms are enforced at the API route level:

*   **Honeypot Fields:** Invisible form fields injected into the frontend form. If the API receives a payload with the honeypot field populated, the request is immediately discarded (silently succeeding to deter bots).
*   **Rate Limiting:** IP-based rate limiting (e.g., 3 requests/minute per IP) implemented using edge middleware (e.g., Vercel KV free tier, or a simple in-memory cache) to eliminate automated spam surges.
*   **Text Evaluation:** Server-side evaluation (regex checks) to reject comments containing excessive URLs or common bot keywords.

---

## 3. API Design & Routing Logic

The backend provides structured JSON payloads designed specifically for the dedicated multi-page frontend routing.

### 3.1 Endpoints

*   `GET /api/landing-state`
    *   **Purpose:** Fetches the initial state for the swipeable carousel.
    *   **Payload:** Lightweight array of 3 core modules (Projects, About, Newsletter) with essential metadata (title, summary, thumbnail URL) for an instant initial load.
*   `GET /api/projects`
    *   **Purpose:** Lists all portfolio projects for the dedicated `/projects` page.
    *   **Payload:** Array of project metadata extracted from Markdown frontmatter.
*   `GET /api/projects/{id}`
    *   **Purpose:** Fetches a specific project's markdown content AND dynamic comments.
    *   **Payload:** `{ project_data: MarkdownContent, comments: [CommentObjects] }`
*   `GET /api/newsletters`
    *   **Purpose:** Fetches history of newsletters for the dedicated `/newsletter` page.
    *   **Payload:** Array of past issues and content.
*   `GET /api/about-me`
    *   **Purpose:** Emits the comprehensive academic and professional history payload.
    *   **Payload:** Parsed JSON/Markdown timeline structure.
*   `POST /api/comments`
    *   **Purpose:** Submits an anonymous comment.
    *   **Payload:** `{ entity_id, guest_name, comment_text, honeypot_field }`
*   `POST /api/newsletter/subscribe`
    *   **Purpose:** Frictionless email capture.
    *   **Payload:** `{ email, honeypot_field }`

---

## 4. Frontend Architecture & UX Interaction

The frontend architecture is designed to support the required fluid motion, depth, and distinct navigation routes.

### 4.1 Component Structure & Animation

*   **Landing Page (`/`)**:
    *   Houses the **Smooth Gesture Carousel**.
    *   Implements the **Circular Depth Illusion** using CSS transforms to highlight the active module:
        *   `Active Focus Module`: `transform: scale(1) translateX(0); opacity: 1; z-index: 10;`
        *   `Flanking Modules`: `transform: scale(0.85) translateX(offset); opacity: 0.6; z-index: 5;`
    *   Relies strictly on hardware-accelerated CSS properties (`transform`, `opacity`) to ensure 60fps animations during horizontal swipes without layout thrashing.
*   **Dedicated Pages (`/projects`, `/about`, `/newsletter`)**:
    *   Independent pages fetched via hard routing from the landing page CTAs.

### 4.2 Interaction Workflow

1.  **Initial Load:** User visits the root URL. The frontend requests `GET /api/landing-state` (or utilizes build-time static generation) to render the 3 primary screens instantly.
2.  **Swiping:** User swipes horizontally. The UI framework (using intersection observers or a touch-swipe library) dynamically shifts the active CSS classes, creating the circular depth "cover flow" illusion.
3.  **Action:** User taps the CTA button on the active module (e.g., "Projects").
4.  **Routing:** The application executes a hard route (navigates away from the carousel) to the dedicated page (`/projects`).
5.  **Dedicated View:** User is presented with the full module interface fed by its respective API endpoint.

---

## 5. Deployment Strategy

*   **Hosting Ecosystem:** Vercel or Netlify (Zero-cost hosting for both Frontend and Serverless API Routes).
*   **Database Integration:** Connect Supabase/MongoDB securely via Environment Variables (`DATABASE_URL`).
*   **CI/CD Pipeline:** GitHub branch pushes automatically trigger builds, compiling new Markdown content into static pages and updating serverless endpoints seamlessly.

---

## 6. Content Authoring & Publishing Workflow

To provide a frictionless, zero-cost authoring experience without requiring you to touch code, the system integrates a **Git-Backed Headless CMS** (e.g., **Decap CMS** or **TinaCMS**).

### The "Dashboard" Approach (100% Free)
1. **Accessing the Dashboard:** You will log into a secure, user-friendly admin dashboard hosted directly on your domain (e.g., `yourdomain.com/admin`).
2. **Authoring Content:** Inside the dashboard, you will have a visual WYSIWYG editor tailored for your collections ("Projects" and "Newsletters"). You can write content, format text, and easily use the "Upload Image" button to attach assets.
3. **Publishing:** When you click "Publish", the CMS operates invisibly in the background:
    * It creates or updates the corresponding Markdown (`.md`) files.
    * It saves uploaded images to the repository's media folder.
    * It automatically pushes a commit to your GitHub repository.
4. **Live Deployment:** Vercel (or Netlify) detects the GitHub commit instantly, rebuilds the site with your new content, and deploys it live—all completely automated and at zero cost.
