import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '.next/',
        'out/'
      ],
      thresholds: {
        branches: 70,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    include: ['tests/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    exclude: ['node_modules/', '.next/', 'dist/']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
