#!/bin/bash

# Deploy script for Ticket Light to Render
echo "🚀 Deploying Ticket Light to Render..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    git status --short
    echo ""
    read -p "Do you want to commit all changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Deploy to Render - $(date)"
    else
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub successfully!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Go to https://render.com"
    echo "2. Sign in and click 'New +' → 'Static Site'"
    echo "3. Connect your GitHub repository"
    echo "4. Use these settings:"
    echo "   - Build Command: npm ci && npm run build"
    echo "   - Publish Directory: dist"
    echo "   - Node Version: 18"
    echo "5. Add environment variables:"
    echo "   - VITE_SUPABASE_URL=your_supabase_url"
    echo "   - VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Failed to push to GitHub. Please check your git configuration."
    exit 1
fi
