import { createRequire } from 'module';
const require = createRequire(import.meta.url);

(async () => {
    try {
        await import('./polyfills.mjs');
        // Once polyfills are loaded, start the server
        require('./dist/server.js');
    } catch (err) {
        console.error('Failed to load polyfills.mjs', err);
        process.exit(1);
    }
})();
