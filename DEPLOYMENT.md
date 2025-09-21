# Deploy to Render - Free Tier Guide

This guide will help you deploy your Ticket Light application to Render using their free tier.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Supabase Project** - Already set up with your database

## Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit with Supabase integration"

# Add your GitHub repository as origin
git remote add origin https://github.com/yourusername/ticket-light.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com) and sign in
   - Click "New +" → "Static Site"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your `ticket-light` repository
   - Choose the main branch

3. **Configure Build Settings**
   - **Name**: `ticket-light` (or your preferred name)
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18` (or latest)

4. **Set Environment Variables**
   - Click "Advanced" → "Environment Variables"
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
     ```

5. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete (5-10 minutes)

### Option B: Manual Configuration

1. **Create New Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect GitHub repository

2. **Build Settings**
   - **Root Directory**: Leave empty
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**
   - Add your Supabase environment variables
   - Make sure to use the same names as in your `.env.local`

## Step 3: Configure Custom Domain (Optional)

1. **In Render Dashboard**
   - Go to your deployed service
   - Click "Settings" → "Custom Domains"
   - Add your domain name

2. **Update DNS**
   - Point your domain to Render's provided URL
   - Wait for DNS propagation (up to 24 hours)

## Step 4: Verify Deployment

1. **Check Your App**
   - Visit your Render URL
   - Test creating a ticket
   - Verify data is saved to Supabase

2. **Monitor Performance**
   - Check Render dashboard for logs
   - Monitor build and deployment status

## Free Tier Limitations

- **Build Time**: 750 minutes/month
- **Bandwidth**: 100GB/month
- **Sleep**: App sleeps after 15 minutes of inactivity
- **Wake Time**: ~30 seconds to wake from sleep

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables Not Working**
   - Double-check variable names match exactly
   - Ensure no extra spaces or quotes
   - Redeploy after adding variables

3. **App Not Loading**
   - Check if app is sleeping (free tier limitation)
   - Verify build completed successfully
   - Check browser console for errors

4. **Supabase Connection Issues**
   - Verify environment variables are set correctly
   - Check Supabase project is active
   - Ensure database schema is created

### Getting Help

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **Check Logs**: Always check build and runtime logs first

## Production Optimizations

### Performance
- Enable gzip compression (automatic on Render)
- Optimize images and assets
- Use CDN for static assets

### Security
- Never commit `.env` files
- Use environment variables for all secrets
- Enable HTTPS (automatic on Render)

### Monitoring
- Set up uptime monitoring
- Monitor build times and performance
- Track error rates and user activity

## Next Steps

Once deployed successfully:

1. **Set up monitoring** and alerts
2. **Configure custom domain** if needed
3. **Set up CI/CD** for automatic deployments
4. **Add analytics** to track usage
5. **Consider upgrading** to paid tier for production use

Your ticket management system is now live and accessible worldwide! 🚀
