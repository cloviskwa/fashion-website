// build.js - Add PWA tasks
const { generateSW } = require('workbox-build');
const sharp = require('sharp');
const path = require('path');

async function buildPWA() {
    console.log('📱 Building PWA features...');
    
    // 1. Generate Service Worker
    await generateSW({
        globDirectory: 'public',
        globPatterns: ['**/*.{html,js,css,json,png,jpg,webp,svg,woff2}'],
        swDest: 'public/sw.js',
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
            {
                urlPattern: /\.(?:png|jpg|jpeg|webp|svg)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'images',
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    }
                }
            },
            {
                urlPattern: /\.(?:js|css)$/,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-resources'
                }
            }
        ]
    });
    
    // 2. Generate App Icons from logo
    const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const logoPath = 'src/images/branding/logo.svg';
    
    for (const size of iconSizes) {
        await sharp(logoPath)
            .resize(size, size)
            .png()
            .toFile(`public/assets/icons/icon-${size}x${size}.png`);
    }
    
    // 3. Generate Manifest
    const manifest = {
        name: 'Lipek Fashion',
        short_name: 'Lipek',
        description: 'Premium Custom Tailoring & African Fashion',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#8B4513', // Brown theme for fashion
        icons: iconSizes.map(size => ({
            src: `/assets/icons/icon-${size}x${size}.png`,
            sizes: `${size}x${size}`,
            type: 'image/png'
        })),
        categories: ['fashion', 'shopping', 'lifestyle'],
        screenshots: [
            {
                src: '/assets/images/app-screenshots/home.jpg',
                sizes: '1080x1920',
                type: 'image/jpeg',
                label: 'Lipek Fashion Home Screen'
            }
        ]
    };
    
    await fs.writeJson('public/manifest.json', manifest, { spaces: 2 });
    
    console.log('✅ PWA build complete!');
}