# Edge Cases & Corner Scenarios: Zero-Cost Portfolio System

This document outlines potential edge cases, corner scenarios, and failure modes across the zero-cost architecture. Identifying these early ensures we build robust defensive mechanisms during the implementation phase.

## 1. Content & Data Ingestion (Headless CMS & Markdown)

| Scenario | Potential Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Malformed Markdown Frontmatter** | A missing required field (e.g., `date` or `id`) in the `.md` file causes the Next.js static build to crash. | Implement strict Zod schema validation during the markdown parsing phase. Fallback to default values if non-critical fields are missing. |
| **Massive Media Uploads** | The author uploads a 20MB `.png` through the CMS, inflating the Git repository size and slowing down Vercel deployment builds. | Configure Decap CMS to enforce file size limits. Use Next.js `<Image />` component for aggressive runtime optimization and WebP conversion. |
| **GitHub API Rate Limiting** | Decap CMS uses the GitHub API. Rapid successive saves/publishes might hit the GitHub API free-tier rate limits. | Author content locally if doing massive bulk updates, or rely on the CMS's draft mode before hitting "Publish". |

## 2. Frontend UX & Interaction (Carousel & Routing)

| Scenario | Potential Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Non-Touch Device Navigation** | Desktop users without trackpads cannot easily "swipe" the gesture carousel. | Implement fallback navigation controls (e.g., left/right chevron arrows) and ensure keyboard accessibility (Left/Right arrow keys map to swipe events). |
| **Extreme Aspect Ratios** | On ultra-wide monitors or very small, foldable phones (e.g., Galaxy Fold), the circular depth illusion scales improperly, causing UI overlap. | Use CSS `clamp()` for module sizing and carefully define `vw` (viewport width) boundaries for the scaling transforms. |
| **Low-End Device Rendering** | The "cover flow" CSS transform animation causes layout thrashing and drops below 60fps on older mobile devices. | Strictly limit animations to compositing properties (`transform` and `opacity`). Use `will-change: transform` to force hardware acceleration. |

## 3. Dynamic Backend Core (Comments & Supabase)

| Scenario | Potential Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Database Cold Starts** | The Supabase Free Tier pauses after prolonged inactivity. The first visitor to load comments experiences a 3-5 second delay. | Utilize Next.js Incremental Static Regeneration (ISR) to cache the latest comments, or configure a free cron job (e.g., GitHub Actions) to ping the API daily to prevent pausing. |
| **Cross-Site Scripting (XSS)** | A user submits a comment containing malicious `<script>` tags, which is then rendered on the project page. | Strictly sanitize all comment outputs using a library like `DOMPurify` before rendering them in React. |
| **Massive Text Payloads** | A troll submits a 50,000-word comment, breaking the frontend layout and eating up the database free tier storage. | Enforce a strict character limit (e.g., 500 characters) on both the frontend HTML form and the server-side API validation. |
| **Legitimate User Rate-Limited** | A user on a shared public Wi-Fi (e.g., a coffee shop) gets blocked from commenting because another user on the same IP triggered the spam limit. | Keep the rate limit reasonable (e.g., 10 requests per 5 minutes per IP) rather than overly aggressive. Provide a clear UI error message explaining the temporary block. |

## 4. Newsletter Integration (Email API)

| Scenario | Potential Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Duplicate Subscription Abuse** | A bot or user submits the same email address 100 times, wasting database writes and triggering spam filters. | Enforce a `UNIQUE` constraint on the `email` column in Supabase. The API should catch the unique violation and silently return a `200 OK` (to prevent data harvesting) without writing to the DB or calling the email API. |
| **Exceeding Free Email Quotas** | A sudden viral spike results in 400 newsletter signups in one day, exceeding Brevo's 300 free emails/day limit. | Queue the confirmation emails. If the API returns a quota error, store the subscriber in the database with a `status: 'pending_email'` flag to retry the dispatch the next day. |
| **Honeypot Evasion** | Advanced headless browsers bypass the hidden honeypot field and successfully submit spam emails. | Combine the honeypot with a time-to-submit check (e.g., reject form submissions that occur in less than 2 seconds after page load) and regex validation to block obvious spam domains. |

## 5. Deployment & SEO

| Scenario | Potential Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Orphaned Routes** | The author changes the slug/title of an old project via the CMS, causing the old URL to return a 404 error and hurting SEO. | Implement Next.js `not-found.js` gracefully. Instruct the author to avoid changing project titles once published, or build a simple static redirect map in `next.config.js`. |
