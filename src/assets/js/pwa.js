// public/assets/js/pwa.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New update available
                                showUpdateNotification();
                            }
                        }
                    });
                });
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPromotion();
});

function showInstallPromotion() {
    // Show "Add to Home Screen" button
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', installApp);
    }
}

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User installed the app');
        }
        deferredPrompt = null;
    }
}