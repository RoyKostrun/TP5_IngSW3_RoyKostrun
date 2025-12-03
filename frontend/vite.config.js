import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactSwc from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(() => {
  const isTest = !!process.env.VITEST;
  const plugins = [react({ fastRefresh: !isTest })];
  if (isTest) {
    plugins.push(reactSwc());
  }

  return {
    plugins,
    test: {
      environment: 'jsdom',
      setupFiles: 'src/test/setup.js',
      css: true,
      globals: true,
      deps: {
        registerNodeLoader: true,
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov', 'json-summary'],
        reportsDirectory: 'coverage',
        thresholds: {
          lines: 70,
          functions: 70,
          statements: 70,
          branches: 70,
        },
      },
    },
  };
});
