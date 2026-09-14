# Quickstart: CRM Dashboard Template

This document provides a runnable validation guide to prove the CRM Dashboard features work end-to-end locally.

## Prerequisites

- Node.js (v18+)
- Git
- SQLite (included with Prisma)

## Setup Commands

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory and add a NextAuth secret:
   ```env
   AUTH_SECRET="your-random-secret-key"
   DATABASE_URL="file:./dev.db"
   ```

3. **Initialize the database**:
   Run Prisma migrations to create the SQLite database file and tables:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database** (Optional but recommended):
   Run the seed script to create the demo user and sample CRM data:
   ```bash
   npx prisma db seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Validation Scenarios

### Scenario 1: Authentication and Dashboard
1. Navigate to `http://localhost:3000`. You should be redirected to `/login`.
2. Login with the seeded demo credentials (usually documented in console or `.env.example`, e.g., `demo@example.com` / `password123`).
3. You are redirected to `/dashboard`.
4. Verify the dashboard summary tiles (Contacts, Companies, Deals) show numbers > 0 if seeded.

### Scenario 2: Create a Contact
1. Click on **Contacts** in the sidebar.
2. Click **New Contact**.
3. Fill in the required fields (First Name, Last Name, Email).
4. Click **Save**.
5. Verify the new contact appears in the Contacts list.

### Scenario 3: Create a Company and Associate Contact
1. Click on **Companies** in the sidebar.
2. Click **New Company**.
3. Fill in the required fields (Name) and click **Save**.
4. Go back to **Contacts**, edit the previously created contact.
5. Select the newly created Company from the dropdown and save.
6. Verify the Contact's list view now shows the associated Company.

### Scenario 4: Manage a Deal in the Kanban Board
1. Click on **Deals** in the sidebar.
2. Click **New Deal**. Fill out the Title and Value, and set stage to `Prospect`. Save.
3. Verify the deal appears in the `Prospect` column on the board.
4. On the deal card, use the stage selector dropdown to change it to `Negotiation`.
5. Verify the card immediately moves to the `Negotiation` column.

### Scenario 5: Logout
1. Click the **User Menu** (avatar or name in header).
2. Click **Sign out**.
3. Verify you are redirected back to the `/login` page, and trying to access `/dashboard` redirects you again to `/login`.
