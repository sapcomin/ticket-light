# Supabase Setup Guide

This guide will help you set up Supabase for your ticket management application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm/yarn installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `ticket-light` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
5. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL (looks like: `https://your-project-id.supabase.co`)
   - Anon public key (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Copy the `env.example` file to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste it into the SQL Editor and click "Run"

This will create:
- `tickets` table with all necessary fields
- `ticket_history` table for tracking changes
- Proper indexes for performance
- Row Level Security policies

## Step 5: Install Dependencies and Run

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Step 6: Test the Application

1. Open your browser to `http://localhost:5173`
2. Try creating a new ticket
3. Verify that tickets are saved to Supabase (check the Supabase dashboard > Table Editor)
4. Test updating ticket status and adding notes

## Database Schema

### Tables Created

**tickets**
- `id` (UUID, Primary Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `customer_name` (Text)
- `contact_number` (Text)
- `product_category` (Text)
- `product_model` (Text)
- `serial_number` (Text)
- `problem` (Text)
- `status` (Enum: open, in-progress, closed)

**ticket_history**
- `id` (UUID, Primary Key)
- `ticket_id` (UUID, Foreign Key)
- `timestamp` (Timestamp)
- `action` (Text)
- `description` (Text)
- `status` (Enum: open, in-progress, closed, nullable)

### Features

- Automatic timestamp updates
- Row Level Security enabled
- Optimized indexes for search performance
- Foreign key relationships
- Enum types for status consistency

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Check that your environment variables are correctly set
2. **"Failed to load tickets" error**: Verify the database schema was created successfully
3. **CORS errors**: Make sure you're using the correct Supabase URL

### Getting Help

- Check the Supabase documentation: https://supabase.com/docs
- Review the application logs in the browser console
- Check the Supabase dashboard for any error logs

## Next Steps

Once everything is working:

1. Consider setting up authentication if needed
2. Configure backup strategies
3. Set up monitoring and alerts
4. Customize the UI to match your brand
5. Add additional features like file attachments, email notifications, etc.
