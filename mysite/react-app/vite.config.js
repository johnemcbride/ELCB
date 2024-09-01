import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'; // Import resolve from path

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    root: resolve('.'),
    base: '/static/',
    server: {
        host: '127.0.0.1',
        port: 5173,
        open: false,
        origin: 'http://127.0.0.1:5173',
        watch: {
            usePolling: true,
            disableGlobbing: false,
        },
        proxy: {


            '/pages': {
                target: 'http://127.0.0.1:5173/'
            }
        }
    },
    define: { global: 'window' },
    resolve: {

        extensions: ['.js', '.json'],
    },
    build: {
        outDir: resolve('dist'),
        assetsDir: '',
        manifest: true,
        emptyOutDir: true,
        target: 'es2015',
        rollupOptions: {
            input: {
                main: resolve('src/index.jsx'),
            },
            output: {
                chunkFileNames: undefined,

                // manualChunks: {
                //     // Ensure Amplify core modules are in the same chunk
                //     amplifyCore: [
                //         '@aws-amplify/core',
                //         '@aws-amplify/pubsub',
                //         '@aws-amplify/api-rest'
                //     ]
                // }

            },
        },
    },
});