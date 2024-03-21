# Zoo Text-to-CAD UI

This repository is an open-source example of how to quickly get up and running with Zoo's Text-to-CAD API endpoints. It is built using [SvelteKit](https://kit.svelte.dev/).

## Developing

1. Remove the `.example` from `/.env.example`, leaving it `.env` (Git will ignore this and prevent you from accidentally publishing your dev API token)
2. Set the `VITE_ZOO_DEV_TOKEN` environment variable in with a **dev** API token from: https://dev.zoo.dev in `/.env`
3. Set the `PLAYWRIGHT_TESTING_TOKEN` environment variable with a **prod** API token from: https://zoo.dev in `/.env`
4. Run the dev server with `yarn dev -- --open`

## Building

To create a production version of your app:

```bash
yarn build
```

You can preview the production build with `yarn preview`.

## Before submitting a PR

Please run the `yarn prep` to lint, format, type-check and test your code to ensure it's as ready for code review as possible.

### Running Playwright E2E tests locally

If you've set a `VITE_ZOO_DEV_TOKEN` in `/.env` as described above, you should be able to run the `yarn test` command successfully, which runs `yarn test:integration` and `yarn test:unit` in series.

- We use [Playwright](https://playwright.dev) for end-to-end testing. Try running `yarn test:integration --ui` for a handy visualizer of your tests as they run!
- We use [Vitest](https://vitest.dev) for unit and component testing.
