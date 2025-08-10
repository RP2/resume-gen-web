# Deployment Guide

This document explains how to deploy your own instance of the Resume Generator with AI optimization to Cloudflare Pages for higher usage limits.

## Overview

The Resume Generator uses OpenAI's GPT-4o model for AI optimization. By default, it's designed to work within OpenAI's generous free tier limits, but if you need higher usage limits, you can deploy your own instance.

## OpenAI Free Tier Limits (as of 2025)

- **$5 free credit** for new accounts (expires after 3 months)
- **GPT-4o**: $2.50 per 1M input tokens, $10.00 per 1M output tokens
- **Typical resume analysis**: ~2,000-4,000 tokens per analysis
- **Estimated cost per analysis**: ~$0.01-0.03
- **Free tier allows**: ~150-400 resume analyses

For most users, the free tier is more than sufficient. Deploy your own instance only if you need to exceed these limits.

## Prerequisites

1. **GitHub Account**: To store your code and connect to Cloudflare Pages
2. **Cloudflare Account**: Free account is sufficient
3. **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
4. **Node.js**: Version 18+ for local development (required for build process)

## Step-by-Step Deployment

### 1. Fork the Repository

1. Go to the [resume-gen-web GitHub repository](https://github.com/RP2/resume-gen-web)
2. Click "Fork" to create your own copy
3. Clone your fork locally (optional, for customization):
   ```bash
   git clone https://github.com/YOUR-USERNAME/resume-gen-web.git
   cd resume-gen-web
   ```

### 2. Set Up Cloudflare Pages

1. **Login to Cloudflare Dashboard**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to "Pages" in the sidebar

2. **Create New Project**
   - Click "Create a project"
   - Choose "Connect to Git"
   - Select your GitHub account and the forked repository
   - Click "Begin setup"

3. **Configure Build Settings**
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: Leave empty (uses repository root)
   - **Node.js version**: `18.0.0` or later (required for dependencies)

4. **Environment Variables**
   - In the "Environment variables" section, you don't need to add any variables
   - The OpenAI API key will be provided by users in the application settings
   - No server-side secrets required - all configuration is client-side

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for the initial build (usually 2-3 minutes)
   - The Cloudflare Pages Function (`/api/openai`) will be automatically deployed

### 3. Configure Custom Domain (Optional)

1. In your Cloudflare Pages project dashboard
2. Go to "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain name
5. Follow the DNS configuration instructions

### 4. Verify Deployment

1. **Test the Application**
   - Visit your deployed site (e.g., `https://your-project.pages.dev`)
   - Click the settings icon to add your OpenAI API key
   - Try analyzing a resume with a job description

2. **Check API Function**
   - The Cloudflare Pages Function should automatically handle OpenAI API calls
   - Look for successful analysis without CORS errors

## Usage Monitoring

### Track Token Usage

The application automatically tracks and displays token usage for each analysis:

- **Prompt tokens**: Tokens used for your resume and job description
- **Completion tokens**: Tokens used for the AI response
- **Total tokens**: Sum of prompt and completion tokens
- **Estimated cost**: Based on current OpenAI pricing

### Monitor Your OpenAI Usage

1. **OpenAI Dashboard**
   - Visit [OpenAI Platform Usage](https://platform.openai.com/usage)
   - Monitor your daily/monthly usage
   - Set up usage alerts

2. **Rate Limiting**
   - OpenAI applies rate limits per minute/day
   - The app handles rate limit errors gracefully
   - Consider implementing additional client-side rate limiting if needed

## Cost Management

### Optimize Token Usage

1. **Keep job descriptions concise** - Longer descriptions increase token usage
2. **Use targeted analyses** - Avoid analyzing the same resume repeatedly
3. **Review suggestions carefully** - Each re-analysis costs tokens

### Set Up Billing Alerts

1. In your OpenAI account, go to "Billing"
2. Set up usage alerts at different thresholds (e.g., $1, $3, $5)
3. Consider setting a hard limit to prevent unexpected charges

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (must be 18+)
   - Verify all dependencies install correctly
   - Check build logs in Cloudflare Pages dashboard

2. **API Not Working**
   - Verify the Cloudflare Pages Function is deployed (`functions/api/openai.js`)
   - Check browser network tab for CORS errors
   - Test with a valid OpenAI API key

3. **High Token Usage**
   - Monitor token usage in the app
   - Consider shorter job descriptions
   - Check for infinite loops or repeated API calls

### Getting Help

1. **Check the browser console** for JavaScript errors
2. **Review Cloudflare Pages logs** in the dashboard
3. **Test API key directly** in OpenAI Playground
4. **Open an issue** in the GitHub repository with detailed error information

## Security Considerations

### API Key Security

- **Never commit API keys** to your repository
- **Users provide their own keys** - keys are stored locally in the browser
- **Keys are sent securely** to your Cloudflare function over HTTPS
- **No server-side storage** - keys are not logged or stored on your server

### Cloudflare Pages Functions

- Functions run in Cloudflare's secure environment
- No persistent storage - API keys are not retained between requests
- All requests are proxied securely to OpenAI's API
- CORS headers are properly configured for browser security

## Updates and Maintenance

### Keeping Your Fork Updated

1. **Add upstream remote** (one-time setup):

   ```bash
   git remote add upstream https://github.com/RP2/resume-gen-web.git
   ```

2. **Sync with upstream** (when updates are available):

   ```bash
   git fetch upstream
   git checkout master
   git merge upstream/master
   git push origin master
   ```

3. **Cloudflare Auto-Deploy**
   - Cloudflare Pages automatically redeploys when you push to your main branch
   - No manual intervention needed for updates

### Monitoring Performance

- Use Cloudflare Analytics to monitor usage
- Set up alerts for high traffic or errors
- Review OpenAI usage monthly to optimize costs

## Alternative Deployment Options

While this guide focuses on Cloudflare Pages (recommended for its free Functions tier), you can also deploy to:

- **Vercel**: Similar setup with Edge Functions
- **Netlify**: Using Netlify Functions
- **Railway**: For a more traditional server deployment
- **Docker**: For self-hosted deployments

Each platform will require similar setup but different configuration for the API proxy function.

## Support

For deployment-specific issues:

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Astro Deployment Guides](https://docs.astro.build/en/guides/deploy/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

For application-specific issues:

- Open an issue in the GitHub repository
- Include deployment logs and error messages
- Specify your deployment platform and configuration
