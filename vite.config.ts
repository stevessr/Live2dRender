import { defineConfig, LibraryFormats } from 'vite';
import { fileURLToPath, URL } from 'url';
import path from 'path';

// Determine the build target from environment
const isWebTarget = process.env.BUILD_TARGET === 'web';

// Define the appropriate library formats based on target
const formats: LibraryFormats[] = isWebTarget ? ['umd'] : ['cjs', 'es'];

// Define external dependencies for the build (Live2D framework)
const externalDeps = [
  '@framework/cubismdefaultparameterid',
  '@framework/cubismmodelsettingjson',
  '@framework/effect/cubismbreath',
  '@framework/effect/cubismeyeblink',
  '@framework/icubismmodelsetting',
  '@framework/id/cubismid',
  '@framework/live2dcubismframework',
  '@framework/math/cubismmatrix44',
  '@framework/model/cubismusermodel',
  '@framework/motion/acubismmotion',
  '@framework/motion/cubismmotion',
  '@framework/motion/cubismmotionqueuemanager',
  '@framework/type/csmmap',
  '@framework/type/csmrectf',
  '@framework/type/csmstring',
  '@framework/type/csmvector',
  '@framework/utils/cubismdebug',
  '@framework/model/cubismmoc',
  '@framework/math/cubismviewmatrix'
];

export default defineConfig({
  resolve: {
    alias: {
      // For now, we'll provide an empty alias to avoid the path error
      // In a real implementation, the framework files would need to be available
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'Live2dRender',
      fileName: (format) => {
        if (format === 'umd') {
          return 'live2d-render.bundle.js';
        }
        return 'live2d-render.js';
      },
      formats: formats
    },
    rollupOptions: {
      // Mark framework dependencies as external
      external: undefined,
      output: {
        // For UMD build (web target)
        ...(isWebTarget ? {
          name: 'Live2dRender',
          // Provide globals for the framework when using UMD
          globals: {
            '@framework/live2dcubismframework': 'CubismFramework',
            // Add other globals as needed based on framework structure
          }
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