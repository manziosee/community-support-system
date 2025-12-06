# Deployment Guide for Community Support System

This guide will walk you through deploying the Community Support System frontend to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
2. Node.js (v16 or later) and npm installed on your local machine
3. Git installed on your local machine

## Deployment Steps

### 1. Prepare Your Repository

Make sure all your changes are committed to your Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Deploy to Vercel

You can deploy to Vercel using one of the following methods:

#### Option 1: Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and log in to your account
2. Click on "Add New..." and select "Project"
3. Import your GitHub/GitLab/Bitbucket repository
4. Configure the project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"

#### Option 2: Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Log in to your Vercel account:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   cd /path/to/community-support-system/frontend
   vercel
   ```

4. Follow the prompts to complete the deployment

### 3. Environment Variables

If your application requires environment variables (like API endpoints), make sure to add them in the Vercel project settings:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add your environment variables
4. Redeploy your application

### 4. Custom Domain (Optional)

To set up a custom domain:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Domains
3. Add your custom domain and follow the verification steps

## Post-Deployment

After deployment, your application will be available at `https://your-project-name.vercel.app` or your custom domain if configured.

## Updating Your Deployment

Vercel automatically deploys new changes when you push to your connected Git repository. You can also trigger manual deployments from the Vercel dashboard.

## Troubleshooting

- If you encounter build errors, check the deployment logs in the Vercel dashboard
- Make sure all required environment variables are set
- Ensure your `vercel.json` configuration is correct
- Check the browser's developer console for any runtime errors
