/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverBuildTarget: "vercel", // 💥 Remix usará .vercel/output automáticamente
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  ignoredRouteFiles: ["**/.*"]
};
