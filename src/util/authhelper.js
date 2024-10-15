export const generateFingerprint = async () => {
    const {
        userAgent,
        language,
        languages,
        platform,
        vendor,
        productSub,
        deviceMemory,
        hardwareConcurrency,
        maxTouchPoints
    } = navigator;

    const screenSize = `${screen.width}x${screen.height}`;
    const colorDepth = screen.colorDepth;
    const pixelRatio = window.devicePixelRatio || 1;
    const timezoneOffset = new Date().getTimezoneOffset();
    const availableScreenWidth = screen.availWidth;
    const availableScreenHeight = screen.availHeight;
    const screenOrientation = screen.orientation ? screen.orientation.type : 'unknown';

    const canvasFingerprint = getCanvasFingerprint();
    const webGLFingerprint = getWebGLFingerprint();
    const browserFeatures = getBrowserFeatures();
    const touchSupport = getTouchSupport();

    const fingerprint = [
        userAgent,
        screenSize,
        colorDepth,
        pixelRatio,
        timezoneOffset,
        availableScreenWidth,
        availableScreenHeight,
        screenOrientation,
        language,
        languages,
        hardwareConcurrency,
        maxTouchPoints,
        canvasFingerprint,
        webGLFingerprint,
        browserFeatures,
        touchSupport,
        platform,
        vendor,
        productSub,
        deviceMemory
    ].join('|');

    return await generateHash(fingerprint);
}

async function generateHash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function getCanvasFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'canvas_not_supported';

        const txt = 'BrowserFingerprint';
        ctx.textBaseline = 'top';
        ctx.font = '16px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText(txt, 4, 17);
        ctx.strokeStyle = 'rgb(120, 186, 176)';
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(200, 200);
        ctx.stroke();
        return canvas.toDataURL();
    } catch (e) {
        return 'canvas_not_supported';
    }
}

function getWebGLFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'webgl_not_supported';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const vendor = (debugInfo && gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)) || 'unknown_vendor';
        const renderer = (debugInfo && gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) || 'unknown_renderer';
        const shadingLangVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        const glVersion = gl.getParameter(gl.VERSION);
        const antialias = gl.getContextAttributes().antialias ? 'true' : 'false';

        const data = [
            `vendor:${vendor}`,
            `renderer:${renderer}`,
            `shadingLangVersion:${shadingLangVersion}`,
            `glVersion:${glVersion}`,
            `antialias:${antialias}`
        ];

        try {
            const maxAnisotropy = gl.getParameter(gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            data.push(`maxAnisotropy:${maxAnisotropy}`);
        } catch (e) { }

        try {
            const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
            data.push(`maxVertexAttribs:${maxVertexAttribs}`);
        } catch (e) { }

        return data.join(',');
    } catch (e) {
        return 'webgl_not_supported';
    }
}

function getBrowserFeatures() {
    const features = {
        WebRTC: false,
        IndexedDB: false,
        WebAssembly: false,
        LocalStorage: false,
        SessionStorage: false,
        ServiceWorker: false,
        Notification: false,
        PushManager: false,
        Geolocation: false
    };

    
    try { features.WebRTC = !!window.RTCPeerConnection; } catch (e) { }
    try { features.IndexedDB = !!window.indexedDB; } catch (e) { }
    try { features.WebAssembly = !!window.WebAssembly; } catch (e) { }
    try { features.LocalStorage = !!window.localStorage; } catch (e) { }
    try { features.SessionStorage = !!window.sessionStorage; } catch (e) { }
    try { features.ServiceWorker = !!navigator.serviceWorker; } catch (e) { }
    try { features.Notification = !!window.Notification; } catch (e) { }
    try { features.PushManager = !!window.PushManager; } catch (e) { }
    try { features.Geolocation = !!navigator.geolocation; } catch (e) { }

    return Object.keys(features).map(feature => `${feature}:${features[feature]}`).join(',');
}

function getTouchSupport() {
    try {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || 'msMaxTouchPoints' in navigator;
    } catch (e) {
        return 'unknown';
    }
}
