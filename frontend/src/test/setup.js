import '@testing-library/jest-dom/vitest';
import 'whatwg-fetch';

if (!globalThis.__vite_ssr_exportName__) {
  globalThis.__vite_ssr_exportName__ = (target, name, getter) => {
    if (target && typeof target === 'object' && typeof getter === 'function') {
      Object.defineProperty(target, name, {
        enumerable: true,
        configurable: true,
        get: getter,
      });
    }
  };
}
