# Cloudflare Workers Boilerplate

Deploy Cloudflare Workers easily without sacrifying developer experience.

## Features

- TypeScript.
- GitHub Actions CI/CD.
- Logflare integration (free logs for development).
- Easy way to manage environment variables for development/staging/production, all within the repo.
- Development environment based on Node.js that emulates the web worker environment.

## Getting started

0. Create an account in Cloudflare and a token to manage workers.
1. Clone this repo.
2. Run `yarn` to install dependencies or use your preferred package manager.
3. Modify `.env.development` ([create an account in Logflare](https://logflare.app/) if you want).
4. Create `.env.production` with equivalent variables and run `gpg --symmetric --cipher-algo AES256 .env.production` to generate an encrypted version (save the passphrase for next step).
5. Add the following GitHub secrets: `PRODUCTION_PASSPHRASE`, `CF_ACCOUNT_ID`, `CF_API_TOKEN`.

## Architecture

- `src`: All the source code
  - `api`: Export Route objects meant to be consumed by workers. Each Route specifies an HTTP method, an URL path and a function as a handler.
  - `services`: Packages to communicate with third party services via HTTP protocol.
  - `utils`: Utility functions.
- `workers`: Each of the workers deployed to Cloudflare.
  - `setup.ts`: Common code to setup a router in CF workers, handle requests and responding.
  - `[worker-name]`
    - `index.ts`: Import Route object from `api` and setup worker.
    - `wrangler.toml`: Describes how the worker is built and where is deployed to.
    - `package.json`: Dummy package.json required by Wrangler. Do not install dependencies here.
- `webpack.config.js`: Webpack configuration for production builds only.
- `dev`: Lifts a Node server for development. Notice that the development runtime (Node) is slightly different from production runtim (WebWorker) so watch out for incompatibilities. Some of these differences are polyfilled in this directory.
- `tsconfig.json`: Describes TypeScript properties.

## Development

Run `yarn dev` to start a local server. Each route will be prefixed with the worker name. E.g. `https://my-example.my-org.workers.dev/path` will be `http://localhost:1337/my-example/path`.

Try adding new workers to the `workers` directory or simply adding new routes to one of them.

## FAQ

- Why not using the default CFW way of adding environment variables?

This is by adding variables to the UI or to `wrangler.toml`. I find that neither of those solutions are very flexible since, either you take the variables out of git itself, or just write them in plain text in a file. The proposed way keeps them in source control and encrypts the production variables.

- Why not using Serverless Framework instead of Wrangler?

Serverless Framework is great in general but its CF integration is no actively maintained. Specifically, it doens't support deploying to the free `workers.dev` domain that CF provides.

## Todos

- Add unit and integration tests.
- Add staging environment.
