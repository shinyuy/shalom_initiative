"use client";
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { slides } from "../slides";

export default function Slideshow() {
  const [current, setCurrent] = useState(0); // main slide index
  const [imageIndex, setImageIndex] = useState(0); // sub-image index
  const soundRef = useRef(null);

  // Play audio for current slide
  const playAudio = (index) => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }

    const newSound = new Howl({
      src: [slides[index].audio],
      onend: () => {
        if (index < slides.length - 1) {
          setCurrent(index + 1);
        }
      },
    });

    soundRef.current = newSound;
    newSound.play();
  };

  // play audio when slide changes
  useEffect(() => {
    playAudio(current);
    // reset image index when main slide changes
    setImageIndex(0);

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, [current]);

  // cycle images inside each slide automatically
  useEffect(() => {
    const images = slides[current].images || [];
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000); // every 3 seconds
    return () => clearInterval(interval);
  }, [current]);

  const goNext = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
  };

  const goPrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-white shadow">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Shalom Initiative Logo"
            className="h-12 w-12 rounded-full border"
          />
          <h1 className="text-2xl font-bold text-green-800">
            Shalom Initiative
          </h1>
        </div>
        <p className="text-sm text-gray-500">Path to Peace ✌</p>
      </header>

      {/* Slide Content */}
      <div className="flex flex-1 items-center justify-center px-4 md:px-10 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl w-full">
          {/* Image Section */}
          <div className="order-1 md:order-2">
            <div className="relative w-full h-[280px] sm:h-[350px] md:h-[500px] rounded-2xl overflow-hidden border-4 border-green-100 shadow-lg">
              {slides[current].images &&
                slides[current].images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={slides[current].title}
                    className={`absolute inset-0 w-full h-full object-cover 
    transition-opacity duration-[5000ms] ease-[cubic-bezier(0.4,0,0.2,1)] 
    ${i === imageIndex ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
            </div>
          </div>

          {/* Text Section */}
          <div className="text-left space-y-6 order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-900">
              {slides[current].title}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {slides[current].text}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center gap-6 pb-8 pt-16">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ◀ Previous
        </button>
        <button
          onClick={goNext}
          disabled={current === slides.length - 1}
          className="px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
