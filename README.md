# Zoo Text-to-CAD UI

This repository is an open-source example of how to quickly get up and running with Zoo's Text-to-CAD API endpoints. It is built using [SvelteKit](https://kit.svelte.dev/).

## Developing

1. Generate a dev API token from https://dev.zoo.dev
2. Set the `VITE_TOKEN` environment variable in `./.env.development` to the generated dev API token
3. Install yarn
4. Install dependencies with `yarn global add vite` and `yarn install`
5. Run the dev server with `yarn dev -- --open`

The full collection of scripts are listed in package.json.

## Building

To create a production version of your app:

```bash
yarn build
```

You can preview the production build with `yarn preview`.

## Before submitting a PR

Please run the following commands to ensure that your code is as ready for review as it can be:

```bash
yarn fmt --fix && yarn test
```

### Running Playwright E2E tests locally

In order to run our Playwright testing suite locally, please set the `PLAYWRIGHT_SESSION_COOKIE` variable within `.env.development` to a token from a logged in local development session. You can retrieve it by:

1. logging in to the project locally using the method outlined above
2. opening the Application tab in your browser developer tools
3. copying out the value of the cookie titled `__Secure-next-auth.session-token` with the domain of `localhost`

Now you should be able to run the `yarn test:integration` and `yarn test` commands successfully.
