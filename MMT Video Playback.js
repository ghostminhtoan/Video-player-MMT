/**
 * MMT Video Playback.js
 * ArtPlayer-based video player với các tính năng cao cấp
 * Version: 1.0.0
 */

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.MMTVideoPlayer = factory();
    }
})(typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    // ==================== CONSTANTS ====================
    const PLAYBACK_RATES = [0.5, 1.0, 1.5, 2.0];
    const SEEK_TIME = 5;
    const FAST_SEEK_TIME = 10;
    const VOLUME_STEP = 0.1;
    const HOLD_DELAY = 300;
    const DOUBLE_TAP_DELAY = 300;
    const DOUBLE_TAP_ZONE = 0.25;
    const STORAGE_KEY_PREFIX = 'mmt_video_progress_';

    // ==================== HELPER FUNCTIONS ====================
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
        const mins = Math.floor(Math.abs(seconds) / 60);
        const secs = Math.floor(Math.abs(seconds) % 60);
        const sign = seconds < 0 ? '-' : '';
        return sign + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild;
    }

    function addClass(el, className) {
        el && el.classList.add(className);
    }

    function removeClass(el, className) {
        el && el.classList.remove(className);
    }

    function hasClass(el, className) {
        return el && el.classList.contains(className);
    }

    function setStyle(el, styles) {
        if (!el) return;
        Object.keys(styles).forEach(key => {
            el.style[key] = styles[key];
        });
    }

    function getRect(el) {
        return el.getBoundingClientRect();
    }

    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // ==================== SVG ICONS ====================
    const Icons = {
        play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
        pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
        volumeHigh: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
        volumeLow: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>',
        volumeMute: '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
        brightness: '<svg viewBox="0 0 24 24"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>',
        skipBack: '<svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',
        skipForward: '<svg viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',
        fullscreen: '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
        speed: '<svg viewBox="0 0 24 24"><path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"/></svg>'
    };

    // ==================== CSS STYLES ====================
    const Styles = `
        .mmt-player-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
        }

        .mmt-player-wrapper * {
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
        }

        .mmt-player-wrapper video {
            width: 100%;
            height: 100%;
            display: block;
        }

        .mmt-player-wrapper.art-hide-cursor {
            cursor: none;
        }

        .mmt-player-wrapper.art-hover {
            cursor: default;
        }

        /* ==================== CENTER INDICATORS ==================== */
        .mmt-center-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 300;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: none;
        }

        .mmt-center-indicator.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }

        .mmt-center-indicator svg {
            width: 50px;
            height: 50px;
            fill: #fff;
        }

        /* ==================== VOLUME INDICATOR ==================== */
        .mmt-volume-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 24px;
            font-weight: bold;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .mmt-volume-indicator.show {
            opacity: 1;
        }

        .mmt-volume-bar {
            width: 100px;
            height: 6px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            overflow: hidden;
        }

        .mmt-volume-bar-fill {
            height: 100%;
            background: #00d1b2;
            width: 0%;
            transition: width 0.1s ease;
        }

        /* ==================== BRIGHTNESS INDICATOR ==================== */
        .mmt-brightness-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 24px;
            font-weight: bold;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .mmt-brightness-indicator.show {
            opacity: 1;
        }

        .mmt-brightness-bar {
            width: 100px;
            height: 6px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            overflow: hidden;
        }

        .mmt-brightness-bar-fill {
            height: 100%;
            background: #ffd700;
            width: 0%;
            transition: width 0.1s ease;
        }

        /* ==================== SPEED INDICATOR ==================== */
        .mmt-speed-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 24px;
            font-weight: bold;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .mmt-speed-indicator.show {
            opacity: 1;
        }

        .mmt-speed-value {
            font-size: 28px;
            color: #00ced1;
        }

        /* ==================== SKIP INDICATOR ==================== */
        .mmt-skip-indicator {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 20px 30px;
            border-radius: 12px;
            font-size: 32px;
            font-weight: bold;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }

        .mmt-skip-indicator.show {
            opacity: 1;
        }

        .mmt-skip-indicator.left {
            left: 30px;
        }

        .mmt-skip-indicator.right {
            right: 30px;
        }

        .mmt-skip-text {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.8);
        }

        /* ==================== SEEK PREVIEW ==================== */
        .mmt-seek-preview {
            position: absolute;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: transparent !important;
            color: #fff !important;
            padding: 0;
            border-radius: 0;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000 !important;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .mmt-seek-preview.show {
            opacity: 1 !important;
        }

        .mmt-seek-preview-delta {
            font-size: 28px;
            font-weight: bold;
        }

        .mmt-seek-preview-delta.positive {
            color: #00ced1 !important;
        }

        .mmt-seek-preview-delta.negative {
            color: #ff8c00 !important;
        }

        .mmt-seek-preview-time {
            font-size: 22px;
            color: #fff !important;
        }

        /* ==================== RESOLUTION DISPLAY ==================== */
        .mmt-resolution-display {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            z-index: 200;
            pointer-events: none;
        }

        /* ==================== BRIGHTNESS OVERLAY ==================== */
        .mmt-brightness-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0);
            z-index: 50;
            pointer-events: none;
            transition: background 0.1s ease;
        }

        /* ==================== DOUBLE TAP INDICATOR ==================== */
        .mmt-double-tap-indicator {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 150;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }

        .mmt-double-tap-indicator.show {
            opacity: 1;
        }

        .mmt-double-tap-indicator.left {
            left: 20%;
        }

        .mmt-double-tap-indicator.right {
            right: 20%;
        }

        .mmt-double-tap-indicator svg {
            width: 30px;
            height: 30px;
            fill: #fff;
        }

        /* ==================== RESUME PROMPT ==================== */
        .mmt-resume-prompt {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 20px 30px;
            border-radius: 12px;
            font-size: 16px;
            z-index: 500;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            cursor: pointer;
        }

        .mmt-resume-prompt:hover {
            background: rgba(0, 0, 0, 0.95);
        }

        .mmt-resume-prompt-time {
            font-size: 24px;
            font-weight: bold;
            color: #00ced1;
        }

        .mmt-resume-prompt-buttons {
            display: flex;
            gap: 15px;
        }

        .mmt-resume-prompt-btn {
            padding: 8px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
        }

        .mmt-resume-prompt-btn-primary {
            background: #00ced1;
            color: #000;
        }

        .mmt-resume-prompt-btn-primary:hover {
            background: #00b5b5;
        }

        .mmt-resume-prompt-btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
        }

        .mmt-resume-prompt-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        /* ==================== CONTROL BAR ==================== */
        .mmt-control-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            padding: 10px 15px 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 100;
        }

        .mmt-player-wrapper.art-hover .mmt-control-bar {
            opacity: 1;
        }

        .mmt-control-btn {
            background: none;
            border: none;
            color: #fff;
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
        }

        .mmt-control-btn:hover {
            opacity: 0.8;
        }

        .mmt-control-btn svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .mmt-progress-container {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            cursor: pointer;
            position: relative;
        }

        .mmt-progress-loaded {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 3px;
            width: 0%;
        }

        .mmt-progress-played {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: #00ced1;
            border-radius: 3px;
            width: 0%;
        }

        .mmt-progress-indicator {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            background: #fff;
            border-radius: 50%;
            left: 0%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .mmt-time-display {
            color: #fff;
            font-size: 12px;
            font-weight: bold;
            min-width: 100px;
        }
    `;

    // ==================== MAIN CLASS ====================
    class MMTVideoPlayer {
        constructor(options) {
            this.options = {
                container: options.container,
                url: options.url,
                type: options.type || 'video/mp4',
                poster: options.poster || '',
                autoplay: options.autoplay || false,
                volume: options.volume !== undefined ? options.volume : 0.5,
                playbackRate: options.playbackRate || 1.0,
                theme: options.theme || '#00ced1',
                lang: options.lang || 'en',
                enableHotkey: options.hotkey !== false,
                enableGesture: options.gesture !== false,
                storageKey: options.storageKey || null
            };

            this.video = null;
            this.container = null;
            this.template = {};
            this.timers = {};
            this.state = {
                playing: false,
                muted: false,
                volume: this.options.volume,
                brightness: 1,
                playbackRate: this.options.playbackRate,
                duration: 0,
                currentTime: 0,
                isFullscreen: false,
                isDragging: false,
                lastSeekTime: 0
            };
            this.gesture = {
                startX: 0,
                startY: 0,
                startVolume: 0,
                startBrightness: 0,
                isSwiping: false,
                swipeDirection: null,
                lastTapTime: 0,
                tapPosition: 0,
                holdTimer: null,
                isHolding: false
            };

            this.init();
        }

        init() {
            this.injectStyles();
            this.createContainer();
            this.createVideo();
            this.createUI();
            this.bindEvents();
            this.loadProgress();
        }

        injectStyles() {
            let styleEl = document.getElementById('mmt-player-styles');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'mmt-player-styles';
                styleEl.textContent = Styles;
                document.head.appendChild(styleEl);
            }
        }

        createContainer() {
            const container = typeof this.options.container === 'string'
                ? document.querySelector(this.options.container)
                : this.options.container;

            if (!container) {
                throw new Error('MMT Video Player: Container not found');
            }

            this.container = document.createElement('div');
            this.container.className = 'mmt-player-wrapper';
            container.innerHTML = '';
            container.appendChild(this.container);
        }

        createVideo() {
            this.video = document.createElement('video');
            this.video.className = 'mmt-video';
            this.video.src = this.options.url;
            this.video.setAttribute('playsinline', 'true');
            this.video.setAttribute('webkit-playsinline', 'true');
            this.video.preload = 'metadata';

            if (this.options.poster) {
                this.video.poster = this.options.poster;
            }

            if (this.options.autoplay) {
                this.video.autoplay = true;
            }

            this.video.volume = this.state.volume;
            this.video.playbackRate = this.state.playbackRate;

            this.container.appendChild(this.video);
        }

        createUI() {
            // Brightness overlay
            this.template.brightnessOverlay = createElement('<div class="mmt-brightness-overlay"></div>');
            this.container.appendChild(this.template.brightnessOverlay);

            // Resolution display
            this.template.resolution = createElement('<div class="mmt-resolution-display">-- x --</div>');
            this.container.appendChild(this.template.resolution);

            // Play/Pause indicator
            this.template.playPauseIndicator = createElement('<div class="mmt-center-indicator mmt-play-pause-indicator"></div>');
            this.container.appendChild(this.template.playPauseIndicator);

            // Volume indicator
            this.template.volumeIndicator = createElement(`
                <div class="mmt-volume-indicator">
                    <span class="mmt-volume-icon">${Icons.volumeHigh}</span>
                    <span class="mmt-volume-text">100%</span>
                    <div class="mmt-volume-bar"><div class="mmt-volume-bar-fill"></div></div>
                </div>
            `);
            this.container.appendChild(this.template.volumeIndicator);

            // Brightness indicator
            this.template.brightnessIndicator = createElement(`
                <div class="mmt-brightness-indicator">
                    <span class="mmt-brightness-icon">${Icons.brightness}</span>
                    <span class="mmt-brightness-text">100%</span>
                    <div class="mmt-brightness-bar"><div class="mmt-brightness-bar-fill"></div></div>
                </div>
            `);
            this.container.appendChild(this.template.brightnessIndicator);

            // Speed indicator
            this.template.speedIndicator = createElement(`
                <div class="mmt-speed-indicator">
                    <span class="mmt-speed-icon">${Icons.speed}</span>
                    <span class="mmt-speed-value">1.0x</span>
                </div>
            `);
            this.container.appendChild(this.template.speedIndicator);

            // Skip indicators
            this.template.skipLeft = createElement(`
                <div class="mmt-skip-indicator left">
                    <span class="mmt-skip-icon">${Icons.skipBack}</span>
                    <span class="mmt-skip-text">-${SEEK_TIME}s</span>
                </div>
            `);
            this.container.appendChild(this.template.skipLeft);

            this.template.skipRight = createElement(`
                <div class="mmt-skip-indicator right">
                    <span class="mmt-skip-icon">${Icons.skipForward}</span>
                    <span class="mmt-skip-text">+${SEEK_TIME}s</span>
                </div>
            `);
            this.container.appendChild(this.template.skipRight);

            // Seek preview
            this.template.seekPreview = createElement(`
                <div class="mmt-seek-preview">
                    <span class="mmt-seek-preview-delta">+10s</span>
                    <span class="mmt-seek-preview-time">01:23</span>
                </div>
            `);
            this.container.appendChild(this.template.seekPreview);

            // Double tap indicators
            this.template.doubleTapLeft = createElement(`<div class="mmt-double-tap-indicator left">${Icons.skipBack}</div>`);
            this.container.appendChild(this.template.doubleTapLeft);

            this.template.doubleTapRight = createElement(`<div class="mmt-double-tap-indicator right">${Icons.skipForward}</div>`);
            this.container.appendChild(this.template.doubleTapRight);

            // Resume prompt
            this.template.resumePrompt = createElement(`
                <div class="mmt-resume-prompt" style="display: none;">
                    <div>Tiếp tục xem từ vị trí cũ?</div>
                    <div class="mmt-resume-prompt-time">00:00</div>
                    <div class="mmt-resume-prompt-buttons">
                        <button class="mmt-resume-prompt-btn mmt-resume-prompt-btn-primary">Có</button>
                        <button class="mmt-resume-prompt-btn mmt-resume-prompt-btn-secondary">Không</button>
                    </div>
                </div>
            `);
            this.container.appendChild(this.template.resumePrompt);

            // Control bar
            this.template.controlBar = createElement(`
                <div class="mmt-control-bar">
                    <button class="mmt-control-btn mmt-play-pause-btn">${Icons.play}</button>
                    <div class="mmt-progress-container">
                        <div class="mmt-progress-loaded"></div>
                        <div class="mmt-progress-played"></div>
                        <div class="mmt-progress-indicator"></div>
                    </div>
                    <div class="mmt-time-display">
                        <span class="mmt-current-time">00:00</span> / <span class="mmt-duration">00:00</span>
                    </div>
                    <button class="mmt-control-btn mmt-volume-btn">${Icons.volumeHigh}</button>
                    <button class="mmt-control-btn mmt-fullscreen-btn">${Icons.fullscreen}</button>
                </div>
            `);
            this.container.appendChild(this.template.controlBar);

            // Cache control bar elements
            const bar = this.template.controlBar;
            this.template.playPauseBtn = bar.querySelector('.mmt-play-pause-btn');
            this.template.progressContainer = bar.querySelector('.mmt-progress-container');
            this.template.progressLoaded = bar.querySelector('.mmt-progress-loaded');
            this.template.progressPlayed = bar.querySelector('.mmt-progress-played');
            this.template.progressIndicator = bar.querySelector('.mmt-progress-indicator');
            this.template.currentTimeEl = bar.querySelector('.mmt-current-time');
            this.template.durationEl = bar.querySelector('.mmt-duration');
            this.template.volumeBtn = bar.querySelector('.mmt-volume-btn');
            this.template.fullscreenBtn = bar.querySelector('.mmt-fullscreen-btn');
        }

        bindEvents() {
            const { video, container } = this;

            // Video events
            video.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
            video.addEventListener('play', () => this.onPlay());
            video.addEventListener('pause', () => this.onPause());
            video.addEventListener('timeupdate', () => this.onTimeUpdate());
            video.addEventListener('progress', () => this.onProgress());
            video.addEventListener('volumechange', () => this.onVolumeChange());
            video.addEventListener('ended', () => this.onEnded());
            video.addEventListener('waiting', () => this.onWaiting());
            video.addEventListener('playing', () => this.onPlaying());

            // Keyboard events
            if (this.options.enableHotkey) {
                document.addEventListener('keydown', (e) => this.handleKeyboard(e));
            }

            // Mouse/Touch events
            container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            container.addEventListener('mouseleave', () => this.hideControlBar());
            container.addEventListener('click', (e) => this.handleClick(e));

            // Control bar events
            this.template.playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });

            this.template.fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFullscreen();
            });

            this.template.volumeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMute();
            });

            // Progress bar events
            this.bindProgressEvents();

            // Touch/Mobile gestures
            if (this.options.enableGesture && isMobile()) {
                this.bindTouchEvents();
            }

            // Fullscreen change
            document.addEventListener('fullscreenchange', () => this.onFullscreenChange());
            document.addEventListener('webkitfullscreenchange', () => this.onFullscreenChange());
            document.addEventListener('mozfullscreenchange', () => this.onFullscreenChange());
            document.addEventListener('MSFullscreenChange', () => this.onFullscreenChange());

            // Resize
            window.addEventListener('resize', () => this.updateResolution());

            // Resume prompt buttons
            const resumeBtns = this.template.resumePrompt.querySelectorAll('.mmt-resume-prompt-btn');
            resumeBtns[0].addEventListener('click', (e) => {
                e.stopPropagation();
                this.resumeFromStorage();
            });
            resumeBtns[1].addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideResumePrompt();
            });
        }

        bindProgressEvents() {
            const { progressContainer } = this.template;
            let isDragging = false;

            const getProgress = (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const x = clamp(clientX - rect.left, 0, rect.width);
                return {
                    percentage: x / rect.width,
                    time: (x / rect.width) * this.state.duration
                };
            };

            const updateProgress = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const { percentage, time } = getProgress(e);
                this.updateProgressUI(percentage);
                this.updateSeekPreview(time);
            };

            const endDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                this.state.isDragging = false;
                const { time } = getProgress(e);
                this.seek(time);
                this.hideSeekPreview();
            };

            // Mouse events
            progressContainer.addEventListener('mousedown', (e) => {
                isDragging = true;
                this.state.isDragging = true;
                updateProgress(e);
            });

            document.addEventListener('mousemove', updateProgress);
            document.addEventListener('mouseup', endDrag);

            // Touch events
            progressContainer.addEventListener('touchstart', (e) => {
                isDragging = true;
                this.state.isDragging = true;
                updateProgress(e);
            }, { passive: false });

            progressContainer.addEventListener('touchmove', (e) => {
                updateProgress(e);
            }, { passive: false });

            progressContainer.addEventListener('touchend', endDrag);

            // Hover preview
            progressContainer.addEventListener('mouseenter', () => {
                if (!isDragging) {
                    progressContainer.addEventListener('mousemove', this.onProgressHover.bind(this));
                }
            });

            progressContainer.addEventListener('mouseleave', () => {
                progressContainer.removeEventListener('mousemove', this.onProgressHover.bind(this));
            });
        }

        onProgressHover(e) {
            if (this.state.isDragging) return;
            const rect = this.template.progressContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = clamp(x / rect.width, 0, 1);
            const time = percentage * this.state.duration;
            this.updateSeekPreview(time);
        }

        bindTouchEvents() {
            const { container } = this;

            container.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;
                const touch = e.touches[0];
                const rect = container.getBoundingClientRect();
                const x = (touch.clientX - rect.left) / rect.width;
                const y = (touch.clientY - rect.top) / rect.height;

                this.gesture.startX = touch.clientX;
                this.gesture.startY = touch.clientY;
                this.gesture.startVolume = this.video.volume;
                this.gesture.startBrightness = this.state.brightness;
                this.gesture.isSwiping = false;
                this.gesture.tapPosition = x;

                // Hold timer for swipe seek
                this.gesture.holdTimer = setTimeout(() => {
                    this.gesture.isHolding = true;
                }, HOLD_DELAY);
            }, { passive: true });

            container.addEventListener('touchmove', (e) => {
                if (e.touches.length !== 1) return;
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.gesture.startX;
                const deltaY = touch.clientY - this.gesture.startY;

                // Clear hold timer if moved significantly
                if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                    clearTimeout(this.gesture.holdTimer);
                    this.gesture.isHolding = false;
                }

                // Determine swipe direction
                if (!this.gesture.isSwiping && (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20)) {
                    this.gesture.isSwiping = true;
                    this.gesture.swipeDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
                }

                if (!this.gesture.isSwiping || !this.state.isFullscreen) return;
                e.preventDefault();

                const rect = container.getBoundingClientRect();
                const x = (touch.clientX - rect.left) / rect.width;

                if (this.gesture.swipeDirection === 'vertical') {
                    // Left side: brightness, Right side: volume
                    if (this.gesture.tapPosition < 0.5) {
                        this.adjustBrightness(-deltaY / rect.height);
                    } else {
                        this.adjustVolume(-deltaY / rect.height);
                    }
                } else if (this.gesture.swipeDirection === 'horizontal') {
                    // Horizontal swipe: seek
                    this.updateSeekPreview(this.state.currentTime + deltaX * 0.5);
                }
            }, { passive: false });

            container.addEventListener('touchend', (e) => {
                clearTimeout(this.gesture.holdTimer);
                const now = Date.now();
                const timeSinceLastTap = now - this.gesture.lastTapTime;
                const isDoubleTap = timeSinceLastTap < DOUBLE_TAP_DELAY;

                if (this.gesture.isHolding && this.gesture.isSwiping && this.gesture.swipeDirection === 'horizontal') {
                    // Hold + swipe seek
                    const currentTime = this.state.currentTime;
                    this.seek(currentTime);
                    this.hideSeekPreview();
                } else if (isDoubleTap && !this.gesture.isSwiping) {
                    // Double tap
                    if (this.gesture.tapPosition < DOUBLE_TAP_ZONE) {
                        // Left zone: rewind
                        this.showDoubleTap('left');
                        this.seek(this.state.currentTime - SEEK_TIME);
                    } else if (this.gesture.tapPosition > 1 - DOUBLE_TAP_ZONE) {
                        // Right zone: forward
                        this.showDoubleTap('right');
                        this.seek(this.state.currentTime + SEEK_TIME);
                    } else {
                        // Center: play/pause
                        this.toggle();
                    }
                }

                this.gesture.lastTapTime = isDoubleTap ? 0 : now;
                this.gesture.isSwiping = false;
                this.gesture.isHolding = false;
            }, { passive: true });
        }

        handleKeyboard(e) {
            // Ignore if user is typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case ' ':
                case 'k':
                case 'K':
                    e.preventDefault();
                    this.toggle();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.seek(this.state.currentTime + SEEK_TIME);
                    this.showSkip('right');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.seek(this.state.currentTime - SEEK_TIME);
                    this.showSkip('left');
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.adjustVolume(VOLUME_STEP);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.adjustVolume(-VOLUME_STEP);
                    break;
                case 'j':
                case 'J':
                    e.preventDefault();
                    this.seek(this.state.currentTime - FAST_SEEK_TIME);
                    this.showSkip('left');
                    break;
                case 'l':
                case 'L':
                    e.preventDefault();
                    this.seek(this.state.currentTime + FAST_SEEK_TIME);
                    this.showSkip('right');
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    this.toggleMute();
                    break;
                case ',':
                case '<':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.changePlaybackRate(-1);
                    }
                    break;
                case '.':
                case '>':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.changePlaybackRate(1);
                    }
                    break;
            }
        }

        handleMouseMove(e) {
            this.showControlBar();
        }

        handleClick(e) {
            // Toggle play/pause on click
            if (!this.gesture.isSwiping) {
                this.toggle();
            }
        }

        // ==================== EVENT HANDLERS ====================

        onLoadedMetadata() {
            this.state.duration = this.video.duration;
            this.updateResolution();
            this.updateDurationUI();
            this.saveProgress();
        }

        onPlay() {
            this.state.playing = true;
            this.updatePlayPauseUI();
            this.showPlayPauseIndicator(true);
            this.hideResumePrompt();
        }

        onPause() {
            this.state.playing = false;
            this.updatePlayPauseUI();
            this.showPlayPauseIndicator(false);
            this.saveProgress();
        }

        onTimeUpdate() {
            this.state.currentTime = this.video.currentTime;
            this.updateProgressUI(this.video.currentTime / this.state.duration);
            this.updateTimeUI();
            this.saveProgress();
        }

        onProgress() {
            const buffered = this.video.buffered;
            if (buffered.length > 0) {
                const loaded = buffered.end(buffered.length - 1) / this.state.duration;
                this.template.progressLoaded.style.width = (loaded * 100) + '%';
            }
        }

        onVolumeChange() {
            this.state.volume = this.video.volume;
            this.state.muted = this.video.muted;
            this.updateVolumeUI();
        }

        onEnded() {
            this.state.playing = false;
            this.updatePlayPauseUI();
            this.clearProgress();
        }

        onWaiting() {
            // Show loading indicator
        }

        onPlaying() {
            // Hide loading indicator
        }

        onFullscreenChange() {
            this.state.isFullscreen = !!document.fullscreenElement ||
                !!document.webkitFullscreenElement ||
                !!document.mozFullScreenElement ||
                !!document.msFullscreenElement;
        }

        updateResolution() {
            if (this.video.videoWidth && this.video.videoHeight) {
                this.template.resolution.textContent = `${this.video.videoWidth}x${this.video.videoHeight}`;
            }
        }

        // ==================== UI UPDATES ====================

        updatePlayPauseUI() {
            const icon = this.state.playing ? Icons.pause : Icons.play;
            this.template.playPauseBtn.innerHTML = icon;
            this.template.playPauseIndicator.innerHTML = icon;
        }

        updateProgressUI(percentage) {
            percentage = clamp(percentage, 0, 1);
            this.template.progressPlayed.style.width = (percentage * 100) + '%';
            this.template.progressIndicator.style.left = (percentage * 100) + '%';
        }

        updateTimeUI() {
            this.template.currentTimeEl.textContent = formatTime(this.state.currentTime);
            this.template.durationEl.textContent = formatTime(this.state.duration);
        }

        updateDurationUI() {
            this.template.durationEl.textContent = formatTime(this.state.duration);
        }

        updateVolumeUI() {
            const vol = this.state.volume;
            const percent = Math.round(vol * 100);
            const volText = this.template.volumeIndicator.querySelector('.mmt-volume-text');
            const volBar = this.template.volumeIndicator.querySelector('.mmt-volume-bar-fill');
            const volIcon = this.template.volumeIndicator.querySelector('.mmt-volume-icon');

            volText.textContent = percent + '%';
            volBar.style.width = percent + '%';
            this.template.volumeBtn.innerHTML = vol === 0 ? Icons.volumeMute : (vol < 0.5 ? Icons.volumeLow : Icons.volumeHigh);

            if (vol === 0) {
                volIcon.innerHTML = Icons.volumeMute;
            } else if (vol < 0.5) {
                volIcon.innerHTML = Icons.volumeLow;
            } else {
                volIcon.innerHTML = Icons.volumeHigh;
            }
        }

        updateBrightnessUI(value) {
            const percent = Math.round(value * 100);
            const brightText = this.template.brightnessIndicator.querySelector('.mmt-brightness-text');
            const brightBar = this.template.brightnessIndicator.querySelector('.mmt-brightness-bar-fill');

            brightText.textContent = percent + '%';
            brightBar.style.width = percent + '%';
            this.template.brightnessOverlay.style.background = `rgba(0, 0, 0, ${1 - value})`;
        }

        updateSpeedUI() {
            const speedText = this.template.speedIndicator.querySelector('.mmt-speed-value');
            speedText.textContent = this.state.playbackRate.toFixed(1) + 'x';
        }

        // ==================== INDICATORS ====================

        showPlayPauseIndicator(isPlaying) {
            this.updatePlayPauseUI();
            addClass(this.template.playPauseIndicator, 'show');
            this.clearTimer('playPause');
            this.timers.playPause = setTimeout(() => {
                removeClass(this.template.playPauseIndicator, 'show');
            }, 800);
        }

        showVolumeIndicator(vol) {
            this.updateVolumeUI();
            addClass(this.template.volumeIndicator, 'show');
            this.clearTimer('volume');
            this.timers.volume = setTimeout(() => {
                removeClass(this.template.volumeIndicator, 'show');
            }, 1500);
        }

        showBrightnessIndicator(brightness) {
            this.updateBrightnessUI(brightness);
            addClass(this.template.brightnessIndicator, 'show');
            this.clearTimer('brightness');
            this.timers.brightness = setTimeout(() => {
                removeClass(this.template.brightnessIndicator, 'show');
            }, 1500);
        }

        showSpeedIndicator() {
            this.updateSpeedUI();
            addClass(this.template.speedIndicator, 'show');
            this.clearTimer('speed');
            this.timers.speed = setTimeout(() => {
                removeClass(this.template.speedIndicator, 'show');
            }, 1500);
        }

        showSkip(direction) {
            const indicator = direction === 'left' ? this.template.skipLeft : this.template.skipRight;
            addClass(indicator, 'show');
            this.clearTimer('skip');
            this.timers.skip = setTimeout(() => {
                removeClass(indicator, 'show');
            }, 800);
        }

        showDoubleTap(direction) {
            const indicator = direction === 'left' ? this.template.doubleTapLeft : this.template.doubleTapRight;
            addClass(indicator, 'show');
            setTimeout(() => {
                removeClass(indicator, 'show');
            }, 500);
        }

        updateSeekPreview(targetTime) {
            const delta = targetTime - this.state.currentTime;
            const deltaEl = this.template.seekPreview.querySelector('.mmt-seek-preview-delta');
            const timeEl = this.template.seekPreview.querySelector('.mmt-seek-preview-time');

            deltaEl.textContent = (delta >= 0 ? '+' : '') + formatTime(delta);
            deltaEl.className = 'mmt-seek-preview-delta ' + (delta >= 0 ? 'positive' : 'negative');
            timeEl.textContent = formatTime(clamp(targetTime, 0, this.state.duration));

            addClass(this.template.seekPreview, 'show');
            this.clearTimer('seekPreview');
            this.timers.seekPreview = setTimeout(() => {
                this.hideSeekPreview();
            }, 1000);
        }

        hideSeekPreview() {
            removeClass(this.template.seekPreview, 'show');
        }

        showResumePrompt(time) {
            const timeEl = this.template.resumePrompt.querySelector('.mmt-resume-prompt-time');
            timeEl.textContent = formatTime(time);
            this.template.resumePrompt.style.display = 'flex';
        }

        hideResumePrompt() {
            this.template.resumePrompt.style.display = 'none';
        }

        // ==================== CONTROL BAR ====================

        showControlBar() {
            addClass(this.container, 'art-hover');
            this.clearTimer('controlBar');
            this.timers.controlBar = setTimeout(() => {
                if (this.state.playing) {
                    removeClass(this.container, 'art-hover');
                }
            }, 3000);
        }

        hideControlBar() {
            if (this.state.playing) {
                removeClass(this.container, 'art-hover');
            }
        }

        // ==================== PLAYBACK CONTROL ====================

        play() {
            this.video.play();
        }

        pause() {
            this.video.pause();
        }

        toggle() {
            if (this.state.playing) {
                this.pause();
            } else {
                this.play();
            }
        }

        seek(time) {
            time = clamp(time, 0, this.state.duration);
            this.video.currentTime = time;
            this.state.currentTime = time;
        }

        setVolume(vol) {
            this.state.volume = clamp(vol, 0, 1);
            this.video.volume = this.state.volume;
            this.video.muted = false;
            this.showVolumeIndicator(this.state.volume);
        }

        adjustVolume(delta) {
            this.setVolume(this.state.volume + delta);
        }

        toggleMute() {
            this.video.muted = !this.video.muted;
            this.showVolumeIndicator(this.video.muted ? 0 : this.state.volume);
        }

        setPlaybackRate(rate) {
            this.state.playbackRate = rate;
            this.video.playbackRate = rate;
            this.showSpeedIndicator();
        }

        changePlaybackRate(direction) {
            const currentIndex = PLAYBACK_RATES.indexOf(this.state.playbackRate);
            let newIndex = currentIndex + direction;
            newIndex = clamp(newIndex, 0, PLAYBACK_RATES.length - 1);
            this.setPlaybackRate(PLAYBACK_RATES[newIndex]);
        }

        setBrightness(value) {
            this.state.brightness = clamp(value, 0, 1);
            this.updateBrightnessUI(this.state.brightness);
            this.showBrightnessIndicator(this.state.brightness);
        }

        adjustBrightness(delta) {
            this.setBrightness(this.state.brightness + delta);
        }

        toggleFullscreen() {
            if (!document.fullscreenElement) {
                if (this.container.requestFullscreen) {
                    this.container.requestFullscreen();
                } else if (this.container.webkitRequestFullscreen) {
                    this.container.webkitRequestFullscreen();
                } else if (this.container.mozRequestFullScreen) {
                    this.container.mozRequestFullScreen();
                } else if (this.container.msRequestFullscreen) {
                    this.container.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }

        // ==================== PROGRESS STORAGE ====================

        getStorageKey() {
            return this.options.storageKey || STORAGE_KEY_PREFIX + btoa(this.options.url);
        }

        saveProgress() {
            if (!this.state.duration || this.state.currentTime < 10) return;
            const progress = {
                time: this.state.currentTime,
                duration: this.state.duration,
                timestamp: Date.now()
            };
            localStorage.setItem(this.getStorageKey(), JSON.stringify(progress));
        }

        loadProgress() {
            try {
                const data = localStorage.getItem(this.getStorageKey());
                if (!data) return;

                const progress = JSON.parse(data);
                const now = Date.now();
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

                if (now - progress.timestamp > maxAge) {
                    localStorage.removeItem(this.getStorageKey());
                    return;
                }

                if (progress.time > 10 && progress.time < progress.duration - 5) {
                    this.showResumePrompt(progress.time);
                }
            } catch (e) {
                console.warn('MMT Video Player: Failed to load progress', e);
            }
        }

        resumeFromStorage() {
            try {
                const data = localStorage.getItem(this.getStorageKey());
                if (!data) return;

                const progress = JSON.parse(data);
                this.seek(progress.time);
                this.hideResumePrompt();
                this.play();
            } catch (e) {
                console.warn('MMT Video Player: Failed to resume', e);
            }
        }

        clearProgress() {
            localStorage.removeItem(this.getStorageKey());
        }

        // ==================== UTILS ====================

        clearTimer(name) {
            if (this.timers[name]) {
                clearTimeout(this.timers[name]);
                delete this.timers[name];
            }
        }

        clearAllTimers() {
            Object.keys(this.timers).forEach(key => {
                clearTimeout(this.timers[key]);
            });
            this.timers = {};
        }

        // ==================== DESTROY ====================

        destroy() {
            this.clearAllTimers();
            this.saveProgress();

            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }

            this.video = null;
            this.container = null;
            this.template = {};
        }
    }

    return MMTVideoPlayer;
});
