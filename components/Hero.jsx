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
    bg: '#f7f2eb',
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

        {/* Hero Left: Original Cream Background & Dark Brown Typography */}
        <div className="hero-copy">
          <h1 className="reveal" style={{ color: '#261107' }}>
            A story<br />
            <i style={{ color: '#c8833e', fontStyle: 'italic' }}>in every</i><br />
            bite.
          </h1>

          <p className="hero-lede reveal" style={{ color: '#735345' }}>
            Fudgy brownies made slowly, obsessively and with enough chocolate to make you forget the rest of the internet exists.
          </p>

          <a href="#flavours" className="bt-pill reveal" style={{ background: '#261107', color: '#fbf5ed' }}>
            Explore the flavours <span>↓</span>
          </a>
        </div>

        {/* Hero Right: Visible Floating 3D Brownie Stage */}
        <div className="hero-art">
          <motion.div
            className="hero-ring"
            animate={{
              borderColor: f.ringColor
            }}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
          />

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
            style={{ cursor: 'pointer', zIndex: 10, display: 'grid', placeItems: 'center' }}
          >
            <AnimatePresence mode="popLayout" custom={dir}>
              <motion.div
                key={idx}
                className="hero-art__motion-card"
                custom={dir}
                initial={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: -5,
                  filter: 'blur(0px)'
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
                  y: -20 * dir,
                  scale: 0.88,
                  rotate: -7 * dir,
                  filter: 'blur(6px)'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 140,
                  damping: 18
                }}
              >
                <motion.img
                  src={f.img}
                  alt={`${f.name} artisanal brownie`}
                  style={{ width: '85%', maxWidth: '420px', height: 'auto', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 20px 30px rgba(31, 12, 5, 0.25))' }}
                  animate={{
                    y: [0, -12, 0],
                    rotate: [-5, -3, -5]
                  }}
                  transition={{
                    y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              className="hero-giant"
              style={{ color: f.watermarkColor }}
              custom={dir}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 0.16, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            >
              {f.watermark}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Indicator dots */}
        <div className="hero-progress-dots" style={{ position: 'absolute', bottom: '32px', right: '5vw', zIndex: 10, display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.8, color: '#261107', marginRight: '6px' }}>
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
                background: i === idx ? '#261107' : 'rgba(38, 17, 7, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        <div className="hero-side" aria-hidden="true" style={{ color: '#261107' }}>
          SCROLL TO TASTE <span>↓</span>
        </div>
      </motion.section>
    </div>
  );
}
