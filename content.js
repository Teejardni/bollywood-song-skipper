(function() {
    function log(message, type = 'info') {
      const timestamp = new Date().toISOString();
      const styles = {
        'info': 'color: blue',
        'warn': 'color: orange; font-weight: bold',
        'error': 'color: red; font-weight: bold; font-size: 16px'
      };
      console.log(`%c[${timestamp}][MUSIC DETECTOR] ${message}`, styles[type] || styles['info']);
    }
  
    class MusicDetector {
      constructor(videoElement) {
        this.videoElement = videoElement;
        this.musicDetected = false;
      }
  
      createDebugButton() {
        log('Attempting to create debug button', 'warn');
  
        const existingButton = document.getElementById('debug-music-btn');
        if (existingButton) {
          existingButton.remove();
        }
  
        const button = document.createElement('button');
        button.id = 'debug-music-btn';
        button.textContent = 'DEBUG: Skip Music';
        
        button.setAttribute('style', `
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 2147483647 !important;
          background-color: #ff0000 !important;
          color: white !important;
          border: 3px solid yellow !important;
          padding: 15px 25px !important;
          border-radius: 10px !important;
          font-size: 18px !important;
          font-weight: bold !important;
          cursor: pointer !important;
          box-shadow: 0 0 20px rgba(0,0,0,0.5) !important;
          display: block !important;
          opacity: 1 !important;
          transform: scale(1.1) !important;
          text-transform: uppercase !important;
        `);
  
        button.onclick = () => {
          log('Debug button clicked', 'warn');
          this.logVideoDetails();
          button.remove();
        };
  
        // Multiple insertion methods
        try {
          // Method 1: Direct body append
          document.body.appendChild(button);
          log('Button appended to body', 'info');
  
          // Method 2: Insert at different locations
          document.documentElement.appendChild(button);
          
          // Logging for verification
          const buttonCheck = document.getElementById('debug-music-btn');
          if (buttonCheck) {
            log('Button successfully created and added to DOM', 'info');
          } else {
            log('Failed to add button to DOM', 'error');
          }
        } catch (error) {
          log(`Button creation error: ${error.message}`, 'error');
        }
      }
  
      logVideoDetails() {
        if (!this.videoElement) {
          log('No video element found', 'error');
          return;
        }
  
        log('Video Element Details:', 'warn');
        log(`Current Time: ${this.videoElement.currentTime}`, 'info');
        log(`Paused: ${this.videoElement.paused}`, 'info');
        log(`Ended: ${this.videoElement.ended}`, 'info');
        log(`Duration: ${this.videoElement.duration}`, 'info');
        log(`Src: ${this.videoElement.src}`, 'info');
        
        // Check visibility and positioning
        const rect = this.videoElement.getBoundingClientRect();
        log('Video Element Rect:', 'info');
        log(`Top: ${rect.top}, Left: ${rect.left}, Width: ${rect.width}, Height: ${rect.height}`, 'info');
      }
  
      startDetection() {
        log('Starting music detection', 'info');
        
        // Simulate music detection for debugging
        const detectLoop = () => {
          log(`Current video time: ${this.videoElement.currentTime}`, 'info');
          
          // Artificial trigger for testing
          if (!this.musicDetected && this.videoElement.currentTime > 5) {
            log('Music detection triggered', 'warn');
            this.musicDetected = true;
            this.createDebugButton();
          }
          
          if (!this.videoElement.paused) {
            setTimeout(detectLoop, 1000);
          }
        };
  
        detectLoop();
      }
    }
  
    function initMusicDetector() {
      log('Initializing music detector', 'info');
  
      const videoElements = document.querySelectorAll('video');
      log(`Found ${videoElements.length} video elements`, 'warn');
  
      videoElements.forEach((videoElement, index) => {
        log(`Processing video element ${index + 1}`, 'info');
  
        ['play', 'playing'].forEach(eventName => {
          videoElement.addEventListener(eventName, () => {
            log(`Video ${eventName} event triggered`, 'info');
            const detector = new MusicDetector(videoElement);
            detector.startDetection();
          });
        });
      });
    }
  
    ['DOMContentLoaded', 'load'].forEach(event => {
      window.addEventListener(event, initMusicDetector);
    });
  
   
    const observer = new MutationObserver(initMusicDetector);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  
  
    initMusicDetector();
  })();