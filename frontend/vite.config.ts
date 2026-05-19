import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  const apiBasePath = env.VITE_API_BASE_PATH;
  const proxyTarget = env.VITE_DEV_PROXY_TARGET;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@hivepulse/shared': path.resolve(__dirname, '../packages/shared/src/index.ts'),
      },
    },
    server:
      apiBasePath && proxyTarget
        ? {
            proxy: {
              [apiBasePath]: {
                target: proxyTarget,
                changeOrigin: true,
              },
            },
          }
        : undefined,
  };
});
