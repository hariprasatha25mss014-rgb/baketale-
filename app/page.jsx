'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Smooth from '../components/Smooth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackSection from '../components/FeedbackSection';
import ContactSection from '../components/ContactSection';
import { CartProvider, useCart } from '../components/Cart';
import { FLAVOURS, SPECIALS, rupee } from '../lib/data';
import FlavourSwitchHero from '../components/Hero';

gsap.registerPlugin(ScrollTrigger);

const featured = [FLAVOURS[0], FLAVOURS[7], FLAVOURS[6], FLAVOURS[8], FLAVOURS[4]];

function BuyButton({ product, label = 'Add to bag' }) {
  const { add } = useCart();
  return (
    <button className="bt-buy" onClick={() => add({ id: product.id, name: product.name, detail: '500 g', price: product.p?.[1] || 500, img: product.img })}>
      <span>{label}</span><span>↗</span>
    </button>
  );
}

function Experience() {
  const { count, setOpen } = useCart();
  const root = useRef(null);
  const heroImg = useRef(null);
  const heroType = useRef(null);
  const ingredients = useRef([]);
  const flavourTrack = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.set(q('.reveal'), { y: 70, opacity: 0 });
      gsap.to(q('.hero-copy .reveal'), { y: 0, opacity: 1, stagger: .12, duration: 1.1, ease: 'power4.out', delay: .2 });

      if (heroImg.current) {
        gsap.to(heroImg.current, {
          yPercent: 24, rotate: 10, scale: 1.13, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
      }
      if (heroType.current) {
        gsap.to(heroType.current, {
          xPercent: -24, yPercent: 15, opacity: .15, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
      }

      gsap.fromTo(ingredients.current, { y: 0, rotation: 0 }, {
        y: (i) => (i % 2 ? -170 : 150), rotation: (i) => (i % 2 ? -20 : 18),
        ease: 'none', stagger: .02,
        scrollTrigger: { trigger: '.alchemy', start: 'top bottom', end: 'bottom top', scrub: 1 }
      });

      gsap.to('.alchemy__brownie', {
        scale: 1.18, rotate: -5,
        scrollTrigger: { trigger: '.alchemy', start: 'top center', end: 'center center', scrub: 1 }
      });

      gsap.to(flavourTrack.current, {
        x: () => -(flavourTrack.current.scrollWidth - window.innerWidth + 40),
        ease: 'none',
        scrollTrigger: { trigger: '.flavours', start: 'top top', end: '+=2200', pin: true, scrub: 1, invalidateOnRefresh: true }
      });

      gsap.utils.toArray('.story-word').forEach((el, i) => {
        gsap.fromTo(el, { xPercent: i % 2 ? 18 : -18, opacity: .2 }, {
          xPercent: i % 2 ? -12 : 12, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      });

      gsap.fromTo('.box__lid', { y: -110, rotate: -6 }, { y: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: '.box-section', start: 'top 80%', end: 'center center', scrub: 1 } });
      gsap.fromTo('.box__pieces img', { y: 90, opacity: 0, scale: .7 }, { y: 0, opacity: 1, scale: 1, stagger: .12, ease: 'back.out(1.3)', scrollTrigger: { trigger: '.box-section', start: 'top 65%', end: 'center center', scrub: 1 } });

      gsap.fromTo('.final-photo', { scale: 1.45 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, []);

  const mouseMove = (e) => {
    const r = root.current?.getBoundingClientRect();
    if (!r || !heroImg.current) return;
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    gsap.to(heroImg.current, { x: x * 24, y: y * 18, duration: .8, ease: 'power3.out' });
  };

  return (
    <div ref={root} onMouseMove={mouseMove} className="bt-site">
      <Navbar />

      <main id="top">
        <FlavourSwitchHero />

        <section className="alchemy">
          <div className="alchemy-head"><p className="eyebrow">THE ALCHEMY</p><h2>Good things<br /><i>take time.</i></h2></div>
          <div className="alchemy-stage">
            {['COCOA','SEA SALT','BUTTER','SUGAR','CHOCOLATE','VANILLA'].map((x,i)=><span key={x} ref={el => ingredients.current[i]=el} className={`ingredient ingredient-${i}`}>{x}</span>)}
            <div className="alchemy__brownie"><img src="/assets/brownies/classic.webp" alt="Classic brownie" /></div>
            <p className="alchemy-caption">Whisk. Fold. Bake. Rest.<br />Then cut into the good stuff.</p>
          </div>
        </section>

        <section className="flavours" id="flavours">
          <div className="flavours-intro"><p className="eyebrow">THE FLAVOUR PARADE</p><h2>Pick your<br /><i>weakness.</i></h2><span>↠ Drag your eyes. Scroll your way through.</span></div>
          <div ref={flavourTrack} className="flavour-track">
            {featured.map((f, i) => <article className="flavour-card" key={f.id}>
              <div className="flavour-index">0{i+1}</div><div className="flavour-img"><img src={f.img} alt={f.name} /></div>
              <div className="flavour-info"><p>{i === 0 ? 'THE ORIGINAL' : i === 1 ? 'HAZELNUT OBSESSION' : i === 2 ? 'CARAMEL CRUNCH' : i === 3 ? 'PISTACHIO CLUB' : 'COOKIE CRUSH'}</p><h3>{f.name}</h3><strong>{rupee(f.p?.[1] || 500)} <small>/ 500 g</small></strong><BuyButton product={f} /></div>
            </article>)}
          </div>
        </section>

        <section className="story" id="story">
          <div className="story-sticky"><p className="eyebrow">NOT JUST A BROWNIE</p><h2>It starts<br />with a <i>craving.</i></h2><p>We bake in small batches so every box feels like it came straight from someone’s kitchen — because it did.</p></div>
          <div className="story-words"><div className="story-word">MELT</div><div className="story-word italic">CRACKLE</div><div className="story-word">FUDGE</div><div className="story-word italic">SHARE</div></div>
        </section>

        <section className="box-section" id="box">
          <div className="box-copy">
            <p className="eyebrow">YOUR BOX. YOUR RULES.</p>
            <h2>Build a box<br /><i>worth opening.</i></h2>
            <p>Mix the classics with the wild cards. Six brownies, infinite reasons to say “just one more.”</p>
            <a className="bt-pill bt-pill--dark" href="/menu">Choose your flavours <span>→</span></a>
          </div>
          <div className="box-photo-stage">
            <img src="/assets/brownies/gift_box.webp" alt="Baketale Handcrafted Brownie Gift Box" className="box-photo" />
          </div>
        </section>

        {/* Customer Feedback & Polaroid Testimonials Section */}
        <FeedbackSection />

        <section className="quick-shop" id="specials">
          <div><p className="eyebrow">ALSO BAKED HERE</p><h2>For birthdays,<br /><i>bad days & good news.</i></h2></div>
          <div className="quick-grid">
            {SPECIALS.slice(0,3).map((s,i)=><article key={s.name}><div className="quick-img"><img src={s.img || '/assets/brownies/stack.webp'} alt={s.name} /></div><span>0{i+1}</span><h3>{s.name}</h3><p>{rupee(s.opts[0][1])} · {s.opts[0][0]}</p></article>)}
          </div>
        </section>

        {/* Dedicated Contact & Inquiry Section */}
        <ContactSection />

        <section className="final">
          <img className="final-photo" src="/assets/img/stack.jpg" alt="Baketale brownies" />
          <div className="final-overlay">
            <p className="eyebrow">BAKETALE ATELIER</p>
            <h2>Made to be<br /><i>remembered.</i></h2>
            <a className="bt-pill" href="#top">Back to the beginning ↑</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function Page() {
  return <Smooth><CartProvider><Experience /></CartProvider></Smooth>;
}
