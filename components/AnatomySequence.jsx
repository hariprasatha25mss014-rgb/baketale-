'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TOTAL_FRAMES = 120;

export default function AnatomySequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [loaded, setLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Preload frames progressively
  useEffect(() => {
    let isCancelled = false;
    const images = [];

    // Preload first frame immediately
    const img1 = new Image();
    img1.src = '/seq/frame_001.webp';
    img1.onload = () => {
      if (!isCancelled) {
        images[0] = img1;
        setLoaded(true);
      }
    };

    // Preload remaining frames in batches
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/seq/frame_${String(i).padStart(3, '0')}.webp`;
      img.onload = () => {
        images[i - 1] = img;
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, []);

  const drawFrame = useCallback((frameNumber) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameNumber - 1];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const frame = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(latest * (TOTAL_FRAMES - 1)) + 1)
      );
      setCurrentFrame(frame);
      drawFrame(frame);
    });

    return () => unsubscribe();
  }, [scrollYProgress, drawFrame]);

  // Initial draw when loaded
  useEffect(() => {
    if (loaded) {
      drawFrame(1);
    }
  }, [loaded, drawFrame]);

  // Stage text milestones based on scroll progress
  const step1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.35], [1, 1, 0]);
  const step2Opacity = useTransform(scrollYProgress, [0.32, 0.45, 0.65, 0.75], [0, 1, 1, 0]);
  const step3Opacity = useTransform(scrollYProgress, [0.72, 0.85, 1], [0, 1, 1]);

  return (
    <div ref={containerRef} className="anatomy-wrap" id="anatomy">
      <div className="anatomy-sticky">
        <div className="wrap anatomy__inner">
          <div className="anatomy__copy">
            <span className="badge-tag">Anatomy of Perfection</span>

            <div className="anatomy__text-stack">
              <motion.div style={{ opacity: step1Opacity }} className="anatomy__step">
                <h2 className="anatomy__title">Three Tiers of Pure Chocolate</h2>
                <p className="anatomy__desc">
                  Every batch begins with premium couverture chocolate and pure butter, baked to create our signature crackly crust and ultra-fudgy crumb.
                </p>
                <div className="anatomy__pill-stat">
                  <span>✦ 100% Real Chocolate</span>
                  <span>✦ No Artificial Mixes</span>
                </div>
              </motion.div>

              <motion.div style={{ opacity: step2Opacity }} className="anatomy__step">
                <h2 className="anatomy__title">Layers Separating in Mid-Air</h2>
                <p className="anatomy__desc">
                  A paper-thin crinkly crust floating above a molten ganache center, finished with warm chocolate drizzle and handmade crumb flakes.
                </p>
                <div className="anatomy__pill-stat">
                  <span>✦ Fudgy Crinkle Top</span>
                  <span>✦ Gooey Center</span>
                </div>
              </motion.div>

              <motion.div style={{ opacity: step3Opacity }} className="anatomy__step">
                <h2 className="anatomy__title">Reassembled With Love</h2>
                <p className="anatomy__desc">
                  Baked by hand in small batches in our kitchen. From our ovens to your doorstep anywhere in India.
                </p>
                <div className="anatomy__pill-stat">
                  <span>✦ Handcrafted Daily</span>
                  <span>✦ Shipping Across India</span>
                </div>
              </motion.div>
            </div>

            <div className="anatomy__scrubber-info">
              <span className="anatomy__counter">
                Frame {String(currentFrame).padStart(3, '0')} / {TOTAL_FRAMES}
              </span>
              <div className="anatomy__scrub-bar">
                <motion.div
                  className="anatomy__scrub-fill"
                  style={{ width: `${(currentFrame / TOTAL_FRAMES) * 100}%` }}
                />
              </div>
              <span className="hand anatomy__hint">Scroll to deconstruct ↕</span>
            </div>
          </div>

          <div className="anatomy__canvas-box">
            <canvas
              ref={canvasRef}
              width={840}
              height={840}
              className="anatomy__canvas"
              aria-label="Interactive 3D layer separation animation of Baketale brownies"
            />
            {!loaded && (
              <div className="anatomy__fallback">
                <img
                  src="/assets/brownies/stack.webp"
                  alt="Brownie stack"
                  className="anatomy__fallback-img"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
