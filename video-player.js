document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('video');
    const playPauseButton = document.getElementById('playPause');
    const seekbar = document.getElementById('seekbar');
    const muteToggleButton = document.getElementById('muteToggle');
    const fullScreenButton = document.getElementById('fullScreen');

    let isScrubbing = false;
    let wasPlayingBeforeScrub = false;

    function updateSeekbar() {
        if (!video.duration || isScrubbing) return;
        seekbar.value = (video.currentTime / video.duration) * 100;
    }

    function commitSeek() {
        if (!video.duration) return;
        const nextTime = (Number(seekbar.value) * video.duration) / 100;
        video.currentTime = nextTime;
        if (wasPlayingBeforeScrub) {
            video.play().catch(() => {});
        }
    }

    video.addEventListener('timeupdate', updateSeekbar);

    seekbar.addEventListener('pointerdown', function() {
        isScrubbing = true;
        wasPlayingBeforeScrub = !video.paused;
        video.pause();
    });

    seekbar.addEventListener('input', function() {
        if (!video.duration) return;
        // Keep the UI responsive while dragging, but don't force repeated seeks.
        const previewTime = (Number(seekbar.value) * video.duration) / 100;
        seekbar.setAttribute('aria-valuetext', `${Math.round(previewTime)} seconds`);
    });

    seekbar.addEventListener('change', function() {
        commitSeek();
        isScrubbing = false;
    });

    seekbar.addEventListener('pointerup', function() {
        commitSeek();
        isScrubbing = false;
    });

    video.addEventListener('loadedmetadata', function() {
        seekbar.value = (video.currentTime / video.duration) * 100;
    });

    const playPauseIcon = playPauseButton.querySelector('i');
    if (playPauseButton) {
        playPauseButton.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                playPauseIcon.className = 'fas fa-pause'; // Change icon to 'pause'
            } else {
                video.pause();
                playPauseIcon.className = 'fas fa-play'; // Change icon to 'play'
            }
        });
    }

    const muteToggleIcon = muteToggleButton.querySelector('i');
    muteToggleButton.addEventListener('click', function() {
        if (video.muted) {
            video.muted = false;
            muteToggleIcon.className = 'fas fa-volume-up'; // Change icon to 'volume up'
        } else {
            video.muted = true;
            muteToggleIcon.className = 'fas fa-volume-mute'; // Change icon to 'volume mute'
        }
    });
    
    const fullScreenIcon = fullScreenButton.querySelector('i');
    fullScreenButton.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            video.requestFullscreen();
            fullScreenIcon.className = 'fas fa-compress'; // Change icon to 'compress'
        } else {
            document.exitFullscreen();
            fullScreenIcon.className = 'fas fa-expand'; // Change icon to 'expand'
        }
    });
});

function closeVideoPlayer()
{
    const videoPlayer = document.querySelector('.custom-video-player');
    const video = document.getElementById('video');
    const iframe = videoPlayer.querySelector('iframe');
    const closeButton = videoPlayer.querySelector('.close-btn');
    const controls = document.querySelector('.controls');

    videoPlayer.style.opacity = '0';
    videoPlayer.style.transform = 'scale(0)';
    video.style.display = 'none';
    controls.style.display = 'none';

    const overlaySource = document.getElementById('page-overlay');
    overlaySource.style.opacity = 1;
    const hamburgerSource = document.getElementById('hamburger');
    hamburgerSource.style.opacity = 1;
    closeButton.style.display = 'none';

    if (iframe)
    {
        iframe.src = '';
    }

    if (video)
    {
        video.pause();
    }

    // ensure hero preview can resume later
    try {
        window.isPlayerOpen = false;
        // reschedule hero preview for the currently active slide
        const activeCarousel = document.getElementById(window.selectedCarouselId);
        const activeSlide = activeCarousel && activeCarousel.querySelector('.image-container.active');
        if (typeof schedulePreviewForSlide === 'function' && activeSlide) {
            schedulePreviewForSlide(activeSlide);
        }
    } catch (e) {}
}

