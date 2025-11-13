import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactSwc from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(() => {
  const isTest = !!process.env.VITEST;
  return {
    plugins: [react({ fastRefresh: !isTest })],
    ...(isTest && { plugins: [reactSwc()] }),
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
        reporter: ['text', 'html'],
      },
    },
  };
});
