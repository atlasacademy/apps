import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/paper-moon/',
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  build: {
    outDir: './build',
    emptyOutDir : true,
  }
});
