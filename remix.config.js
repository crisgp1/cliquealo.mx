/** @type {import('@remix-run/dev').AppConfig} */
export default {
  appDirectory: "app",
  assetsBuildDirectory: "build/client",
  publicPath: "/assets/",
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  future: {
    // Future flags for React Router v7 compatibility
    v3_fetcherPersist: true,
    v3_lazyRouteDiscovery: true,
    v3_relativeSplatPath: true,
    v3_singleFetch: true,
    v3_throwAbortReason: true,
  }
};
