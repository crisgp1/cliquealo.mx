/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverBuildTarget: "vercel", // 💥 Remix usará .vercel/output automáticamente
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
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
