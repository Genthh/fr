import React, { useEffect, useRef } from 'react';
import './App.css';
import Door from '../src/video/Door.mp4';

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    const registerVideo = (boundSelector, videoSelector) => {
      const bound = document.querySelector(boundSelector);
      const video = document.querySelector(videoSelector);
      const speedFactor = 2;

      let isScrolling = false;
      let animationFrameId = null;

      const scrollVideo = () => {
        if (isScrolling) return;

        isScrolling = true;

        animationFrameId = requestAnimationFrame(() => {
          if (video && video.duration) {
            const distanceFromTop = window.scrollY + bound.getBoundingClientRect().top;
            const rawPercentScrolled = (window.scrollY - distanceFromTop) / (bound.scrollHeight - window.innerHeight);
            const percentScrolled = Math.min(Math.max(rawPercentScrolled, 0), 1) * speedFactor;

            video.currentTime = video.duration * percentScrolled;
          }

          isScrolling = false;
        });
      };

      const throttleScroll = () => {
        if (!isScrolling) {
          scrollVideo();
        }
      };

      const unregisterVideo = () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('scroll', throttleScroll);
      };

      window.addEventListener('scroll', throttleScroll);

      return unregisterVideo;
    };

    const unregisterVideo1 = registerVideo("#bound-one", "#bound-one video");
    const unregisterVideo2 = registerVideo("#bound-two", "#bound-two video");
    const unregisterVideo3 = registerVideo("#bound-three", "#bound-three video");

    return () => {
      unregisterVideo1();
      unregisterVideo2();
      unregisterVideo3();
    };
  }, []);

  return (
    <div className="App">
      <div>
        <video className="video-player" ref={videoRef} muted >
          <source src={Door} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default App;
