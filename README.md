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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy To GitHub Pages

This project is configured for GitHub Pages with:

- `output: "export"` in `next.config.mjs`
- `basePath` and `assetPrefix` set to `/React`
- `deploy` script publishing the `out` directory

Use these commands:

```bash
npm install
npm run deploy
```

Then in GitHub repository settings, set Pages source to `gh-pages` branch.

## FSD Structure

This project is being migrated to Feature-Sliced Design incrementally.

Current target layers:

- `src/app`: Next.js App Router entries only
- `src/page-modules`: page-level FSD modules used by `src/app`
- `src/widgets`: large UI blocks composed from features/entities/shared
- `src/features`: user actions and interaction logic
- `src/entities`: domain entities and their UI/model
- `src/shared`: reusable UI, libs, config, api, types

Path aliases:

- `@app/*`
- `@pages/*`
- `@widgets/*`
- `@features/*`
- `@entities/*`
- `@shared/*`

Migration rule:

- Keep route files in `src/app/**/page.tsx` thin
- Move page implementation into `src/page-modules/<page-name>/ui/*`
- Expose page modules through `src/page-modules/<page-name>/index.ts`
- In Next.js App Router projects, avoid `src/pages` as an FSD folder name because Next treats it as the Pages Router
- Migrate old `src/sharedUI` modules into `src/shared` gradually instead of moving everything at once
