import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/random-barcode/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Suppress warning
          isCustomElement: tag => ['search', 'output'].includes(tag),
        },
      },
    }),
    AutoImport({
      dts: true,
      imports: [
        'vue',
        '@vueuse/core',
        // { '@vueuse/core': ['promiseTimeout'] },
      ],
      dirs: [
        'src/utils/**',
      ],
      vueTemplate: true,
    }),
    Components({
      dts: true,
      dirs: [
        'src/components',
        'src/layouts',
        'src/views',
      ],
      resolvers: [
        IconsResolver(),
      ],
    }),
    Icons(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        minify: {
          compress: {
            dropConsole: true,
            dropDebugger: true,
          },
        },
      },
    },
  },
})
