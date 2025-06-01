import esbuildPluginTsc from "esbuild-plugin-tsc";

export default () => ({
  bundle: true,
  minify: true,
  sourcemap: true,
  exclude: ["@aws-sdk/*"],
  external: ["@aws-sdk/*"],
  plugins: [esbuildPluginTsc()]
});
