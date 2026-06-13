# React Development Task Instructions

## Role

Act as a **Senior Software Engineer / Web Developer** specializing in: -
React - Modern UI/UX - React Bits components - Responsive web design -
Clean, maintainable, and reusable code

Preserve the existing project structure and styling conventions unless
explicitly required otherwise.

## Task 1: Fix the Staggered Menu Component

The project currently uses a **Staggered Menu** component sourced from
**React Bits**.

### Problem

When the user scrolls down from the home page, the staggered menu
appears correctly, but there is an additional `<div>` rendered by the
component that overlays or blocks interaction with the main content of
the page.

### Requirements

-   Remove or refactor the unnecessary blocking `<div>` while preserving
    functionality.
-   Only the **menu button** should appear when the user scrolls.
-   The menu button must remain fully interactive.
-   Opening and closing the staggered menu must continue to work.
-   No invisible overlays or containers should obstruct clicks or
    scrolling.
-   Preserve existing animations and transitions where possible.

## Task 2: Build an About Me Section

Create reusable pages and components for an **About Me** section using
**React Bits** components where appropriate.

### Requirements

-   Keep the components modular and template-like so they are easy to
    edit.
-   Include:
    -   Hero / Introduction
    -   Personal Summary
    -   Skills Showcase
    -   Experience Timeline
    -   Technologies & Tools
    -   Featured Projects (placeholder)
    -   Achievements / Certifications (placeholder)
    -   Contact / Call-to-Action

### Skills

Design the skills section to be data-driven and easily expandable,
supporting: - Frontend - Backend - Databases - Frameworks - Tools -
Design software - Other technical skills

### Experience

Implement a reusable timeline or card layout supporting: - Job title -
Organization - Date range - Description - Key achievements -
Technologies used

## Code Quality

-   Follow React best practices.
-   Keep components modular and reusable.
-   Avoid duplicated code.
-   Maintain readability and scalability.
-   Use descriptive naming.
-   Preserve existing functionality outside requested changes.

## Final Verification

Before completing the task, verify that: - The staggered menu no longer
blocks the main content. - The menu button still functions correctly. -
The About Me section is responsive. - All new components are reusable
and easy to customize. - The implementation integrates cleanly with the
existing project.
