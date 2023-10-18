# KittyCAD Text-to-CAD UI

This repository is an open-source example of how to quickly get up and running with KittyCAD's Text-to-CAD API endpoints. It is built using [SvelteKit](https://kit.svelte.dev/).

## Developing

Once you've installed dependencies with `yarn`, start a development server:

```bash
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

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

### Setting a cookie for local host

1. Get a dev api token from: https://dev.kittycad.io
2. Open the dev console and run the following:
```js
var CookieDate = new Date;
CookieDate.setFullYear(CookieDate.getFullYear() +10);
document.cookie = "__Secure-next-auth.session-token=YOUR_TOKEN;Secure;expires="+CookieDate.toUTCString() + ';';
```
