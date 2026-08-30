import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit to 2MB
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // Core libraries - separate
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            // UI libraries
            if (id.includes('lucide-react') || id.includes('recharts') || 
                id.includes('@radix-ui') || id.includes('class-variance-authority')) {
              return 'ui';
            }
            // PDF libraries
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            // Everything else
            return 'vendor';
          }
        },
      },
    },
  },
}));