# Zoo Text-to-CAD UI

This repository is an open-source example of how to quickly get up and running with Zoo's Text-to-CAD API endpoints. It is built using [SvelteKit](https://kit.svelte.dev/).

## Getting Started

Create `.env.development.local` copying `.env.development` as an example.

Run the local development server:

```bash
npm install
npm run dev
```

## Validating Changes

Run static analysis:

```bash
npm run fmt
npm run check
npm run lint
```

Run unit tests:

```bash
npm run test:unit
```

Run end-to-end tests:

```bash
npm run playwright install
npm run test:e2e
```
