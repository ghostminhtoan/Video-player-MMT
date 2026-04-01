  <!-- CSS của Video.js -->
  <link href="https://vjs.zencdn.net/8.6.1/video-js.css" rel="stylesheet" />

  <!-- CSS cho Indicator & Mobile UI -->
  <style>
    /* ==================== SVG ICONS ==================== */
    .svg-icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    /* ==================== PLAY/PAUSE INDICATOR (GIỮA MÀN HÌNH) ==================== */
    .play-pause-indicator {
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
    .play-pause-indicator.show {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }
    .play-pause-indicator svg {
      width: 50px;
      height: 50px;
      fill: #fff;
    }

    /* ==================== VOLUME INDICATOR (GIỮA MÀN HÌNH) ==================== */
    .volume-indicator {
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
    .volume-indicator.show { opacity: 1; }
    .volume-bar { width: 100px; height: 6px; background: rgba(255,255,255,0.3); border-radius: 3px; overflow: hidden; }
    .volume-bar-fill { height: 100%; background: #00d1b2; width: 0%; transition: width 0.1s ease; }

    /* ==================== BRIGHTNESS INDICATOR (GIỮA MÀN HÌNH) ==================== */
    .brightness-indicator {
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
    .brightness-indicator.show { opacity: 1; }
    .brightness-bar { width: 100px; height: 6px; background: rgba(255,255,255,0.3); border-radius: 3px; overflow: hidden; }
    .brightness-bar-fill { height: 100%; background: #ffd700; width: 0%; transition: width 0.1s ease; }

    /* ==================== SKIP INDICATOR (2 BÊN MÀN HÌNH) ==================== */
    .skip-indicator {
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
    .skip-indicator.show { opacity: 1; }
    .skip-indicator.left { left: 30px; }
    .skip-indicator.right { right: 30px; }
    .skip-text { font-size: 18px; color: rgba(255,255,255,0.8); }

    /* ==================== SEEK PREVIEW INDICATOR ==================== */
    .seek-preview-indicator {
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
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      border: none !important;
      box-shadow: none;
    }
    .seek-preview-indicator.show { opacity: 1 !important; }
    .seek-preview-delta { font-size: 28px; font-weight: bold; }
    .seek-preview-delta.positive { color: #00ced1 !important; }
    .seek-preview-delta.negative { color: #ff8c00 !important; }
    .seek-preview-time { font-size: 22px; color: #fff !important; }

    /* ==================== MOBILE VOLUME OVERLAY ==================== */
    .mobile-volume-overlay {

    /* ==================== TIME DISPLAY ==================== */
    .time-display {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: bold;
      z-index: 150;
      pointer-events: none;
      display: flex;
      gap: 8px;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      white-space: nowrap;
    }
    .time-display.show { opacity: 1; }
    .time-display .time-item { display: flex; flex-direction: column; align-items: center; }
    .time-display .time-label { font-size: 9px; color: rgba(255,255,255,0.7); text-transform: uppercase; }
    .time-display .time-value { font-size: 13px; font-weight: bold; }
    .time-display .time-separator { color: rgba(255,255,255,0.5); font-size: 14px; }

    /* ==================== MOBILE VOLUME OVERLAY ==================== */
    .mobile-volume-overlay {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.9);
      border-radius: 8px;
      padding: 12px 20px;
      z-index: 200;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      display: none;
    }
    .mobile-volume-overlay.active {
      opacity: 1;
      pointer-events: auto;
      display: block;
    }
    .mobile-volume-slider {
      width: 200px;
      height: 6px;
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 8px;
    }
    .mobile-volume-fill {
      height: 100%;
      background: #00d1b2;
      width: 100%;
      transition: width 0.1s ease;
    }

    /* Time Remaining ở control bar - ĐÃ ẨN */
    .time-remaining-display {
      display: none !important;
    }
    .mobile-volume-value {
      text-align: center;
      font-size: 14px;
      color: #fff;
      margin-top: 4px;
    }

    /* ==================== SPEED INDICATOR ==================== */
    .speed-indicator {
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
    .speed-indicator.show { opacity: 1; }
    .speed-icon { font-size: 28px; }
    .speed-value { font-size: 28px; color: #00ced1; }

    /* ==================== BRIGHTNESS OVERLAY (MỜ MÀN HÌNH) ==================== */
    .brightness-overlay {
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

    /* ==================== RESOLUTION DISPLAY ==================== */
    .vjs-resolution-display {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      padding: 2px 6px;
      font-size: 12px;
      border-radius: 3px;
      z-index: 10;
      pointer-events: none;
    }

    /* ==================== DOUBLE TAP INDICATOR ==================== */
    .double-tap-indicator {
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
    .double-tap-indicator.show { opacity: 1; }
    .double-tap-indicator.left { left: 20%; }
    .double-tap-indicator.right { right: 20%; }
    .double-tap-indicator svg {
      width: 30px;
      height: 30px;
      fill: #fff;
    }
  </style>

  <!-- Khung chứa Video -->
  <video id="dynamic-player" class="video-js vjs-big-play-centered vjs-fluid" controls preload="auto" data-setup='{}' tabindex="0">
    <source src="https://github.com/ghostminhtoan/private/releases/download/draft.picture/subtitle.edit.single.word.mp4" type="video/mp4" label="720p" />
    <p class="vjs-no-js">To view this video please enable JavaScript.</p>
  </video>

  <!-- JS của Video.js -->
  <script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // ==================== SVG ICONS ====================
      var icons = {
        play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
        pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
        volumeHigh: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
        volumeLow: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>',
        volumeMute: '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
        brightness: '<svg viewBox="0 0 24 24"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>',
        skipBack: '<svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',
        skipForward: '<svg viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',
        rewind5: '<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-4 8c0 .74.15 1.45.42 2.1l1.46-1.46C9.53 13.19 9.28 12.62 9.28 12c0-1.66 1.34-3 3-3V7c-2.76 0-5 2.24-5 5zm6 0c0-1.66-1.34-3-3-3V7c2.76 0 5 2.24 5 5s-2.24 5-5 5v-2c1.66 0 3-1.34 3-3z"/></svg>',
        forward5: '<svg viewBox="0 0 24 24"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h1.72c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm-4 8c0-1.66 1.34-3 3-3V7c-2.76 0-5 2.24-5 5s2.24 5 5 5v-2c-1.66 0-3-1.34-3-3zm6 0c0 .74-.15 1.45-.42 2.1l-1.46-1.46c.25-.45.4-.98.4-1.54 0-1.66-1.34-3-3-3V7c2.76 0 5 2.24 5 5z"/></svg>'
      };

      var playerElement = document.getElementById('dynamic-player');
      var sourceElement = playerElement.querySelector('source');
      var videoSrc = sourceElement ? sourceElement.src : 'unknown-video';
      var storageKey = 'vjs_progress_' + videoSrc.replace(/[^a-zA-Z0-9]/g, '_');

      var player = videojs('dynamic-player', {
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
        keyboardControls: true,
        controlBar: {
          skipButtons: { forward: 5, backward: 5 },
          volumePanel: { inline: false }
        }
      });

      // ==================== TẠO CÁC INDICATOR ====================

      // Play/Pause Indicator (giữa màn hình)
      var playPauseIndicator = document.createElement('div');
      playPauseIndicator.className = 'play-pause-indicator';
      playPauseIndicator.innerHTML = icons.play;
      playerElement.appendChild(playPauseIndicator);

      // Volume Indicator (giữa màn hình)
      var volumeIndicator = document.createElement('div');
      volumeIndicator.className = 'volume-indicator';
      volumeIndicator.innerHTML = `
        <span class="volume-icon">${icons.volumeHigh}</span>
        <span class="volume-text">100%</span>
        <div class="volume-bar"><div class="volume-bar-fill"></div></div>
      `;
      playerElement.appendChild(volumeIndicator);

      // Brightness Indicator (giữa màn hình)
      var brightnessIndicator = document.createElement('div');
      brightnessIndicator.className = 'brightness-indicator';
      brightnessIndicator.innerHTML = `
        <span class="brightness-icon">${icons.brightness}</span>
        <span class="brightness-text">100%</span>
        <div class="brightness-bar"><div class="brightness-bar-fill"></div></div>
      `;
      playerElement.appendChild(brightnessIndicator);

      // Skip Indicators (2 bên - dùng chung 1 vị trí giữa)
      var skipIndicatorLeft = document.createElement('div');
      skipIndicatorLeft.className = 'skip-indicator left';
      skipIndicatorLeft.innerHTML = `
        <span class="skip-icon">${icons.rewind5}</span>
        <span class="skip-text">-5s</span>
      `;
      playerElement.appendChild(skipIndicatorLeft);

      var skipIndicatorRight = document.createElement('div');
      skipIndicatorRight.className = 'skip-indicator right';
      skipIndicatorRight.innerHTML = `
        <span class="skip-icon">${icons.forward5}</span>
        <span class="skip-text">+5s</span>
      `;
      playerElement.appendChild(skipIndicatorRight);

      // Seek Preview Indicator
      var seekPreviewIndicator = document.createElement('div');
      seekPreviewIndicator.className = 'seek-preview-indicator';
      seekPreviewIndicator.innerHTML = `
        <span class="seek-preview-delta">+10s</span>
        <span class="seek-preview-time">01:23</span>
      `;
      playerElement.appendChild(seekPreviewIndicator);

      // Time Display - Hiển thị: thời gian chạy / tổng thời gian
      var timeDisplay = document.createElement('div');
      timeDisplay.className = 'time-display';
      timeDisplay.innerHTML = `
        <div class="time-item">
          <span class="time-value" id="time-elapsed">00:00</span>
          <span class="time-label">Đã chạy</span>
        </div>
        <span class="time-separator">/</span>
        <div class="time-item">
          <span class="time-value" id="time-total">00:00</span>
          <span class="time-label">Tổng</span>
        </div>
      `;
      playerElement.appendChild(timeDisplay);

      // Mobile Volume Overlay
      var mobileVolumeOverlay = document.createElement('div');
      mobileVolumeOverlay.className = 'mobile-volume-overlay';
      mobileVolumeOverlay.innerHTML = `
        <div>${icons.volumeHigh} Volume</div>
        <div class="mobile-volume-slider"><div class="mobile-volume-fill"></div></div>
        <div class="mobile-volume-value">100%</div>
      `;
      playerElement.appendChild(mobileVolumeOverlay);

      // Brightness Overlay (mờ màn hình)
      var brightnessOverlay = document.createElement('div');
      brightnessOverlay.className = 'brightness-overlay';
      playerElement.appendChild(brightnessOverlay);

      // Double Tap Indicators
      var doubleTapIndicatorLeft = document.createElement('div');
      doubleTapIndicatorLeft.className = 'double-tap-indicator left';
      doubleTapIndicatorLeft.innerHTML = icons.rewind5;
      playerElement.appendChild(doubleTapIndicatorLeft);

      var doubleTapIndicatorRight = document.createElement('div');
      doubleTapIndicatorRight.className = 'double-tap-indicator right';
      doubleTapIndicatorRight.innerHTML = icons.forward5;
      playerElement.appendChild(doubleTapIndicatorRight);

      // ==================== BIẾN LƯU TRỮ ====================
      var volumeTimeout, skipTimeout, playPauseTimeout, brightnessTimeout, seekPreviewTimeout;
      var volumeBarFill = volumeIndicator.querySelector('.volume-bar-fill');
      var volumeText = volumeIndicator.querySelector('.volume-text');
      var volumeIcon = volumeIndicator.querySelector('.volume-icon');
      var brightnessBarFill = brightnessIndicator.querySelector('.brightness-bar-fill');
      var brightnessText = brightnessIndicator.querySelector('.brightness-text');
      var mobileVolumeFill = mobileVolumeOverlay.querySelector('.mobile-volume-fill');
      var mobileVolumeValue = mobileVolumeOverlay.querySelector('.mobile-volume-value');

      // Time display elements
      var timeElapsedEl = document.getElementById('time-elapsed');
      var timeTotalEl = document.getElementById('time-total');

      // Brightness state (0-1)
      var currentBrightness = 1;

      // ==================== HÀM FORMAT THỜI GIAN ====================
      function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        var mins = Math.floor(Math.abs(seconds) / 60);
        var secs = Math.floor(Math.abs(seconds) % 60);
        var sign = seconds < 0 ? '-' : '';
        return sign + mins + ':' + (secs < 10 ? '0' : '') + secs;
      }

      // ==================== HÀM CẬP NHẬT TIME DISPLAY ====================
      function updateTimeDisplay() {
        var currentTime = player.currentTime();
        var duration = player.duration();

        if (timeElapsedEl) timeElapsedEl.textContent = formatTime(currentTime);
        if (timeTotalEl && !isNaN(duration)) timeTotalEl.textContent = formatTime(duration);

        // Hiển thị time display khi có tương tác
        timeDisplay.classList.add('show');
        clearTimeout(window.timeDisplayTimeout);
        window.timeDisplayTimeout = setTimeout(function() {
          timeDisplay.classList.remove('show');
        }, 3000);
      }

      // ==================== HÀM CẬP NHẬT VOLUME ====================
      function updateVolume(vol) {
        var percent = Math.round(vol * 100);
        volumeText.textContent = percent + '%';
        volumeBarFill.style.width = percent + '%';
        mobileVolumeFill.style.width = percent + '%';
        mobileVolumeValue.textContent = percent + '%';

        if (vol === 0) {
          volumeIcon.innerHTML = icons.volumeMute;
          mobileVolumeValue.textContent = '🔇 Muted';
        } else if (vol < 0.5) {
          volumeIcon.innerHTML = icons.volumeLow;
        } else {
          volumeIcon.innerHTML = icons.volumeHigh;
        }
      }

      // ==================== HÀM CẬP NHẬT BRIGHTNESS ====================
      function updateBrightness(value) {
        currentBrightness = Math.max(0, Math.min(1, value));
        var percent = Math.round(currentBrightness * 100);
        brightnessText.textContent = percent + '%';
        brightnessBarFill.style.width = percent + '%';

        // Update overlay opacity (ngược lại: brightness 100% = overlay 0%)
        brightnessOverlay.style.background = 'rgba(0, 0, 0, ' + (1 - currentBrightness) + ')';
      }

      // ==================== HÀM HIỂN THỊ INDICATORS ====================

      function showPlayPauseIndicator(isPlaying) {
        playPauseIndicator.innerHTML = isPlaying ? icons.pause : icons.play;
        playPauseIndicator.classList.add('show');
        clearTimeout(playPauseTimeout);
        playPauseTimeout = setTimeout(function() {
          playPauseIndicator.classList.remove('show');
        }, 800);
      }

      function showVolumeIndicator(vol) {
        updateVolume(vol);
        volumeIndicator.classList.add('show');
        clearTimeout(volumeTimeout);
        volumeTimeout = setTimeout(function() {
          volumeIndicator.classList.remove('show');
        }, 1500);
      }

      function showBrightnessIndicator(brightness) {
        updateBrightness(brightness);
        brightnessIndicator.classList.add('show');
        clearTimeout(brightnessTimeout);
        brightnessTimeout = setTimeout(function() {
          brightnessIndicator.classList.remove('show');
        }, 1500);
      }

      function showSkipIndicator(direction) {
        skipIndicatorLeft.classList.remove('show');
        skipIndicatorRight.classList.remove('show');
        clearTimeout(skipTimeout);

        var indicator = direction === 'left' ? skipIndicatorLeft : skipIndicatorRight;
        indicator.classList.add('show');

        skipTimeout = setTimeout(function() {
          indicator.classList.remove('show');
        }, 800);
      }

      function showSeekPreview(delta, targetTime) {
        // Force check sign từ delta thực tế
        var isPositive = delta >= 0;
        var sign = isPositive ? '+' : '-';
        var minutes = Math.floor(targetTime / 60);
        var seconds = Math.floor(targetTime % 60);
        var timeStr = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

        var deltaEl = seekPreviewIndicator.querySelector('.seek-preview-delta');
        var deltaValue = sign + Math.round(Math.abs(delta)) + 's';

        // Set text content
        deltaEl.textContent = deltaValue;

        // Force set color bằng style trực tiếp
        if (isPositive) {
          deltaEl.style.color = '#00ced1'; // Cyan cho tua tới
        } else {
          deltaEl.style.color = '#ff8c00'; // Cam cho tua lùi
        }

        seekPreviewIndicator.querySelector('.seek-preview-time').textContent = timeStr;

        seekPreviewIndicator.classList.add('show');
        clearTimeout(seekPreviewTimeout);
        seekPreviewTimeout = setTimeout(function() {
          seekPreviewIndicator.classList.remove('show');
        }, 600);
      }

      function showDoubleTapIndicator(direction) {
        var indicator = direction === 'left' ? doubleTapIndicatorLeft : doubleTapIndicatorRight;
        indicator.classList.add('show');
        setTimeout(function() {
          indicator.classList.remove('show');
        }, 400);
      }

      // ==================== KHỐI PLAYER.READY() ====================
      player.ready(function() {
        // ==================== KHÔI PHỤC VỊ TRÍ CŨ ====================
        var savedTime = localStorage.getItem(storageKey);
        if (savedTime && parseFloat(savedTime) > 5) {
          var duration = player.duration();
          if (parseFloat(savedTime) < duration * 0.9) {
            player.pause();
            player.currentTime(0);
            setTimeout(function() {
              var minutes = Math.floor(savedTime / 60);
              var seconds = Math.floor(savedTime % 60);
              var timeString = minutes + "p " + (seconds < 10 ? "0" : "") + seconds + "s";
              var continueWatching = confirm(
                "Bạn đã xem video này trước đó đến phút: " + timeString + ".\n\n" +
                "Bấm OK để TIẾP TỤC xem từ đây.\n" +
                "Bấm Cancel để XEM LẠI từ đầu."
              );
              if (continueWatching) {
                player.currentTime(parseFloat(savedTime));
              } else {
                localStorage.removeItem(storageKey);
                player.currentTime(0);
              }
            }, 600);
          }
        }

        // ==================== LƯU VỊ TRÍ ====================
        player.on('timeupdate', function() {
          if (!player.paused() && !player.ended()) {
            localStorage.setItem(storageKey, player.currentTime());
          }
          updateTimeDisplay();
        });
        window.addEventListener('beforeunload', function() {
          if (!player.ended()) {
            localStorage.setItem(storageKey, player.currentTime());
          }
        });
        player.on('ended', function() {
          localStorage.removeItem(storageKey);
        });

        // ==================== CẬP NHẬT TIME DISPLAY KHI LOADED ====================
        player.on('loadedmetadata', function() {
          updateTimeDisplay();
        });
        player.on('seeked', function() {
          updateTimeDisplay();
        });

        // ==================== PLAY/PAUSE INDICATOR ====================
        player.on('play', function() {
          showPlayPauseIndicator(true);
          updateTimeDisplay();
        });
        player.on('pause', function() {
          showPlayPauseIndicator(false);
          updateTimeDisplay();
        });

        // ==================== PHÍM TẮT BÀN PHÍM (PC) ====================
        player.el().addEventListener('keydown', function(e) {
          switch(e.keyCode) {
            case 37: // ←
              player.currentTime(player.currentTime() - 5);
              showSkipIndicator('left');
              e.preventDefault();
              break;
            case 39: // →
              player.currentTime(player.currentTime() + 5);
              showSkipIndicator('right');
              e.preventDefault();
              break;
            case 38: // ↑
              var newVol = Math.min(player.volume() + 0.1, 1);
              player.volume(newVol);
              showVolumeIndicator(newVol);
              e.preventDefault();
              break;
            case 40: // ↓
              var newVol = Math.max(player.volume() - 0.1, 0);
              player.volume(newVol);
              showVolumeIndicator(newVol);
              e.preventDefault();
              break;
            case 32: // Space
            case 75: // K
              if (player.paused()) {
                player.play();
              } else {
                player.pause();
              }
              e.preventDefault();
              break;
            case 77: // M
              player.muted(!player.muted());
              showVolumeIndicator(player.muted() ? 0 : player.volume());
              e.preventDefault();
              break;
            case 70: // F
              if (player.isFullscreen()) {
                player.exitFullscreen();
              } else {
                player.requestFullscreen();
              }
              e.preventDefault();
              break;
            case 74: // J
              player.currentTime(player.currentTime() - 10);
              showSkipIndicator('left');
              e.preventDefault();
              break;
            case 76: // L
              player.currentTime(player.currentTime() + 10);
              showSkipIndicator('right');
              e.preventDefault();
              break;
            case 188: // , (comma)
              if (e.shiftKey) {
                // Shift + , : Giảm tốc độ
                var newRate = Math.max(0.25, player.playbackRate() - 0.25);
                player.playbackRate(newRate);
                showSpeedIndicator(newRate);
                e.preventDefault();
              }
              break;
            case 190: // . (period)
              if (e.shiftKey) {
                // Shift + . : Tăng tốc độ
                var newRate = Math.min(4.0, player.playbackRate() + 0.25);
                player.playbackRate(newRate);
                showSpeedIndicator(newRate);
                e.preventDefault();
              }
              break;
            case 191: // / (slash)
              if (e.shiftKey) {
                // Shift + / : Phục hồi tốc độ về 1.0
                player.playbackRate(1.0);
                showSpeedIndicator(1.0);
                e.preventDefault();
              }
              break;
          }
        });

        // ==================== SPEED INDICATOR ====================
        function showSpeedIndicator(speed) {
          var speedIndicator = document.getElementById('speed-indicator');
          if (!speedIndicator) {
            speedIndicator = document.createElement('div');
            speedIndicator.id = 'speed-indicator';
            speedIndicator.className = 'speed-indicator';
            speedIndicator.innerHTML = '<span class="speed-icon">⚡</span><span class="speed-value">1.0x</span>';
            playerElement.appendChild(speedIndicator);
          }
          
          speedIndicator.querySelector('.speed-value').textContent = speed.toFixed(2) + 'x';
          speedIndicator.classList.add('show');
          clearTimeout(window.speedTimeout);
          window.speedTimeout = setTimeout(function() {
            speedIndicator.classList.remove('show');
          }, 1500);
        }

        // ==================== SEEK PREVIEW (PC - DRAG SEEK BAR) ====================
        var isSeekDragging = false;
        var seekStartTime = 0;

        // Tìm seek bar element
        var seekBar = playerElement.querySelector('.vjs-progress-control');
        if (seekBar) {
          seekBar.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return; // Chỉ xử lý click trái
            isSeekDragging = true;
            seekStartTime = player.currentTime();
          });

          document.addEventListener('mousemove', function(e) {
            if (!isSeekDragging) return;

            var rect = seekBar.getBoundingClientRect();
            var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            var duration = player.duration();
            var targetTime = pct * duration;
            var delta = targetTime - seekStartTime;

            showSeekPreview(delta, targetTime);
          });

          document.addEventListener('mouseup', function(e) {
            if (!isSeekDragging) return;
            isSeekDragging = false;

            var rect = seekBar.getBoundingClientRect();
            var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            var duration = player.duration();
            var targetTime = pct * duration;

            player.currentTime(targetTime);
            seekPreviewIndicator.classList.remove('show');
          });
        }

        // ==================== DESKTOP HOLD + SWIPE TO SEEK ====================
        var isHoldSwipe = false;
        var holdSwipeStartX = 0;
        var holdSwipeCurrentX = 0;
        var holdSwipeStartTime = 0;
        var holdSwipeThreshold = 50; // px để bắt đầu seek
        var holdSwipeDelay = 300; // ms giữ chuột để kích hoạt
        var holdSwipeTimer = null;
        var holdActivated = false; // Flag: đã qua giai đoạn hold chưa

        playerElement.addEventListener('mousedown', function(e) {
          if (e.button !== 0) return; // Chỉ xử lý click trái
          if (e.target.closest('.vjs-progress-control')) return; // Bỏ qua seek bar

          isHoldSwipe = false;
          holdActivated = false;
          holdSwipeStartX = e.clientX;
          holdSwipeStartTime = Date.now();

          // Clear timer cũ nếu có
          if (holdSwipeTimer) clearTimeout(holdSwipeTimer);

          // Kích hoạt sau khi giữ 300ms
          holdSwipeTimer = setTimeout(function() {
            if (!holdActivated) {
              holdActivated = true;
              isHoldSwipe = true;
              holdSwipeStartTime = player.currentTime();
            }
          }, holdSwipeDelay);
        });

        document.addEventListener('mousemove', function(e) {
          if (!isHoldSwipe || !holdActivated) return;

          holdSwipeCurrentX = e.clientX;
          var deltaX = holdSwipeCurrentX - holdSwipeStartX;
          var seekDelta = deltaX * 0.1; // 10px = 1s
          var targetTime = Math.max(0, Math.min(player.duration(), holdSwipeStartTime + seekDelta));

          showSeekPreview(seekDelta, targetTime);
        });

        document.addEventListener('mouseup', function(e) {
          if (holdSwipeTimer) clearTimeout(holdSwipeTimer);

          if (!isHoldSwipe || !holdActivated) {
            isHoldSwipe = false;
            holdActivated = false;
            return;
          }

          var deltaX = e.clientX - holdSwipeStartX;
          var seekDelta = deltaX * 0.1;
          var targetTime = Math.max(0, Math.min(player.duration(), holdSwipeStartTime + seekDelta));

          player.currentTime(targetTime);
          seekPreviewIndicator.classList.remove('show');
          isHoldSwipe = false;
          holdActivated = false;
        });

        // ==================== MOBILE GESTURES & DOUBLE TAP ====================
        var touchStartY = 0;
        var touchStartX = 0;
        var lastTouchY = 0;
        var lastTouchX = 0;
        var touchStartTime = 0;
        var lastTouchTime = 0;
        var gestureType = null; // 'seek', 'volume', 'brightness', 'doubletap'
        var gestureLocked = false;
        var initialVolume = 0;
        var initialBrightness = 1;
        var seekAccumulator = 0;
        var lastSeekUpdate = 0;
        var doubleTapTimer = null;

        var GESTURE_THRESHOLD = 15; // px để xác định gesture type
        var SEEK_SENSITIVITY = 0.5; // seek sensitivity

        // Xử lý touch events cho cả mobile (có/không fullscreen)
        player.el().addEventListener('touchstart', function(e) {
          if (e.touches.length !== 1) return;

          var touch = e.touches[0];
          var rect = player.el().getBoundingClientRect();
          touchStartX = touch.clientX - rect.left;
          touchStartY = touch.clientY - rect.top;
          lastTouchX = touchStartX;
          lastTouchY = touchStartY;
          touchStartTime = Date.now();

          var width = rect.width;
          var height = rect.height;

          // Xác định vùng chạm
          var isLeftSide = touchStartX < width * 0.5;
          var isRightSide = touchStartX > width * 0.5;
          var isLeftEdge = touchStartX < width * 0.25; // 25% cạnh trái
          var isRightEdge = touchStartX > width * 0.75; // 25% cạnh phải
          var isCenterZone = touchStartX >= width * 0.25 && touchStartX <= width * 0.75; // 50% giữa

          // Check double tap (cả fullscreen và non-fullscreen)
          var now = Date.now();
          if (now - lastTouchTime < 300) {
            e.preventDefault();
            if (doubleTapTimer) {
              clearTimeout(doubleTapTimer);
              doubleTapTimer = null;
              
              gestureType = 'doubletap';
              
              // Tap 2 bên cạnh: tua ±5s
              if (isLeftEdge) {
                player.currentTime(player.currentTime() - 5);
                showSkipIndicator('left');
                showDoubleTapIndicator('left');
              } else if (isRightEdge) {
                player.currentTime(player.currentTime() + 5);
                showSkipIndicator('right');
                showDoubleTapIndicator('right');
              } 
              // Tap giữa: pause/resume
              else if (isCenterZone) {
                if (player.paused()) {
                  player.play();
                  showPlayPauseIndicator(true);
                } else {
                  player.pause();
                  showPlayPauseIndicator(false);
                }
              }
            }
            return;
          }
          lastTouchTime = now;

          // Set timer cho double tap
          doubleTapTimer = setTimeout(function() {
            doubleTapTimer = null;
          }, 300);

          // Chỉ xử lý gestures trong fullscreen
          if (!player.isFullscreen()) {
            gestureType = null;
            gestureLocked = false;
            return;
          }

          // Khởi tạo gesture
          gestureLocked = false;
          gestureType = null;
          seekAccumulator = 0;
          lastSeekUpdate = 0;

          if (isLeftSide) {
            // Bên trái: brightness
            initialBrightness = currentBrightness;
          } else {
            // Bên phải: volume hoặc seek
            initialVolume = player.volume();
          }
        }, { passive: false });

        player.el().addEventListener('touchmove', function(e) {
          if (!player.isFullscreen()) return;
          if (gestureType === 'doubletap') return;

          var touch = e.touches[0];
          var rect = player.el().getBoundingClientRect();
          var touchX = touch.clientX - rect.left;
          var touchY = touch.clientY - rect.top;

          var deltaY = touchY - touchStartY;
          var deltaX = touchX - touchStartX;

          // Lock gesture type khi vượt threshold
          if (!gestureLocked && gestureType !== 'doubletap') {
            var absX = Math.abs(deltaX);
            var absY = Math.abs(deltaY);

            if (absX > GESTURE_THRESHOLD || absY > GESTURE_THRESHOLD) {
              gestureLocked = true;

              if (absX > absY) {
                gestureType = 'seek';
                // Lưu vị trí bắt đầu seek
                seekAccumulator = 0;
                lastSeekUpdate = 0;
              } else {
                // Vuốt dọc
                var isLeftSide = touchStartX < rect.width * 0.5;
                gestureType = isLeftSide ? 'brightness' : 'volume';

                // Lưu initial values khi lock
                if (gestureType === 'brightness') {
                  initialBrightness = currentBrightness;
                } else {
                  initialVolume = player.volume();
                }
              }
            }
          }

          if (!gestureLocked) return;
          e.preventDefault();

          // Xử lý gesture
          if (gestureType === 'seek') {
            // Seek: vuốt ngang - tính delta từ lastTouchX để chính xác hơn
            var moveDelta = touchX - lastTouchX;
            seekAccumulator += moveDelta * SEEK_SENSITIVITY;
            var targetTime = Math.max(0, Math.min(player.duration(), player.currentTime() + seekAccumulator));

            console.log('SEEK MOVE: moveDelta=' + moveDelta + ', seekAccumulator=' + seekAccumulator + ', isNegative=' + (seekAccumulator < 0));

            // Cập nhật preview mỗi 100ms
            var now = Date.now();
            if (now - lastSeekUpdate > 100) {
              showSeekPreview(seekAccumulator, targetTime);
              lastSeekUpdate = now;
            }

          } else if (gestureType === 'volume') {
            // Volume: vuốt dọc bên phải
            var volumeDelta = -deltaY / rect.height;
            var newVol = Math.max(0, Math.min(1, initialVolume + volumeDelta));
            player.volume(newVol);
            showVolumeIndicator(newVol);

          } else if (gestureType === 'brightness') {
            // Brightness: vuốt dọc bên trái
            var brightnessDelta = -deltaY / rect.height;
            var newBrightness = Math.max(0, Math.min(1, initialBrightness + brightnessDelta));
            showBrightnessIndicator(newBrightness);
          }

          lastTouchX = touchX;
          lastTouchY = touchY;
        }, { passive: false });

        player.el().addEventListener('touchend', function(e) {
          if (!player.isFullscreen()) return;

          if (gestureType === 'seek' && Math.abs(seekAccumulator) > 5) {
            var targetTime = Math.max(0, Math.min(player.duration(), player.currentTime() + seekAccumulator));
            player.currentTime(targetTime);
          }
          seekPreviewIndicator.classList.remove('show');

          gestureType = null;
          gestureLocked = false;
          seekAccumulator = 0;
        });

        // ==================== CLICK VOLUME ĐỂ HIỂN THỊ THANH TRƯỢT (MOBILE) ====================
        player.el().addEventListener('click', function(e) {
          if (player.isFullscreen()) return; // Bỏ qua click trong fullscreen

          var rect = player.el().getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var width = rect.width;
          var height = rect.height;

          // Nếu click vào góc dưới phải (nơi nút volume)
          if (x > width * 0.85 && y > height * 0.8) {
            e.stopPropagation();
            mobileVolumeOverlay.classList.add('active');
            updateMobileVolumeOverlay(player.volume());

            var slider = mobileVolumeOverlay.querySelector('.mobile-volume-slider');
            var isDragging = false;

            var startDrag = function(ev) {
              isDragging = true;
              updateVolFromEvent(ev);
            };
            var drag = function(ev) {
              if (!isDragging) return;
              updateVolFromEvent(ev);
            };
            var endDrag = function() {
              isDragging = false;
              mobileVolumeOverlay.classList.remove('active');
            };
            var updateVolFromEvent = function(ev) {
              var cx = ev.clientX ? ev.clientX : (ev.touches && ev.touches[0] ? ev.touches[0].clientX : 0);
              if (!cx) return;
              var rectSlider = slider.getBoundingClientRect();
              var pct = Math.max(0, Math.min(100, ((cx - rectSlider.left) / rectSlider.width) * 100));
              var vol = pct / 100;
              player.volume(vol);
              updateMobileVolumeOverlay(vol);
            };

            slider.addEventListener('mousedown', startDrag);
            slider.addEventListener('touchstart', startDrag);
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
          }
        });

        player.on('click', function() { player.el().focus(); });

        // ==================== HIỂN THỊ ĐỘ PHÂN GIẢI ====================
        player.on('loadedmetadata', function() {
          var w = player.videoWidth(), h = player.videoHeight();
          var oldRes = playerElement.querySelector('.vjs-resolution-display');
          if(oldRes) oldRes.remove();

          var resDiv = document.createElement('div');
          resDiv.className = 'vjs-resolution-display';
          resDiv.innerHTML = w + 'x' + h;
          resDiv.style.cssText = 'position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.7); color:#fff; padding:2px 6px; font-size:12px; border-radius:3px; z-index:10; pointer-events:none;';
          playerElement.appendChild(resDiv);
        });
      });
    });
  </script>
