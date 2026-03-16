import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "ai-sdk/index": "src/ai-sdk/index.ts",
    "ai-sdk/react": "src/ai-sdk/react.tsx",
    "langchain/index": "src/langchain/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "ai", "@langchain/core"],
  treeshake: true,
});
