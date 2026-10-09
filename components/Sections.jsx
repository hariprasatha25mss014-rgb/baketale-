'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';
import { FLAVOURS, SIZES, sizeLabel, rupee, SPECIALS, CAKES, EXTRAS, ADDONS, BOX_FLAVOURS, ICONS, INSTAGRAM_ID, INSTAGRAM_URL } from '../lib/data';
import { useCart } from './Cart';

const rise = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

function Heading({ children, className = '' }) {
  return (
    <h2 className={className}>
      {String(children).split(' ').map((w, i) => (
        <span key={i} className="line" style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '.06em', marginRight: '.25em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '115%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

const Wave = ({ cls, d }) => (
  <svg className={`wave ${cls}`} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
    <path d={d} />
  </svg>
);

const W1 = 'M0 40C120 0 240 80 360 40S600 0 720 40s240 40 360 0 240-40 360 0V80H0Z';
const W2 = 'M0 40C120 80 240 0 360 40S600 80 720 40s240-40 360 0 240 40 360 0V80H0Z';

/* 3. Tilted Marquee Ribbon */
export function Ribbon() {
  const t = [
    'Fudgy crinkle top, always',
    'Rich · Fudgy · Homemade',
    'Baked with love',
    'Shipping across India',
    'A story in every bite'
  ];

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  return (
    <div className="ribbon" aria-hidden="true">
      <motion.div className="ribbon__track" style={{ x: velocityFactor }}>
        {[...t, ...t, ...t, ...t].map((s, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <span>{s}</span>
            <i />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* 4. Story Section */
export function Story() {
  const ref = useRef(null);
  const text = 'Every brownie starts as a small idea in a home kitchen, a pinch of patience, a lot of chocolate and one rule: it has to taste like something worth telling someone about. That is why we bake every batch by hand, with premium ingredients, a crackly top and a fudgy centre. A story in every bite.'.split(' ');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] });

  const P = [
    ['Premium ingredients', 'Real chocolate, real nuts, real Nutella and Biscoff.'],
    ['Homemade with love', 'Small batches, baked by hand, never in a factory.'],
    ['Shipping across India', 'From our kitchen to your doorstep, wherever you are.']
  ];

  return (
    <section className="story" id="story">
      <div className="wrap">
        <p className="story__text" ref={ref}>
          {text.map((w, i) => (
            <Word key={i} w={w} i={i} n={text.length} p={scrollYProgress} />
          ))}
        </p>
        <ul className="pillars">
          {P.map(([h, p], i) => (
            <motion.li key={h} {...rise} transition={{ ...rise.transition, delay: i * 0.1 }}>
              <div className="pillar__icon">
                <span className="pillar__num">0{i + 1}</span>
              </div>
              <h3>{h}</h3>
              <p>{p}</p>
            </motion.li>
          ))}
        </ul>
      </div>
      <Wave cls="wave--blush" d={W2} />
    </section>
  );
}

function Word({ w, i, n, p }) {
  const o = useTransform(p, [i / n, Math.min(1, (i + 3) / n)], [0.15, 1]);
  return (
    <motion.span className="w" style={{ opacity: o, display: 'inline-block', marginRight: '.26em' }}>
      {w}
    </motion.span>
  );
}

/* 5. Flavours Menu */
export function Menu() {
  const { add } = useCart();
  const [s, setS] = useState(0);

  return (
    <section className="menu" id="menu">
      <div className="wrap">
        <div className="head">
          <Heading>Brownie flavours</Heading>
          <p className="head__sub">Pick a size, pick a craving. Prices update as you switch.</p>
        </div>

        <div className="tabs" role="tablist" aria-label="Select brownie box size">
          {SIZES.map((g, i) => (
            <button
              key={g}
              role="tab"
              aria-selected={i === s}
              className={`tab ${i === s ? 'is-on' : ''}`}
              onClick={() => setS(i)}
            >
              {sizeLabel(g)}
            </button>
          ))}
        </div>

        <div className="grid">
          {FLAVOURS.map((f, i) => (
            <motion.article
              key={f.id}
              className={`card ${f.premium ? 'card--premium' : ''}`}
              {...rise}
              transition={{ ...rise.transition, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -8, rotate: -0.8 }}
            >
              <div className="card__art">
                <img
                  src={f.img}
                  alt={`${f.name} brownie`}
                  className="card__img"
                  loading="lazy"
                />
              </div>
              <h3>
                {f.premium && <span className="crown" title="Premium Collection">♛ </span>}
                {f.name}
              </h3>
              <div className="card__row">
                <motion.span
                  key={s}
                  className="price"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {rupee(f.p[s])}
                </motion.span>
                <motion.button
                  className="add"
                  whileHover={{ rotate: 90, scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  aria-label={`Add ${f.name} ${sizeLabel(SIZES[s])}`}
                  onClick={() =>
                    add({
                      id: `${f.id}-${SIZES[s]}`,
                      name: f.name + ' Brownies',
                      detail: sizeLabel(SIZES[s]),
                      price: f.p[s],
                      img: f.img
                    })
                  }
                >
                  +
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="note">
          <span className="crown">♛</span> Premium collection: Lotus Biscoff, Nutella &amp; Pistachio.
        </p>
      </div>
      <Wave cls="wave--cream" d={W1} />
    </section>
  );
}

function Opts({ s }) {
  const { add } = useCart();
  return s.opts.map(([l, p]) => (
    <div className="opt" key={l}>
      <span>{l}</span>
      <b>{rupee(p)}</b>
      <motion.button
        className="mini"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => add({ id: `${s.name}-${l}`, name: s.name, detail: l, price: p, img: s.img })}
      >
        Add
      </motion.button>
    </div>
  ));
}

/* 6. Specials and Brownie Cakes */
export function Specials() {
  return (
    <section className="specials" id="specials">
      <div className="wrap">
        <div className="head head--left">
          <Heading>Specials &amp; brownie cakes</Heading>
          <p className="head__sub">Gifting, sharing, celebrating. Add what you love to the cart.</p>
        </div>

        <div className="spec-layout">
          <div className="spec-col">
            {SPECIALS.map(s => (
              <motion.div className="spec" key={s.name} {...rise}>
                <h3>
                  <svg
                    viewBox="0 0 40 42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: ICONS[s.icon] }}
                  />
                  {s.name}
                </h3>
                <Opts s={s} />
              </motion.div>
            ))}
          </div>

          <div className="spec-col spec-col--cake">
            <motion.div className="photo photo--cake" {...rise}>
              <img
                src="/assets/brownies/cake.webp"
                alt="Brownie cake decorated with Good Vibes Only"
                loading="lazy"
              />
              <span className="sticker hand">Good vibes only ♡</span>
            </motion.div>

            {CAKES.map(s => (
              <motion.div className="spec" key={s.name} {...rise}>
                <h3>{s.name}</h3>
                <Opts s={s} />
              </motion.div>
            ))}

            <p className="pinknote">
              ✨ Custom cake decorations, extra toppings, Nutella / Biscoff drizzle and custom celebration messages are handcrafted upon request. Order and confirm via Instagram DM <b>@{INSTAGRAM_ID}</b>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 7. Build-your-box on dark chocolate */
export function BoxBuilder() {
  const { add } = useCart();
  const [q, setQ] = useState(BOX_FLAVOURS.map(() => 0));
  const total = q.reduce((a, b) => a + b, 0);
  const full = total === 3;
  const slots = [];
  q.forEach((c, i) => {
    for (let k = 0; k < c; k++) slots.push(i);
  });

  const bump = (i, d) => setQ(p => p.map((v, k) => (k === i ? v + d : v)));

  return (
    <section className="box" id="box">
      <Wave cls="wave--top-cream" d="M0 0H1440V40C1320 80 1200 0 1080 40S840 80 720 40 480 0 360 40 120 80 0 40Z" />
      <div className="wrap box__grid">
        <div className="box__copy">
          <Heading>The ₹150 Brownie Box</Heading>
          <p className="head__sub">Three pieces, 40 g each. Choose any three flavours, doubles allowed.</p>
          <div className="picker">
            {BOX_FLAVOURS.map(([n, c], i) => (
              <div className="pick" key={n}>
                <span className="pick__dot" style={{ background: c }} />
                <span className="pick__name">{n}</span>
                <div className="step">
                  <button disabled={!q[i]} onClick={() => bump(i, -1)} aria-label={`Remove ${n}`}>
                    −
                  </button>
                  <output>{q[i]}</output>
                  <button disabled={full} onClick={() => bump(i, 1)} aria-label={`Add ${n}`}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="box__stage">
          <div className="boxviz">
            {[0, 1, 2].map(s => (
              <div key={s} className={`slot ${slots[s] !== undefined ? 'full' : ''}`}>
                {slots[s] !== undefined ? (
                  <motion.div
                    key={`${s}-${slots[s]}`}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 14 }}
                    className="slot__brownie"
                  >
                    <img
                      src={BOX_FLAVOURS[slots[s]][2] || '/assets/brownies/classic.webp'}
                      alt={BOX_FLAVOURS[slots[s]][0]}
                    />
                    <span>{BOX_FLAVOURS[slots[s]][0]}</span>
                  </motion.div>
                ) : (
                  <span className="slot__empty-icon">+</span>
                )}
              </div>
            ))}
          </div>

          <p className="box__status">
            {full ? '✨ Perfect. Your box of 3 is ready!' : `Pick ${3 - total} more flavour${3 - total === 1 ? '' : 's'}`}
          </p>

          <motion.button
            className="btn btn--solid btn--light"
            disabled={!full}
            whileTap={{ scale: 0.95 }}
            whileHover={full ? { scale: 1.04 } : {}}
            onClick={() => {
              const names = [];
              q.forEach((c, i) => {
                if (c) names.push((c > 1 ? c + '× ' : '') + BOX_FLAVOURS[i][0]);
              });
              add({
                id: 'box-' + names.join('|'),
                name: 'Brownie Box (3 pcs)',
                detail: names.join(', '),
                price: 150,
                img: '/assets/brownies/gift_box.webp'
              });
              setQ(q.map(() => 0));
            }}
          >
            Add box to cart · ₹150
          </motion.button>
        </div>
      </div>
      <Wave cls="wave--cream" d={W2} />
    </section>
  );
}

/* 8. Extras and Add-ons */
export function Extras() {
  const { add } = useCart();
  const chips = (arr, k) =>
    arr.map(([n, p]) => (
      <motion.button
        key={n}
        className="chip"
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => add({ id: `${k}-${n}`, name: n, detail: k, price: p })}
      >
        <span>{n}</span>
        <b>{rupee(p)}</b>
      </motion.button>
    ));

  return (
    <section className="extras" id="extras">
      <div className="wrap extras__grid">
        <div>
          <h3 className="h3">Extras</h3>
          <p className="hand">Perfect for every craving ♡</p>
          <div className="chips">{chips(EXTRAS, 'Extra')}</div>
        </div>
        <div>
          <h3 className="h3">Add-ons</h3>
          <p className="hand">Customise as you like ♡</p>
          <div className="chips">{chips(ADDONS, 'Add-on')}</div>
        </div>
      </div>
    </section>
  );
}

/* 9. Pinned horizontal-scroll gallery */
export function Gallery() {
  const ref = useRef(null);
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [dist, setDist] = useState(0);
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  useEffect(() => {
    const updateDist = () => {
      if (track.current) {
        setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 80));
      }
    };
    updateDist();
    window.addEventListener('resize', updateDist);
    return () => window.removeEventListener('resize', updateDist);
  }, []);

  return (
    <section className="gallery" id="gallery" ref={ref}>
      <div className="gallery__pin">
        <div className="gallery__intro">
          <Heading>Fudgy crinkle top. Always.</Heading>
          <p className="head__sub">Moments made with Baketale. Keep scrolling.</p>
        </div>
        <motion.div className="gallery__track" style={{ x }} ref={track}>
          <figure className="gcard gcard--tall">
            <img src="/assets/brownies/stack.webp" alt="Stack of fudgy brownies" />
            <figcaption className="hand">Rich, fudgy, homemade</figcaption>
          </figure>
          <figure className="gcard gcard--q">
            <blockquote>More brownie,<br />more happiness. ♡</blockquote>
          </figure>
          <figure className="gcard">
            <img src="/assets/brownies/pistachio.webp" alt="Pistachio brownie" />
            <figcaption className="hand">Pistachio crunch</figcaption>
          </figure>
          <figure className="gcard gcard--q gcard--pink">
            <blockquote>Thank you for supporting our small business. ♡</blockquote>
          </figure>
          <figure className="gcard">
            <img src="/assets/brownies/gift_box.webp" alt="Open box of brownies" />
            <figcaption className="hand">Pick any 3 or assorted 6</figcaption>
          </figure>
          <figure className="gcard gcard--end">
            <a className="btn btn--solid btn--light" href="/assets/img/menu.jpg" target="_blank" rel="noopener">
              View original menu card ↗
            </a>
          </figure>
        </motion.div>
      </div>
    </section>
  );
}

/* 10. Reviews & FAQ & Footer */
export function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('baketale-polaroid-reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReviews(parsed);
        }
      }
    } catch {}
  }, []);

  return (
    <section className="loved" id="loved">
      <div className="wrap">
        <div className="head">
          <Heading>Loved by brownie people</Heading>
          <p className="head__sub">Authentic feedback pinned along our artisanal brownie journey across India.</p>
        </div>

        {reviews.length === 0 ? (
          <div className="feedback-empty-state" style={{ background: '#ffffff', borderRadius: 24, padding: '40px 20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ fontSize: '2rem', color: '#d99f46', marginBottom: 12 }}>✦</div>
            <h3 style={{ fontSize: '1.5rem', color: '#261107', marginBottom: 8 }}>No Customer Reviews Yet</h3>
            <p style={{ color: '#735345', fontSize: '0.95rem', marginBottom: 20 }}>
              Be the first to order and pin your unboxing story on our Wall of Fudgy Moments!
            </p>
            <a href="/reviews?write=true" className="btn btn--solid btn--insta">
              Pin Your Review ✍
            </a>
          </div>
        ) : (
          <div className="reviews">
            {reviews.slice(0, 3).map((r, i) => (
              <motion.article
                key={r.id || i}
                className={`review ${i === 1 ? 'review--down' : ''}`}
                {...rise}
                transition={{ ...rise.transition, delay: i * 0.12 }}
              >
                <div className="stars">{'★'.repeat(r.rating || 5)}</div>
                <span className="q" aria-hidden="true">“</span>
                <p>{r.quote}</p>
                <footer>
                  <b>— {r.name}</b>
                  <small>{r.city}</small>
                </footer>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Faq() {
  const Q = [
    [
      'How do I place an order?',
      'Add anything you like to the bag, open it, and tap “Confirm on Instagram (@baketalee)”. Your complete order receipt is generated and copied to your clipboard, and opens our Instagram DM where you simply paste and hit send.'
    ],
    [
      'Do you ship across India?',
      'Yes! We ship freshly baked brownies from our kitchen to doorsteps all across India with protective packaging.'
    ],
    [
      'Can I customise a brownie cake?',
      'Absolutely. Custom designs, extra toppings, Nutella or Biscoff drizzle and name or age decorations are available. Send us your requirements on Instagram @baketalee.'
    ],
    [
      'Are your brownies homemade?',
      'Every single one. Handcrafted in small batches with premium ingredients and a lot of love.'
    ],
    [
      'What is in the ₹150 Brownie Box?',
      'Three brownies of 40 g each. You choose any three flavours from Classic Fudgy, Oreo, Double Chocolate, Choco Chip, Nutella and Biscoff.'
    ]
  ];

  const [open, setOpen] = useState(0);

  return (
    <section className="faq" id="faq">
      <div className="wrap faq__grid">
        <div>
          <Heading>Questions, answered</Heading>
          <p className="head__sub">Still curious? Send us a DM on Instagram @{INSTAGRAM_ID}.</p>
        </div>
        <div className="acc">
          {Q.map(([q, a], i) => (
            <div key={q} className="faq-item">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="faq-btn"
              >
                <span>{q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="faq-icon"
                >
                  +
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                style={{ overflow: 'hidden' }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="faq-ans">{a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <Wave cls="wave--top-cocoa" d={W1} />
      <div className="wrap foot__in">
        <div className="foot__brand">
          <img
            src="/assets/logo-cream.png"
            alt="Baketale — a story in every bite"
            className="foot__logo"
          />
          <p className="foot__tag hand">Handcrafted brownies · Baked with love</p>
        </div>
        <div className="foot__links">
          <a href="#menu">Flavours</a>
          <a href="#anatomy">Anatomy</a>
          <a href="#specials">Specials</a>
          <a href="#box">Build a Box</a>
          <a href="#gallery">Gallery</a>
          <a href="#faq">FAQ</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener">
            Instagram @{INSTAGRAM_ID} ↗
          </a>
        </div>
        <div className="foot__bottom">
          <p className="foot__small">
            Shipping across India · Handcrafted in small batches.<br />
            Thank you for supporting our small business. ♡
          </p>
          <span className="foot__copy">© {new Date().getFullYear()} Baketale. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
