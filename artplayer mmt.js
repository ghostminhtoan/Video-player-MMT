<div id="artplayer" style="width: 100%; aspect-ratio: 16/9; margin-bottom: 20px;"></div>
<script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>
<script>
    var art = new Artplayer({
        container: '#artplayer',
        url: 'https://github.com/ghostminhtoan/private/releases/download/draft.picture/subtitle.edit.single.word.mp4',
        title: 'Testing ArtPlayer',
        poster: '', // Thêm link ảnh thumbnail nếu muốn
        volume: 0.5,
        isLive: false,
        muted: false,
        autoplay: false,
        pip: true,
        autoSize: true,
        fullscreen: true,
        fullscreenWeb: true,
        setting: true,
        loop: true,
        playbackRate: true,
        aspectRatio: true,
        screenshot: true, // Chụp ảnh màn hình video
        hotkey: true, // Phím tắt (Space, Mũi tên...)
    });
</script>