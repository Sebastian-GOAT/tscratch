# Instalation

## Quick Start

You can install the package using

```bash
npm install tscratch
```

or create a whole setup with Vite & TypeScript already integrated (recommended):

```bash
npx create-tscratch-app@latest project-name
cd project-name
npm install
```

Once you've created a project using `create-tscratch-app`, you get access to
these 3 commands:

1. `npm run dev`     => Starts the development server on port `5173`
2. `npm run build`   => Builds the production bundle inside `dist/`
2. `npm run preview` => Shows a preview of the project from `dist/`

## Deployment

You can deploy TScratch projects very easily on platforms like Vercel. To
deploy a project, you can follow these few steps:

1. Push your source code to a Github repository
2. Create a new project on Vercel
3. Import your Github repository
4. Click deploy

Your project is then live on a public domain, which you can share with
your friends or anyone.