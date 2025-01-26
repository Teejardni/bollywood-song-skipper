// content.js - Detect start and endpoints of a song in a movie

(function() {
  let audioContext;
  let mediaSource;
  let analyser;
  let dataArray;
  let videoElement;

  function initAudioAnalysis(video) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    mediaSource = audioContext.createMediaElementSource(video);
    analyser = audioContext.createAnalyser();
    mediaSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }

  function analyzeAudio() {
    analyser.getByteFrequencyData(dataArray);
    const averageVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    return averageVolume;
  }

  function detectMusicSegments() {
    let musicStart = null;
    let musicEnd = null;
    let threshold = 50;
    let lastVolume = 0;

    const checkAudio = () => {
      const currentVolume = analyzeAudio();
      if (currentVolume > threshold && lastVolume <= threshold) {
        musicStart = videoElement.currentTime;
        console.log('Music started at:', musicStart);
      } else if (currentVolume <= threshold && lastVolume > threshold) {
        musicEnd = videoElement.currentTime;
        console.log('Music ended at:', musicEnd);
        alert(`Music found from ${musicStart.toFixed(2)}s to ${musicEnd.toFixed(2)}s`);
      }
      lastVolume = currentVolume;
      requestAnimationFrame(checkAudio);
    };

    checkAudio();
  }

  function setupDetection() {
    videoElement = document.querySelector('video');
    if (videoElement) {
      initAudioAnalysis(videoElement);
      videoElement.addEventListener('play', detectMusicSegments);
    } else {
      console.error('No video element found.');
    }
  }

  setupDetection();
})();
