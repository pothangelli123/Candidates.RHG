# Candidate Tracker

A modern web application to track and manage job candidates throughout the recruitment process.

## Features

- 📋 Manage candidates with detailed profiles
- 🏷️ Track candidate status (new, reviewing, interviewed, offer, rejected)
- 📊 Dashboard with candidate statistics
- 🔍 View and edit candidate details
- 🔐 Admin authentication and profile management
- 👤 User profiles with role management

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/)
- **UI Components**: Custom components with Framer Motion
- **PDF Generation**: React-PDF

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account and project

### Database Setup

Follow the instructions in [DATABASE-SETUP.md](./DATABASE-SETUP.md) to set up your Supabase database correctly.

This includes creating:
- A `profiles` table for admin users
- A `candidates` table for job applicants
- The proper Row Level Security policies

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/candidate-tracker.git
   cd candidate-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy the environment variables file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

The easiest way to deploy this application is to use [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Add the Supabase environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Environment Variables Security

⚠️ **IMPORTANT**: Never commit `.env.local` with your actual Supabase credentials to version control. 
The `.env.local` file is included in `.gitignore` to prevent this. Always use `.env.local.example` 
with placeholder values in your repository.

## First-time Setup After Deployment

1. Visit your deployed site and navigate to `/admin/signup` to create the first admin account
2. This initial account will automatically have admin privileges
3. You can then use this account to manage candidates and other admin accounts

## License

This project is licensed under the MIT License.
