# PassionPlay

Intimate truth or dare game for couples and adventurous friends.

## GitHub Pages Deployment

This Vite app is configured to be deployed to GitHub Pages from the `main` branch.

### How It Works

The deployment is automated using GitHub Actions:

1. **Automatic Deployment**: When changes are pushed to the `main` branch, the GitHub Actions workflow automatically builds and deploys the app to GitHub Pages.

2. **Manual Deployment**: You can also trigger a deployment manually from the Actions tab in GitHub.

### Setup Requirements

To enable GitHub Pages deployment:

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

The app will be available at: `https://thatchocolateguy.github.io/PassionPlay/`

### Development

```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Build for production
npm run build

# Build for GitHub Pages
GITHUB_PAGES=true npm run build
```

### Configuration

The app uses different base paths depending on the environment:
- **Development/Production server**: `/` (root)
- **GitHub Pages**: `/PassionPlay/` (repository name)

This is automatically handled by the `GITHUB_PAGES` environment variable in the build process.
