# Phase-Wise Implementation Plan: Zero-Cost Portfolio System

This document outlines the step-by-step execution roadmap to build the zero-cost portfolio backend and frontend, based on the defined architecture and context.

## Phase 1: Project Initialization & Foundational Setup
- Initialize a Next.js (App Router) project in `c:\Portfolio`.
- Configure the foundational design system (typography, color palettes, and global CSS for premium aesthetics).
- Set up the initial directory structure for components, API routes, and markdown content (`/content/projects`, `/content/newsletters`).

## Phase 2: Headless CMS Integration (Decap CMS)
- Configure Decap CMS by creating the `public/admin/config.yml` and `public/admin/index.html`.
- Define the schema collections for Projects and Newsletters inside the CMS config.
- Test the local authoring experience to ensure `.md` files are generated correctly.

## Phase 3: Frontend Layout & Landing Carousel
- Build the swipeable **Smooth Gesture Carousel**.
- Implement the **Circular Depth Illusion** using CSS transforms so the active center module pops out while flanking modules scale down.
- Wire up the CTA buttons to execute hard client-side routing to the dedicated section pages.

## Phase 4: Dedicated Pages & Content Rendering
- Implement markdown parsers (using libraries like `gray-matter` and `remark`) to read local `.md` files.
- Build the `/projects`, `/projects/[id]`, `/newsletter`, and `/about` pages to render the static markdown content seamlessly.

## Phase 5: Dynamic Backend Core (Supabase)
- Set up the Supabase project and define `comments` and `subscribers` tables.
- Implement `POST /api/comments` and `POST /api/newsletter/subscribe`.
- Add security layers: Honeypot field validation and simple rate limiting.

## Phase 6: External Integrations (Emails)
- Integrate Brevo API (or Resend) to send automated confirmation emails when a user subscribes to the newsletter.
- Verify that assets (images) uploaded via the CMS route correctly and performantly.

## Phase 7: Polish & Deployment
- Final UX pass: ensure animations are 60fps and glassmorphism effects look premium.
- Execute End-to-End testing of all routing and API endpoints.
