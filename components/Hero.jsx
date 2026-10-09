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
  const heroRef = useRef(null);
  const isClickJumpingRef = useRef(false);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const n = FLAVOURS.length;

  // Kinetic ScrollTrigger Flavour Switching with inertia smoothing
  useEffect(() => {
    const wrapEl = wrapRef.current;
    const heroEl = heroRef.current;
    if (!wrapEl || !heroEl) return;

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapEl,
        start: 'top top',
        end: 'bottom bottom',
        pin: heroEl,
        pinSpacing: true,
        scrub: 0.8,
        onUpdate: (self) => {
          if (isClickJumpingRef.current) return;
          // Calibrated progress pacing across 5 flavours
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
    }, 200);

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

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const nextIdx = (idx + 1) % n;
        jump(nextIdx);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prevIdx = (idx - 1 + n) % n;
        jump(prevIdx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [idx, n]);

  const f = FLAVOURS[idx];

  return (
    <div className="hero-scroll-wrap" ref={wrapRef} id="top" style={{ height: '320vh' }}>
      <motion.section
        ref={heroRef}
        className="hero"
        animate={{
          backgroundColor: f.bg,
          color: f.ink
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'sticky',
          top: 0,
          minHeight: '100vh',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <div className="hero-noise" aria-hidden="true" />

        {/* Hero Left: Copy matching exact design */}
        <div className="hero-copy">
          <h1 className="reveal">
            A story<br />
            <i>in every</i><br />
            bite.
          </h1>

          <p className="hero-lede reveal">
            Fudgy brownies made slowly, obsessively and with enough chocolate to make you forget the rest of the internet exists.
          </p>

          <a href="#flavours" className="bt-pill reveal">
            Explore the flavours <span>↓</span>
          </a>
        </div>

        {/* Hero Right: 3D Brownie Stage with Framer Motion spring kinematics & scroll trigger */}
        <div className="hero-art">
          {/* Concentric Circular Backdrop Ring */}
          <motion.div
            className="hero-ring"
            animate={{
              borderColor: f.ringColor
            }}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
          />

          {/* Floating Brownie Image with Framer Motion Spring Kinematics */}
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
                  y: 42 * dir,
                  scale: 0.84,
                  rotate: 7 * dir,
                  filter: 'blur(10px)'
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
                  y: -32 * dir,
                  scale: 0.84,
                  rotate: -7 * dir,
                  filter: 'blur(10px)'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 130,
                  damping: 18,
                  mass: 0.8
                }}
              >
                <motion.img
                  src={f.img}
                  alt={`${f.name} artisanal brownie`}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-5, -3.2, -5]
                  }}
                  transition={{
                    y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 5.4, repeat: Infinity, ease: 'easeInOut' }
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
              initial={{ opacity: 0, scale: 0.92, y: 18 * dir }}
              animate={{ opacity: 0.14, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -18 * dir }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            >
              {f.watermark}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Indicator dots at bottom right */}
        <div className="hero-progress-dots" style={{ position: 'absolute', bottom: '32px', right: '5vw', zIndex: 10, display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.6, marginRight: '6px' }}>
            0{idx + 1} / 0{n}
          </span>
          {FLAVOURS.map((item, i) => (
            <button
              key={item.id}
              onClick={() => jump(i)}
              aria-label={`Switch to ${item.name}`}
              style={{
                width: i === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                border: 'none',
                background: i === idx ? f.ink : 'rgba(27, 16, 11, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Vertical Scroll Indicator on Right Edge */}
        <div className="hero-side" aria-hidden="true">
          SCROLL TO TASTE <span>↓</span>
        </div>
      </motion.section>
    </div>
  );
}
