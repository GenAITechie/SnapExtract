# SnapExtract

**Version: 2.0.0**

## Objective

To provide a simple, efficient web application that allows users to upload images of bills or receipts, uses AI to extract key information (including line items and summed totals from multiple bills), and offers easy ways to view, summarize, and export this data.

## Core Features

*   **Multi-Image Upload:** Users can select or drag-and-drop one or more image files (PNG, JPG) representing their bills/receipts.
*   **AI-Powered Data Extraction:**
    *   Extracts vendor name, bill date, and total amount.
    *   If multiple images are uploaded, it consolidates information, identifying a primary vendor/date and **summing the total amounts**.
    *   Extracts **line items** (description and cost) from the bill(s) and aggregates them.
*   **AI-Generated Summary:** Provides a concise, human-readable summary of the extracted bill data.
*   **Data Presentation:** Clearly displays the extracted vendor, date, total amount, line items, and the AI summary.
*   **Data Export Options:**
    *   **Download as CSV:** Generates a CSV file with main bill details, line items, and summary.
    *   **Export to Google Sheets (Simulated):** Simulates sending data (including line items) to a Google Sheet and provides guidance for actual integration.
    *   **Email Data:** Opens the user's default email client with a pre-filled email containing the extracted data (vendor, date, total, line items, summary).
*   **Profile Email Setup:** Users can save an email address in their profile, which is used as the default recipient for the "Email Data" feature.

## Style & UI Guidelines

*   **Primary Color:** Light cool blue (`#73A9AD`)
*   **Background Color:** Very light blue (`#EBF2FA`)
*   **Accent Color:** Soft orange (`#DDA07A`) for key export actions.
*   **Font:** 'Inter' (sans-serif) for modern, readable text.
*   **Icons:** Minimalist, line-style icons (Lucide React).
*   **Layout:** Clean, efficient, responsive, with clear information hierarchy using cards.

## Technology Stack

*   **Frontend:** Next.js (App Router), React, TypeScript
*   **UI:** ShadCN UI components, Tailwind CSS
*   **AI:** Genkit (for interacting with AI models like Gemini)

## Getting Started

This is a NextJS starter in Firebase Studio.

To get started:
1.  Ensure you have Node.js and npm/yarn installed.
2.  Clone the repository.
3.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
4.  Set up your environment variables (e.g., for Genkit and Google AI). Create a `.env` file if needed.
5.  Run the development server for the Next.js app:
    ```bash
    npm run dev
    ```
6.  In a separate terminal, run the Genkit development server:
    ```bash
    npm run genkit:dev
    ```
    (Or `npm run genkit:watch` for auto-reloading on Genkit flow changes)
7.  Open your browser to `http://localhost:9002` (or the port specified by Next.js).

The main application page is `src/app/page.tsx`.
Genkit flows are located in `src/ai/flows/`.
