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
   server: {
     proxy: {
       '/api': {
         target: 'http:localhost:8080',
         changeOrigin: true,
         secure: false,
         rewrite: (path) => path.replace(/^\/api/, '')
       }
     }
   }
 });

//* INVERSER LES COMMS selon dev ou live

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   base: '/wow-helper/', // Définit le chemin de base
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://www.laurentarcos.fr', // Change cela pour correspondre à ta configuration
//         changeOrigin: true,
//         secure: true,
//         rewrite: (path) => path.replace(/^\/api/, '') // Retire le préfixe '/api'
//       }
//     }
//   }
// });
