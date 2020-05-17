# Microservices

Deployed to Cloudflare as web workers.

Architecture:

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
- `dev-server.ts`: Lifts an Express server for development and sets up all the routes in `api`. Notice that environment (Node) is slightly different from production (WebWorker) so watch out for incompatibilities. Some of these differences are polyfilled in this file (such as `fetch` global function or environment variables).
- `tsconfig.json`: Describes TypeScript properties.
