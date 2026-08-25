# Installation

Quick install

Using npm:

```bash
npm install tscratch
```

Using yarn:

```bash
yarn add tscratch
```

Create a starter project (recommended)

Create a Vite + TypeScript starter using the official helper:

```bash
npx create-tscratch-app@latest my-project
cd my-project
npm install
```

Common commands (from the starter):

```bash
npm run dev     # start local dev server (default port 5173)
npm run build   # produce production bundle in dist/
npm run preview # serve the production build locally
```

Deployment

Deploying a TScratch-based project to platforms like Vercel is straightforward:

1. Push the project to a GitHub repository.
2. Create a new project on Vercel and import the repo.
3. Configure the build command (typically `npm run build`) and the publish directory (`dist`).
4. Deploy.

Your project will be available on a public URL after deployment.