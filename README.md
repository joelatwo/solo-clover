This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on GitHub Pages

This project is configured for static site generation and can be deployed to GitHub Pages.

### Setup Instructions:

1. **Enable GitHub Pages in your repository:**

   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions" (not "Deploy from a branch")
   - Save the settings

2. **Push your code:**

   - Commit and push all changes to your `main` or `master` branch
   - The GitHub Actions workflow will automatically build and deploy your site

3. **Access your site:**

   - After deployment completes, your site will be available at:
     - `https://[your-username].github.io/[repository-name]/`
   - If your repository is at the root level, you may need to uncomment the `basePath` and `assetPrefix` lines in `next.config.ts` and set them to your repository name

4. **Manual deployment:**
   - You can also trigger a manual deployment by going to Actions → Deploy to GitHub Pages → Run workflow

### Local Testing:

To test the static export locally:

```bash
npm run export
```

This will generate the static files in the `out` directory, which you can serve with any static file server.
