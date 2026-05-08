# Frontend (Next.js)

This repository contains the Next.js frontend for the Automated System Design project.

Prerequisites

- Node.js 18+ (recommended)
- npm or yarn

Quick start

1. Install dependencies

   ```
   npm install
   ```

2. Configure environment

   Create a .env in the project root (based on .env.example).

3. Run development server

   ```
   npm run dev
   ```

   The app will be available at http://localhost:3000

4. Build and Start for production

   ```
   npm run build
   npm start
   ```

Useful scripts

- npm run dev — start dev server with hot reload
- npm run build — compile production build
- npm start — run compiled production server
- npx tsc --noEmit — check TypeScript types

Troubleshooting

- If ports are in use, change PORT env or use --port when starting.
- Delete node_modules and reinstall if dependency errors occur.

Notes

- This README is minimal. Add project-specific setup, env variable names, and deployment notes as needed.
