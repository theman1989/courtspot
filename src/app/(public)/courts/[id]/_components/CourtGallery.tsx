"use client";

import { useState } from "react";
import Image from "next/image";

export default function CourtGallery({ photos, sportBg }: { photos: string[]; sportBg: string }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const hero = photos[0];

  function prev() {
    setActiveIdx((i) => (i - 1 + photos.length) % photos.length);
  }

  function next() {
    setActiveIdx((i) => (i + 1) % photos.length);
  }

  return (
    <>
      <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden bg-[#E2E8F0]">
        {hero ? (
          <Image
            src={hero}
            alt="Court"
            fill
            className="object-cover cursor-pointer"
            onClick={() => { setActiveIdx(0); setOpen(true); }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: sportBg }}
          >
            <svg className="w-20 h-20 text-white/40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
        )}

        {photos.length > 1 && (
          <button
            onClick={() => { setActiveIdx(0); setOpen(true); }}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-[#0F172A] text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-white transition-colors"
          >
            View all {photos.length} photos
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center text-3xl leading-none"
            onClick={() => setOpen(false)}
          >
            ×
          </button>

          <div
            className="relative max-w-4xl w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[80vh]">
              <Image
                src={photos[activeIdx]}
                alt={`Photo ${activeIdx + 1} of ${photos.length}`}
                fill
                className="object-contain rounded-xl"
              />
            </div>

            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white/70 hover:text-white text-4xl leading-none"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white/70 hover:text-white text-4xl leading-none"
                >
                  ›
                </button>
                <div className="flex justify-center gap-2 mt-4">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === activeIdx ? "bg-white" : "bg-white/35"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
