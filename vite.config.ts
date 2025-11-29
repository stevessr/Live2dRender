import { defineConfig, LibraryFormats } from 'vite';
import { fileURLToPath, URL } from 'url';
import path from 'path';

// Determine the build target from environment
const isWebTarget = process.env.BUILD_TARGET === 'web';

// Define the appropriate library formats based on target
const formats: LibraryFormats[] = isWebTarget ? ['umd'] : ['cjs', 'es'];

// Custom plugin to resolve @framework imports
function frameworkResolver() {
  const frameworkPath = path.resolve(__dirname, '../../SDK/Framework/src');
  
  return {
    name: 'framework-resolver',
    resolveId(id) {
      if (id.startsWith('@framework/')) {
        // Convert @framework/path to actual path
        const resolvedPath = path.resolve(frameworkPath, id.slice(10) + '.ts');
        return resolvedPath;
      }
      return null;
    }
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'Live2dRender',
      fileName: (format) => {
        if (format === 'umd') {
          return 'live2d-render.bundle.js';
        } else if (format === 'cjs') {
          return 'live2d-render.cjs';
        } else {
          return 'live2d-render.es.js';
        }
      },
      formats: formats
    },
    rollupOptions: {
      external: [],
      output: {
        // For UMD build (web target)
        ...(isWebTarget ? {
          name: 'Live2dRender',
          globals: {}
        } : {}),
        // For non-UMD builds, ensure proper CommonJS output
        ...(formats.includes('cjs') ? {
          exports: 'named'
        } : {})
      }
    },
    target: 'es2015', // equivalent to ES6
    outDir: path.resolve(__dirname, 'dist'),
    sourcemap: false // Following the original webpack config
  }
});