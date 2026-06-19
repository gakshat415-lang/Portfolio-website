# 1. Objective
To build a zero-cost, lightweight, and robust backend system supporting a mobile-first, swipe-accessible portfolio landing page. The backend must serve dynamic content sections (Projects, About Me, Newsletter). Crucially, the architecture must support a multi-page routing structure: clicking on the "Projects," "About Me," or "Newsletter" CTA buttons on the initial swipeable landing page must navigate the visitor away from the main carousel and onto completely distinct, dedicated web pages for each respective section. The system must also process unauthenticated user interactions—specifically frictionless public comments and newsletter opt-ins—while employing automated protection layers against spam, all operating entirely within zero-cost infrastructure limits.

# 2. System Workflow

## 2.1 Data Ingestion & Content Engine (Zero-Cost / Markdown-Driven)
To keep data ingestion highly streamlined, modification-free, and 100% free, the system bypasses complex dashboard building by utilizing a dual-strategy data engine:

- **Static & Profile Content**: Academic histories, product case studies (e.g., Spotify, Uber, Zepto teardowns), and professional experience timelines are managed directly via structured Markdown (.md) or JSON files hosted in the source code repository. The backend automatically parses these files at runtime.
- **Dynamic Database Core**: Dynamic user data (comments and subscriber emails) is stored using a zero-cost cloud database tier (e.g., Supabase Free Tier or MongoDB Atlas M0 Free Cluster).

**Schema Definitions**:
- **Collection/Table**: projects → Fields: `id`, `title`, `markdown_body`, `published_at`
- **Collection/Table**: newsletters → Fields: `id`, `issue_number`, `title`, `rich_text_content`, `sent_at`

## 2.2 User Input & Engagement Layer (Zero-Auth / Frictionless)
Because visitors do not need to authenticate to leave feedback, the backend enforces automated verification to prevent system abuse.

- **Anonymous Comment Engine**: Public endpoints (`POST /api/comments`) process anonymous feedback under projects and newsletter issues.
- **Spam Containment**: The ingestion layer implements a "Honeypot" hidden field on the frontend and server-side text evaluation to discard immediate bot submissions without disturbing human interactions.
- **Data Binding**: Comments are stored anonymously and map directly to the corresponding project or newsletter ID.
  - **Collection/Table**: comments → Fields: `id`, `entity_id` (project/newsletter), `guest_name`, `comment_text`, `timestamp`
- **Frictionless Newsletter Sign-Up**: Captures visitor email addresses instantly via a public endpoint. To maintain quality without a complex signup framework, it executes a streamlined subscription write directly to the database.
- **Security Control**: Strict IP-based rate limiting (e.g., maximum 3 comment submissions per minute per IP address) must be implemented natively in the backend routing to eliminate automated spam surges.

## 2.3 Integration Layer (Free-Tier Infrastructure Ecosystem)
Orchestrates third-party systems using strictly free, developer-friendly service boundaries:

- **Email Dispatch & Relay**: Integration with a free-tier email engine (e.g., Brevo free tier offering 300 free emails/day, or a standard free Google Workspace SMTP configuration) to handle automated subscription confirmation drops and transactional delivery notifications.
- **Media Routing**: Media, wireframes, and interface assets from `landing page.jpeg` are served out of a free object asset pipeline (e.g., Cloudinary free tier or direct GitHub repository raw asset routing), ensuring high-speed content delivery networks (CDN) for image rendering at zero cost.

## 2.4 Output Display & API Delivery
Delivers clean, lightweight JSON payloads tailored for the dedicated multi-page routing architecture.

- **Dedicated Page Routing Logic**: The API is structured to feed completely separate frontend web pages. When a visitor clicks a CTA on the initial swipe screen, the frontend routes to a distinct URL (e.g., `/projects`, `/about`, `/newsletter`).
- **Landing Carousel Endpoint** (`GET /api/landing-state`): Serves only the lightweight unified structural payload map defining the 3 primary screens visualized in `landing page.jpeg` to ensure an instant initial load time.
- **Content Feeds for Dedicated Pages**:
  - `GET /api/projects` & `GET /api/projects/{id}`: Extracts compiled markdown file content along with all correlated anonymous records from the comments collection for the dedicated Projects page.
  - `GET /api/newsletters`: Delivers an ordered array of historical entries to populate the dedicated Newsletter screen.
  - `GET /api/about-me`: Emits the comprehensive academic and professional history payload for the dedicated About Me page.

# 3. Frontend UX & Interaction Specifications
The backend API payload must perfectly support the required frontend visual interaction model, which focuses on fluid motion and depth:

- **Smooth Gesture Carousel**: The primary interface consists of a frictionless, hardware-accelerated horizontal swipe carousel containing the three core modules.
- **Circular Depth Illusion (Active Focus)**: As the user swipes left or right, the interface must dynamically apply CSS scaling. The item currently resting in the direct center of the viewport must be visibly larger (scaled up) than the adjacent items. The flanking items (partially visible on the left and right) should be scaled down slightly and optionally faded. This creates a pseudo-3D "cover flow" or circular depth illusion, making the active item prominently pop out to the eye.
- **CTA Trigger**: While swiping cycles the visual focus, clicking the CTA button strictly executes the hard routing (described in section 2.4) to navigate the user to the dedicated page for the active module.
