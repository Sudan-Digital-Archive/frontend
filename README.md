# To Dos

- Tidy up UX once all working

# Overview

This is the frontend for the Sudan Digital Archive project.

It is a static site written in React and bundled with Vite.

## Local Development

First, you will need the backend running. Follow the steps in the repo
[here](https://github.com/Sudan-Digital-Archive/sudan-digital-archive-api)
to get it stood up.

Clone the repo, install `https://pnpm.io/`, run `pnpm i` and then
`pnpm run dev`.

### Environment Variables

To point the frontend at a different API, create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080/sda-api/api/v1/
```

Without this, the app defaults to `https://api.sudandigitalarchive.com/sda-api/api/v1/` in development mode.

### Notes on Replay Web Page

This site makes heavy use of
[replayweb.page](https://github.com/webrecorder/replayweb.page)
to embed web archives in the browser. This is cool but it was quite fiddly
to make it work in React. Things to note:

- It uses two scripts, one which is in the `public/replay` directory.
  The other is injected into `index.html`.
- The replay web component handles service worker stuff out of the box. You
  DO NOT need to add this into the app; the web component does it for you.
- This replay web component does not play well with React router. This cost me hours
  of dev time to debug. Apart from requests to `/replay/sw.js` and `/replay/ui.js`,
  React router must not intercept any requests to `/replay/*`. The replay web
  component intercepts all requests to `/replay/` urls in order to render the archive
  file, so you will get very weird errors if these are also intercepted by React router.

## Testing

Run `pnpm run test`. Note that tests run in CI on pull and merge to main.

## Deployment

Merging to main automatically deploys the application. This is configured in Digital
Ocean.
