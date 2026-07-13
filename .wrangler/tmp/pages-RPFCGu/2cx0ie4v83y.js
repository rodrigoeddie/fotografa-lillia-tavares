// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_nuxt/*",
    "/_scripts/*",
    "/_headers",
    "/.DS_Store",
    "/.DS_Store.br",
    "/.DS_Store.gz",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
    "/apple-touch-icon.png",
    "/config.json",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/favicon.ico",
    "/favicon.png",
    "/assets/.DS_Store",
    "/assets/.DS_Store.br",
    "/assets/.DS_Store.gz",
    "/assets/es-module-shims.js",
    "/assets/es-module-shims.js.br",
    "/assets/es-module-shims.js.gz",
    "/fonts/Lato-Black.woff",
    "/fonts/Lato-Black.woff2",
    "/fonts/Lato-Regular.woff",
    "/fonts/Lato-Regular.woff2",
    "/fonts/TheGirlNextDoor.ttf",
    "/fonts/TheGirlNextDoor.ttf.br",
    "/fonts/TheGirlNextDoor.ttf.gz",
    "/fonts/TheGirlNextDoor.woff",
    "/fonts/TheGirlNextDoor.woff2",
    "/assets/images/.DS_Store",
    "/assets/images/.DS_Store.br",
    "/assets/images/.DS_Store.gz",
    "/assets/images/bg-dark.webp",
    "/assets/images/bg.webp",
    "/assets/images/share.webp",
    "/assets/images/depoimentos/.DS_Store",
    "/assets/images/depoimentos/.DS_Store.br",
    "/assets/images/depoimentos/.DS_Store.gz",
    "/assets/images/depoimentos/reviewer-0.jpg",
    "/assets/images/depoimentos/reviewer-1.jpg",
    "/assets/images/depoimentos/reviewer-10.jpg",
    "/assets/images/depoimentos/reviewer-11.jpg",
    "/assets/images/depoimentos/reviewer-12.jpg",
    "/assets/images/depoimentos/reviewer-13.jpg",
    "/assets/images/depoimentos/reviewer-14.jpg",
    "/assets/images/depoimentos/reviewer-15.jpg",
    "/assets/images/depoimentos/reviewer-16.jpg",
    "/assets/images/depoimentos/reviewer-17.jpg",
    "/assets/images/depoimentos/reviewer-18.jpg",
    "/assets/images/depoimentos/reviewer-19.jpg",
    "/assets/images/depoimentos/reviewer-2.jpg",
    "/assets/images/depoimentos/reviewer-20.jpg",
    "/assets/images/depoimentos/reviewer-21.jpg",
    "/assets/images/depoimentos/reviewer-22.jpg",
    "/assets/images/depoimentos/reviewer-23.jpg",
    "/assets/images/depoimentos/reviewer-24.jpg",
    "/assets/images/depoimentos/reviewer-25.jpg",
    "/assets/images/depoimentos/reviewer-26.jpg",
    "/assets/images/depoimentos/reviewer-27.jpg",
    "/assets/images/depoimentos/reviewer-28.jpg",
    "/assets/images/depoimentos/reviewer-29.jpg",
    "/assets/images/depoimentos/reviewer-3.jpg",
    "/assets/images/depoimentos/reviewer-30.jpg",
    "/assets/images/depoimentos/reviewer-31.jpg",
    "/assets/images/depoimentos/reviewer-32.jpg",
    "/assets/images/depoimentos/reviewer-33.jpg",
    "/assets/images/depoimentos/reviewer-34.jpg",
    "/assets/images/depoimentos/reviewer-35.jpg",
    "/assets/images/depoimentos/reviewer-36.jpg",
    "/assets/images/depoimentos/reviewer-37.jpg",
    "/assets/images/depoimentos/reviewer-38.jpg",
    "/assets/images/depoimentos/reviewer-39.jpg",
    "/assets/images/depoimentos/reviewer-4.jpg",
    "/assets/images/depoimentos/reviewer-40.jpg",
    "/assets/images/depoimentos/reviewer-41.jpg",
    "/assets/images/depoimentos/reviewer-42.jpg",
    "/assets/images/depoimentos/reviewer-43.jpg",
    "/assets/images/depoimentos/reviewer-44.jpg",
    "/assets/images/depoimentos/reviewer-45.jpg",
    "/assets/images/depoimentos/reviewer-46.jpg",
    "/assets/images/depoimentos/reviewer-47.jpg",
    "/assets/images/depoimentos/reviewer-48.jpg",
    "/assets/images/depoimentos/reviewer-49.jpg",
    "/assets/images/depoimentos/reviewer-5.jpg",
    "/assets/images/depoimentos/reviewer-50.jpg",
    "/assets/images/depoimentos/reviewer-51.jpg",
    "/assets/images/depoimentos/reviewer-52.jpg",
    "/assets/images/depoimentos/reviewer-53.jpg",
    "/assets/images/depoimentos/reviewer-54.jpg",
    "/assets/images/depoimentos/reviewer-55.jpg",
    "/assets/images/depoimentos/reviewer-56.jpg",
    "/assets/images/depoimentos/reviewer-57.jpg",
    "/assets/images/depoimentos/reviewer-58.jpg",
    "/assets/images/depoimentos/reviewer-59.jpg",
    "/assets/images/depoimentos/reviewer-6.jpg",
    "/assets/images/depoimentos/reviewer-60.jpg",
    "/assets/images/depoimentos/reviewer-61.jpg",
    "/assets/images/depoimentos/reviewer-62.jpg",
    "/assets/images/depoimentos/reviewer-63.jpg"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/rodrigodemelolima/sites/rodrigo/fotografa-lillia-tavares/.wrangler/tmp/pages-RPFCGu/bundledWorker-0.4333031343999013.mjs";
import { isRoutingRuleMatch } from "/Users/rodrigodemelolima/sites/rodrigo/fotografa-lillia-tavares/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/rodrigodemelolima/sites/rodrigo/fotografa-lillia-tavares/.wrangler/tmp/pages-RPFCGu/bundledWorker-0.4333031343999013.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=2cx0ie4v83y.js.map
