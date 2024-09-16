 import { defineConfig } from 'vite';
 import react from '@vitejs/plugin-react';

 export default defineConfig({
   plugins: [
     react(),
     {
       name: 'custom-logger',
       configureServer(server) {
         server.httpServer?.on('listening', () => {
           console.log('🟢 Votre serveur Vite est démarré et écoute sur http:localhost:5173');
         });
       },
     },
   ],
  //  server: {
  //    proxy: {
  //      '/api': {
  //        target: 'http:localhost:8080',
  //        changeOrigin: true,
  //        secure: false,
  //        rewrite: (path) => path.replace(/^\/api/, '')
  //      }
  //    }
  //  }
 });