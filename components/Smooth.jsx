'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Smooth({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Prevent browser from auto-scrolling to last saved scroll position on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Use native GPU-accelerated touch momentum scrolling on mobile devices
    const isTouchMobile =
      ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) &&
      window.innerWidth <= 800;

    if (isTouchMobile) {
      window.scrollTo(0, 0);
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });
    window.lenis = lenis;

    // Ensure page starts at top on initial load
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis RAF with GSAP ticker
    const tickerUpdate = time => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    const click = e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const targetId = a.getAttribute('href');
      if (targetId === '#') return;
      const t = document.querySelector(targetId);
      if (t) {
        e.preventDefault();
        lenis.scrollTo(t, { offset: -70, duration: 1.4 });
      }
    };

    document.addEventListener('click', click);

    return () => {
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      window.lenis = null;
      document.removeEventListener('click', click);
    };
  }, []);

  return children;
}