document.addEventListener("DOMContentLoaded", function() {
    const videoPlayer = document.querySelector('.custom-video-player');
    const video = document.getElementById('video');
    const controls = videoPlayer.querySelector('.controls');
    const topBar = videoPlayer.querySelector('.top-bar');
    const closeButton = document.querySelector('.close-btn');

    let timeout;
    let mouseTimer = null, cursorVisible = true;

    function disappearCursor() {
        if (video.paused) return;
        if (cursorVisible) {
            videoPlayer.style.cursor = 'none';  // Hide the cursor
            hideControls();
            cursorVisible = false;
        }
    }

    function showControls() {
        controls.style.opacity = '1';
        topBar.style.opacity = '1';
        resetTimer();
    }

    function hideControls() {
        if (video.paused) return;
        controls.style.opacity = '0';
        topBar.style.opacity = '0';
    }

    function resetTimer() {
        clearTimeout(timeout);
        clearTimeout(mouseTimer);

        timeout = setTimeout(hideControls, 1500);  // Hide after 3 seconds of inactivity
        if (!cursorVisible) {
            videoPlayer.style.cursor = 'default'; // Show the cursor
            if (!video.paused) {                 // Show controls only if video is playing
                controls.style.opacity = '1';
                topBar.style.opacity = '1';
            }
            cursorVisible = true;
        }
        mouseTimer = setTimeout(disappearCursor, 1500); // Set timeout to hide cursor
    }

    videoPlayer.addEventListener('mousemove', showControls);
    videoPlayer.addEventListener('mouseleave', hideControls);
    video.addEventListener('play', resetTimer);
    video.addEventListener('pause', showControls);

    closeButton.addEventListener('click', function() {
        closeVideoPlayer();
    });

    resetTimer();  // Start the timer initially
});



document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('video');
    const videoPlayer = document.querySelector('.custom-video-player');
    const overlay = videoPlayer.querySelector('.video-overlay');
    const controls = videoPlayer.querySelector('.controls');
    const topBar = videoPlayer.querySelector('.top-bar');

    video.addEventListener('click', function() {
        togglePlayPause();
    });

    function isClickOnInteractiveElements(target) {
        // Check if the click is on video or any child of controls
        return target === video || controls.contains(target);
    }

    videoPlayer.addEventListener('click', function(event) {
        if (!isClickOnInteractiveElements(event.target)) {
            console.log("Clicked on non-interactive area of the video player.");
            closeVideoPlayer();
            // after closing via outside click, resume hero preview
            setTimeout(() => {
                try {
                    const activeCarousel = document.getElementById(window.selectedCarouselId);
                    const activeSlide = activeCarousel && activeCarousel.querySelector('.image-container.active');
                    if (typeof schedulePreviewForSlide === 'function' && activeSlide) {
                        schedulePreviewForSlide(activeSlide);
                    }
                } catch (e) {}
            }, 0);
        } else {
            console.log("Clicked on video or controls.");
        }
    });


    function togglePlayPause() {

        const playPauseButton = document.getElementById('playPause');
        const playPauseIcon = playPauseButton.querySelector('i');

        if (video.paused) {
            video.play();
            overlay.innerHTML = '&#10074;&#10074;';  // Unicode for pause symbol
            playPauseIcon.className = 'fas fa-pause';
        } else {
            video.pause();
            overlay.innerHTML = '&#9658;';  // Unicode for play symbol
            playPauseIcon.className = 'fas fa-play';
        }
    }

    video.addEventListener('play', function() {
        overlay.innerHTML = '&#10074;&#10074;';
        overlay.style.opacity = 0;
    });

    video.addEventListener('pause', function() {
        overlay.innerHTML = '&#9658;';
        overlay.style.opacity = 1;
    });

    // Hide controls and overlay when the video ends
    video.addEventListener('ended', function() {
        overlay.style.opacity = 0;
        controls.style.opacity = 0;
        topBar.style.opacity = 0;
        hamburger.style.opacity = 0;
    });
});
