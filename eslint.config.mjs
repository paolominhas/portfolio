import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import createMDX from '@next/mdx'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // 1. Global Ignores (Your existing block, slightly expanded)
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",     // Ignore static assets (images, 3D models)
    "**/*.mdx",      // Ignore raw MDX files so the linter doesn't trip over markdown syntax
  ]),

  // 2. Custom Rules Object
  {
    rules: {
      // Prevents errors when you write things like "Earth's magnetic field" or "doesn't"
      // React normally hates unescaped apostrophes in text, which is a nightmare for writing articles.
      "react/no-unescaped-entities": "off",

      // Downgrade unused variables to a warning instead of a hard error.
      // Useful when you are importing components (like charts) but haven't placed them in the text yet.
      "@typescript-eslint/no-unused-vars": "warn",

      // Optional: Enforce clean console logs (warns you if you leave console.log debugging in your production code)
      "no-console": ["warn", { allow: ["warn", "error"] }],
    }
  }
]);

export default eslintConfig;