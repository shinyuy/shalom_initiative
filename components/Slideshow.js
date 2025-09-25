"use client";
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { slides } from "../slides";

export default function Slideshow() {
  const [current, setCurrent] = useState(0);
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

  useEffect(() => {
    playAudio(current);

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, [current]);

  const goNext = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
  };

  const goPrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with Logo */}
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
      <div className="flex flex-1 items-center justify-center px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl w-full">
          {/* Text Section */}
          <div className="text-left space-y-6">
            <h2 className="text-3xl font-bold text-green-900">
              {slides[current].title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {slides[current].text}
            </p>
          </div>

          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="rounded-2xl shadow-lg w-full max-w-lg border-4 border-green-100"
            />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center gap-6 pb-8">
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
