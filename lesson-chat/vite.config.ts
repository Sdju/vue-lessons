import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const configurationByType: Record<ProxyLogType, (proxy: HttpProxy.Server) => void> = {
  all: (proxy: HttpProxy.Server) => {
    proxy.on('error', (err) => {
      console.log('proxy error', err);
    });
    proxy.on('proxyReq', (proxyReq, req) => {
      console.log(
          'proxy:',
          req.method,
          req.url,
          ' ==> ',
          `${proxyReq.method}  ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
          JSON.stringify(proxyReq.getHeaders(), null, '  '),
      );
    });
    proxy.on('proxyRes', (proxyRes, req) => {
      console.log(
          'proxy result:',
          proxyRes.statusCode,
          req.url,
          JSON.stringify(proxyRes.headers, null, '  '),
      );
    });
  },
  none: () => {},
  base: (proxy: HttpProxy.Server) => {
    proxy.on('error', (err) => {
      console.log('proxy error', err);
    });
    proxy.on('proxyReq', (proxyReq, req) => {
      console.log(
          'proxy: ',
          req.method,
          req.url,
          ' ==> ',
          `${proxyReq.method}  ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
      );
    });
    proxy.on('proxyRes', (proxyRes, req) => {
      console.log('proxy result:', proxyRes.statusCode, req.url);
    });
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    proxy: {
      '/ws': {
        target: 'ws://localhost:8080',
        configure: configurationByType.base
      }
    }
  }
})
