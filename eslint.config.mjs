import js from "@eslint/js"
import typescriptEslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import prettierConfig from "eslint-config-prettier"

export default [
  // 基础 JavaScript 规则
  js.configs.recommended,

  // TypeScript 规则 (使用 typescript-eslint v8)
  ...typescriptEslint.configs.recommended,

  // React 规则
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
    },
  },

  // React Hooks 规则
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
    },
  },

  // Next.js 特定规则
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },

  // Prettier 集成 (必须放在最后)
  prettierConfig,

  // 自定义规则覆盖
  {
    rules: {
      // TypeScript 规则
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // JavaScript 规则
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
    },
  },

  // 全局设置
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",
        FormData: "readonly",
        Blob: "readonly",
        File: "readonly",
        FileReader: "readonly",
        Image: "readonly",
        Audio: "readonly",
        SpeechSynthesisUtterance: "readonly",
        SpeechRecognition: "readonly",
        webkitSpeechRecognition: "readonly",
        MutationObserver: "readonly",
        IntersectionObserver: "readonly",
        ResizeObserver: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        history: "readonly",
        location: "readonly",
        performance: "readonly",
        customElements: "readonly",
        HTMLElement: "readonly",
        Element: "readonly",
        Node: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        Error: "readonly",
        Promise: "readonly",
        Map: "readonly",
        Set: "readonly",
        WeakMap: "readonly",
        WeakSet: "readonly",
        Proxy: "readonly",
        Reflect: "readonly",
        JSON: "readonly",
        Math: "readonly",
        Date: "readonly",
        RegExp: "readonly",
        Array: "readonly",
        Object: "readonly",
        String: "readonly",
        Number: "readonly",
        Boolean: "readonly",
        BigInt: "readonly",
        Symbol: "readonly",
        Intl: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        structuredClone: "readonly",
        queueMicrotask: "readonly",
        atob: "readonly",
        btoa: "readonly",
        crypto: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        globalThis: "readonly",
      },
    },
  },

  // 忽略模式
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "public/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "tailwind.config.v3.backup.js",
    ],
  },
]
