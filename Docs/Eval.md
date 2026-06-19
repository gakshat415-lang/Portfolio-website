# System Evaluation & Verification Matrix (Eval.md)

This document establishes the strict testing protocols required to validate the Zero-Cost Portfolio System. It ensures that every phase of the implementation plan meets the architectural requirements before progressing to the next stage.

---

## Phase 1: Project Initialization & Foundational Setup

**Objective:** Verify that the core Next.js application and styling engine are correctly scaffolded.

| Test Scenario | Expected Behavior | Pass/Fail Criteria |
| :--- | :--- | :--- |
| **Boot Local Server** | Running `npm run dev` starts the application without any build or runtime errors. | **Pass:** `localhost:3000` loads a 200 OK response with no console warnings. |
| **Verify Styling Pipeline** | A test component with TailwindCSS/Vanilla CSS utility classes is rendered on the screen. | **Pass:** CSS classes correctly apply visual changes (e.g., background color, font family) confirming the pipeline is active. |

---

## Phase 2: Headless CMS Integration (Decap CMS)

**Objective:** Validate that content authoring can occur seamlessly without touching code.

| Test Scenario | Expected Behavior | Pass/Fail Criteria |
| :--- | :--- | :--- |
| **Admin Dashboard Access** | Navigating to `/admin` loads the Decap CMS authentication and UI interface. | **Pass:** Dashboard loads successfully without 404s or configuration errors. |
| **Content Generation** | Creating a dummy "Project" via the WYSIWYG editor and clicking "Publish". | **Pass:** The CMS successfully generates a `.md` file with the correct frontmatter schema and saves it to the `/content/projects` directory. |
| **Asset Uploading** | Uploading an image via the CMS media library. | **Pass:** Image is routed to the designated `public/assets` folder or external CDN bucket. |

---

## Phase 3: Frontend Layout & Landing Carousel

**Objective:** Ensure the gesture-based "Cover Flow" UI is mathematically accurate and performant.

| Test Scenario | Expected Behavior | Pass/Fail Criteria |
| :--- | :--- | :--- |
| **Touch/Drag Swiping** | Swiping left/right on a mobile emulator (or dragging on desktop) pans the carousel. | **Pass:** The carousel moves fluidly following the user's gesture input. |
| **Circular Depth Illusion** | As a module hits the center of the viewport, it scales up. Flanking modules scale down and fade slightly. | **Pass:** Center module receives `transform: scale(1)`, edge modules receive `scale(0.85)` and `opacity: 0.6`. |
| **Performance Profiling** | Rapidly swiping back and forth while profiling via Chrome DevTools. | **Pass:** Animations maintain ~60fps without causing Main Thread layout thrashing (strictly utilizing compositing). |

---

## Phase 4: Dedicated Pages & Content Rendering

**Objective:** Verify the hard routing and static markdown parsing capabilities.

| Test Scenario | Expected Behavior | Pass/Fail Criteria |
| :--- | :--- | :--- |
| **CTA Routing** | Clicking the CTA button on the active carousel module (e.g., "Projects"). | **Pass:** The application executes a hard route away from the carousel to the `/projects` URL. |
| **Markdown Parsing** | Navigating to `/projects/[slug]` for the dummy project created in Phase 2. | **Pass:** The page renders the markdown body content perfectly converted into semantic HTML. |
| **404 Handling** | Navigating to an invalid project slug (e.g., `/projects/does-not-exist`). | **Pass:** System catches the missing file and gracefully renders a custom 404 Not Found page. |

---

## Phase 5: Dynamic Backend Core (Supabase)

**Objective:** Test unauthenticated data ingestion and anti-spam protection layers.

| Test Scenario | Expected Behavior | Pass/Fail Criteria |
| :--- | :--- | :--- |
| **Valid Comment Submission** | Submitting a standard text comment via `POST /api/comments`. | **Pass:** API returns `201 Created` and the comment is visible inside the Supabase database dashboard. |
| **Honeypot Trigger** | Submitting a comment where the hidden frontend honeypot field is artificially populated. | **Pass:** API returns `200 OK` (to deceive the bot) but the data is **not** written to the database. |
| **Rate Limit Enforcement** | Firing 5 comment submissions in under 10 seconds from the same IP address. | **Pass:** API returns `429 Too Many Requests` on the 4th/5th attempt, blocking the transaction. |

---

## Phase 6: External Integrations (Emails)

**Objective:** Ensure the zero-cost email dispatcher functions for newsletter signups.

| Test Scenario | Expected Behavior | Pass/Fail Criteria |
| :--- | :--- | :--- |
| **Valid Subscription** | Submitting a valid test email to `POST /api/newsletter/subscribe`. | **Pass:** The email is written to the Supabase `subscribers` table, and the Brevo API triggers successfully. |
| **Email Delivery** | Checking the inbox of the submitted test email address. | **Pass:** A welcome/confirmation email arrives in the inbox within 60 seconds. |
| **Duplicate Prevention** | Submitting the exact same email address a second time. | **Pass:** Database catches the `UNIQUE` constraint, API prevents duplicate dispatch, and returns a graceful success message. |

---

## Phase 7: Polish & Deployment

**Objective:** Final validation of the production-ready build.

| Test Scenario | Expected Behavior | Pass/Fail Criteria |
| :--- | :--- | :--- |
| **Vercel Deployment** | Pushing the final `main` branch to GitHub to trigger Vercel CI/CD. | **Pass:** The build pipeline passes cleanly (`npm run build`), generating static assets without errors. |
| **Production API Check** | Testing the Comment and Newsletter endpoints on the live `.vercel.app` domain. | **Pass:** Environment variables map correctly; live APIs communicate with Supabase successfully. |
| **Lighthouse Audit** | Running a Google Lighthouse audit on the production landing page. | **Pass:** The application achieves scores of **90+** across Performance, Accessibility, Best Practices, and SEO. |
