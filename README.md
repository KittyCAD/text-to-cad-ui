# Zoo Text-to-CAD UI

This repository is an open-source example of how to quickly get up and running with Zoo's Text-to-CAD API endpoints. It is built using [SvelteKit](https://kit.svelte.dev/).

## Getting Started

Create `.env.development.local` copying `.env.development` as an example.

Run the local development server:

```bash
yarn
yarn dev
```

## Validating Changes

Run static analysis:

```bash
yarn fmt
yarn check
yarn lint
```

Run unit tests:

```bash
yarn test:unit
```

Run end-to-end tests:

```bash
yarn playwright install
yarn test:e2e
```
