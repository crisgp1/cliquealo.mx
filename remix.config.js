/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverBuildTarget: "vercel",
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  ignoredRouteFiles: ["**/.*"]
};
