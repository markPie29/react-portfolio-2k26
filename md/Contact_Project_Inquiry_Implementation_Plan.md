# Contact & Project Inquiry Implementation Plan

## Overview

Transform the existing Contact section into a professional Project
Inquiry & Discovery Call workflow.

## Objectives

-   Allow potential clients to submit detailed project inquiries.
-   Automatically send the inquiry to my email.
-   Redirect clients to schedule a discovery call after successful
    submission.
-   Maintain the premium look and feel.
-   Use a serverless architecture.
-   No traditional database.

## Architecture

``` text
Client
↓
React Multi-Step Form
↓
React Hook Form + Zod
↓
Serverless Function (Netlify/Vercel)
↓
Resend API
↓
Email Notification
↓
Success Screen
↓
Cal.com / Calendly
```

## Tech Stack

-   React 19
-   TypeScript
-   Tailwind CSS v4
-   React Hook Form
-   Zod
-   Resend API
-   Netlify/Vercel Functions
-   Cal.com or Calendly

## Form Steps

### Step 1 --- Personal Information

-   Full Name \*
-   Company / Business
-   Email \*
-   Phone
-   Website (Optional)

### Step 2 --- Project Information

**Services** - Custom Software - Website Development - HRIS - Payroll -
POS - Inventory - Scheduling - UI/UX - Web Design - Graphic Design -
Motion Design - Video Editing - Other

**Budget** - Under ₱20,000 - ₱20,000--₱50,000 - ₱50,000--₱100,000 -
₱100,000--₱250,000 - ₱250,000+

**Timeline** - ASAP - Within 1 Month - 1--3 Months - 3--6 Months -
Flexible

**Project Type** - New Project - Existing Improvements - Redesign -
Maintenance - Consultation

### Step 3 --- Project Requirements

**Feature Chips** - Authentication - Dashboard - User Management -
Inventory - Payroll - Reports - Analytics - API Integration - Payment
Gateway - Mobile Responsive - AI Features - Notifications - QR Code -
Barcode - Other

**Project Description** Prompt users to explain goals, users, required
features, and references.

**Optional Uploads** - PDF - Images - Wireframes - Figma exports - Brand
Guidelines - Logos

## Validation

Required: - Name - Email - Service - Budget - Timeline - Project
Description

Optional: - Company - Phone - Website - Attachments

## Submission Flow

Show loading → success screen → "Schedule Discovery Call" button.

## Email

Serverless function formats and sends inquiry through Resend. No
database storage.

## UI Enhancements

-   Multi-step form
-   Progress indicator
-   Animated chips
-   Auto-growing textarea
-   Drag-and-drop upload
-   Loading animation
-   Success animation

## Future Integrations

Allow replacing email-only flow with: - Notion - Airtable - HubSpot -
Google Sheets - Supabase - PostgreSQL

without changing the frontend.
