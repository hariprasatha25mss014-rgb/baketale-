'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const FLAVOURS = [
  {
    id: 'classic',
    pillName: 'Classic',
    name: 'Classic Chocolate',
    watermark: 'FUDGE',
    img: '/assets/brownies/classic.webp',
    bg: '#fbf5ed',
    ink: '#261107',
    ringColor: 'rgba(184, 91, 43, 0.22)',
    watermarkColor: '#d9a35f'
  },
  {
    id: 'nutella',
    pillName: 'Nutella',
    name: 'Nutella Hazelnut',
    watermark: 'NUTELLA',
    img: '/assets/brownies/nutella.webp',
    bg: '#fcf2ea',
    ink: '#2a1109',
    ringColor: 'rgba(190, 85, 35, 0.25)',
    watermarkColor: '#c8783e'
  },
  {
    id: 'biscoff',
    pillName: 'Biscoff',
    name: 'Lotus Biscoff',
    watermark: 'BISCOFF',
    img: '/assets/brownies/biscoff.webp',
    bg: '#faf3e5',
    ink: '#281206',
    ringColor: 'rgba(201, 138, 75, 0.26)',
    watermarkColor: '#d4984d'
  },
  {
    id: 'pistachio',
    pillName: 'Pistachio',
    name: 'Sicilian Pistachio',
    watermark: 'PISTACHIO',
    img: '/assets/brownies/pistachio.webp',
    bg: '#f3f6eb',
    ink: '#222d14',
    ringColor: 'rgba(111, 127, 61, 0.24)',
    watermarkColor: '#7a8c43'
  },
  {
    id: 'oreo',
    pillName: 'Oreo',
    name: 'Cookies & Cream',
    watermark: 'OREO',
    img: '/assets/brownies/oreo.webp',
    bg: '#f5f3f0',
    ink: '#1c1b1a',
    ringColor: 'rgba(50, 50, 65, 0.20)',
    watermarkColor: '#555668'
  }
];

export default function Hero() {
  const wrapRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const n = FLAVOURS.length;

  // Kinetic ScrollTrigger Flavour Switching (Native sticky without pin collision)
  useEffect(() => {
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;

    // Only enable scroll scrubbing on desktop where container expands
    if (window.innerWidth <= 800) return;

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const rawProgress = self.progress;
          const targetIdx = Math.min(n - 1, Math.max(0, Math.floor(rawProgress * n)));
          setIdx((prev) => {
            if (targetIdx !== prev) {
              setDir(targetIdx > prev ? 1 : -1);
              return targetIdx;
            }
            return prev;
          });
        }
      });
    }, wrapRef);

    const handleRefresh = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(handleRefresh);
      ctx.revert();
    };
  }, [n]);

  const jump = (targetIdx) => {
    if (targetIdx === idx) return;
    setDir(targetIdx > idx ? 1 : -1);
    setIdx(targetIdx);
  };

  const nextFlavour = () => {
    const nextIdx = (idx + 1) % n;
    jump(nextIdx);
  };

  const prevFlavour = () => {
    const prevIdx = (idx - 1 + n) % n;
    jump(prevIdx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextFlavour();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevFlavour();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [idx, n]);

  const f = FLAVOURS[idx];

  return (
    <div className="hero-scroll-wrap" ref={wrapRef}>
      <motion.section
        className="hero"
        animate={{
          backgroundColor: f.bg,
          color: f.ink
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero-noise" aria-hidden="true" />

        {/* Hero Left: Copy matching exact 02-hero-oreo.png reference */}
        <div className="hero-copy">
          <h1>
            A story<br />
            <i>in every</i><br />
            bite.
          </h1>

          <p className="hero-lede">
            Fudgy brownies made slowly, obsessively and with enough chocolate to make you forget the rest of the internet exists.
          </p>

          <a href="#flavours" className="bt-pill">
            EXPLORE THE FLAVOURS <span>↓</span>
          </a>
        </div>

        {/* Hero Right: 3D Brownie Stage with giant watermark and circular ring */}
        <div className="hero-art">
          {/* Concentric Circular Backdrop Ring */}
          <motion.div
            className="hero-ring"
            animate={{
              borderColor: f.ringColor
            }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
          />

          {/* Floating Brownie Image */}
          <div
            className="hero-art__product-wrap"
            onClick={nextFlavour}
            title="Click to switch flavour"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') nextFlavour();
            }}
            aria-label={`Current flavour: ${f.name}. Click to view next flavour.`}
            style={{ cursor: 'pointer' }}
          >
            <AnimatePresence mode="popLayout" custom={dir}>
              <motion.div
                key={idx}
                className="hero-art__motion-card"
                custom={dir}
                initial={{
                  opacity: 0,
                  y: 35 * dir,
                  scale: 0.88,
                  rotate: 6 * dir,
                  filter: 'blur(8px)'
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: -5,
                  filter: 'blur(0px)'
                }}
                exit={{
                  opacity: 0,
                  y: -30 * dir,
                  scale: 0.88,
                  rotate: -6 * dir,
                  filter: 'blur(8px)'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 140,
                  damping: 18,
                  mass: 0.8
                }}
              >
                <motion.img
                  src={f.img}
                  alt={`${f.name} artisanal brownie`}
                  animate={{
                    y: [0, -8, 0],
                    rotate: [-5, -3.5, -5]
                  }}
                  transition={{
                    y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dynamic Watermark Text behind Brownie */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              className="hero-giant"
              style={{ color: f.watermarkColor }}
              custom={dir}
              initial={{ opacity: 0, scale: 0.94, y: 15 * dir }}
              animate={{ opacity: 0.14, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.04, y: -15 * dir }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            >
              {f.watermark}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Indicator dots at bottom right matching 02-hero-oreo.png */}
        <div className="hero-progress-dots">
          <span className="hero-progress-idx">
            0{idx + 1} / 0{n}
          </span>
          <div className="hero-dots-group">
            {FLAVOURS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => jump(i)}
                aria-label={`Switch to ${item.name}`}
                className={`hero-dot-pill ${i === idx ? 'is-active' : ''}`}
                style={{
                  background: i === idx ? f.ink : 'rgba(27, 16, 11, 0.22)'
                }}
              />
            ))}
          </div>
          <button
            onClick={nextFlavour}
            className="hero-progress-arrow"
            aria-label="Next flavour"
          >
            ←
          </button>
        </div>

        {/* Vertical Scroll Indicator on Right Edge */}
        <div className="hero-side" aria-hidden="true">
          SCROLL TO TASTE
        </div>
      </motion.section>
    </div>
  );
}
