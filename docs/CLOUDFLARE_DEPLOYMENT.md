# Cloudflare Pages Deployment Guide

This resume builder is designed to work as a static site on Cloudflare Pages with serverless functions for OpenAI API integration.

## Architecture

### Local Development

- **Static Site**: Astro generates a static site for optimal performance
- **OpenAI SDK**: Uses the official OpenAI SDK with `dangerouslyAllowBrowser: true`
- **Local Storage**: All resume data stays in the browser's localStorage

### Production (Cloudflare Pages)

- **Static Hosting**: Site is served as static files from Cloudflare's CDN
- **Serverless Functions**: `/functions/api/openai.js` handles OpenAI API requests
- **CORS Handling**: Cloudflare Pages Function acts as a CORS proxy
- **Privacy**: API keys are sent to the function but never stored server-side

## Deployment to Cloudflare Pages

### 1. Connect Repository

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Connect your GitHub repository
3. Select the `resume-gen-web` repository

### 2. Build Configuration

Set these build settings in Cloudflare Pages:

```
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
```

### 3. Environment Variables

No environment variables are needed! API keys are provided by users and handled client-side.

### 4. Custom Domain (Optional)

- Add your custom domain in the Pages dashboard
- Cloudflare will automatically handle SSL certificates

## How It Works

### Client-Side Flow

1. **User Input**: User enters their OpenAI API key in settings
2. **Resume Data**: All resume information stays in browser localStorage
3. **AI Analysis**: When user requests AI optimization:
   - **Development**: Direct call to OpenAI API using SDK
   - **Production**: Request sent to `/api/openai` Cloudflare Function

### Serverless Function (`/functions/api/openai.js`)

- **Input**: Receives API key, messages, model, temperature from client
- **Proxy**: Makes authenticated request to OpenAI API
- **Output**: Returns OpenAI response with proper CORS headers
- **Security**: API key is not stored, only used for the request

### Privacy & Security

- **No Data Storage**: No resume data is stored on servers
- **API Key Handling**: Keys are sent with requests but never persisted
- **Local-First**: All data processing happens in the browser
- **HTTPS**: All communications are encrypted

## Development vs Production

| Aspect        | Development              | Production               |
| ------------- | ------------------------ | ------------------------ |
| OpenAI Client | Official SDK             | Custom fetch to function |
| CORS          | Browser allows with flag | Handled by CF function   |
| API Key       | Direct to OpenAI         | Proxied through function |
| Performance   | Direct connection        | CDN + Edge functions     |

## Benefits of This Architecture

### For Users

- **Privacy**: Resume data never leaves their device
- **Performance**: Static site loads instantly
- **Reliability**: Cloudflare's global network
- **Cost**: Free hosting for most use cases

### For Developers

- **Simple Deployment**: Just connect repository
- **No Backend**: Serverless functions handle API calls
- **Scalability**: Automatically scales with traffic
- **Security**: No servers to maintain or secure

## File Structure

```
/
├── src/                    # Astro source files
├── functions/              # Cloudflare Pages Functions
│   └── api/
│       └── openai.js      # OpenAI API proxy
├── dist/                  # Built static files (auto-generated)
└── package.json
```

## Troubleshooting

### Common Issues

**1. "CORS error" in development**

- This is expected and handled by the code
- The app detects development vs production and uses appropriate method

**2. "Function not found" after deployment**

- Check that `functions/api/openai.js` was deployed
- Verify the function structure matches Cloudflare Pages requirements

**3. "API key invalid"**

- User needs to provide their own OpenAI API key
- Test the key directly with OpenAI's playground first

### Testing Deployment

1. **Local Preview**: `npm run build && npm run preview`
2. **Check Functions**: After deployment, test `/api/openai` endpoint
3. **Monitor Logs**: Use Cloudflare dashboard to monitor function execution

## Cost Considerations

### Cloudflare Pages

- **Free Tier**: 500 builds/month, unlimited requests
- **Pro Tier**: $20/month for higher limits
- **Bandwidth**: Free (unlimited)

### OpenAI API

- **Users pay**: Each user provides their own API key
- **Cost Control**: Users control their own usage and costs
- **Typical Cost**: $0.01-0.05 per resume analysis

This architecture provides a scalable, privacy-first solution that minimizes operational costs while maximizing user privacy and performance.
