import * as vite from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default vite.defineConfig({
  base: '/erulean-tools/',
  plugins: [TanStackRouterVite({}), react()],
});
