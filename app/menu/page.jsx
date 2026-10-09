'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Smooth from '../../components/Smooth';
import { CartProvider, useCart } from '../../components/Cart';
import Navbar from '../../components/Navbar';
import { FLAVOURS, SIZES, sizeLabel, rupee, SPECIALS, CAKES } from '../../lib/data';
import { BoxBuilder, Footer } from '../../components/Sections';

function MenuPageContent() {
  const { add } = useCart();
  const [sizeIndex, setSizeIndex] = useState(0);

  return (
    <div className="bt-site" id="top">
      <Navbar />

      <main className="menu-page">
        {/* Page Hero */}
        <section className="menu-hero">
          <p className="eyebrow">FLAVOUR ATELIER & PRICING</p>
          <h1>Handcrafted <i>Brownies</i></h1>
          <p className="menu-hero__sub">
            Baked in small batches with premium couverture chocolate and pure butter. Select your box size to calculate prices in real-time.
          </p>

          {/* Size Selector Tabs */}
          <div className="menu-tabs" role="tablist" aria-label="Select box size">
            {SIZES.map((g, i) => (
              <button
                key={g}
                role="tab"
                aria-selected={i === sizeIndex}
                className={`menu-tab ${i === sizeIndex ? 'is-active' : ''}`}
                onClick={() => setSizeIndex(i)}
              >
                <span>{sizeLabel(g)} Box</span>
                <small>Updated pricing</small>
              </button>
            ))}
          </div>
        </section>

        {/* 9 Flavour Cards Grid */}
        <section className="menu-grid-section">
          <div className="wrap">
            <div className="menu-grid">
              {FLAVOURS.map((f, i) => (
                <motion.article
                  key={f.id}
                  className={`menu-card ${f.premium ? 'menu-card--premium' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                >
                  <div className="menu-card__image-box">
                    <img src={f.img} alt={`${f.name} Brownie`} />
                    {f.premium && <span className="menu-card__crown-tag">♛ Premium Collection</span>}
                  </div>

                  <div className="menu-card__body">
                    <h3>{f.name}</h3>
                    <p className="menu-card__detail">
                      {f.id === 'classic' && 'Original recipe with shiny crinkle crust and dense fudgy centre.'}
                      {f.id === 'double' && 'Extra dark cocoa base folded with melted dark chocolate chunks.'}
                      {f.id === 'chip' && 'Loaded with semi-sweet chocolate chips for a melty crunch.'}
                      {f.id === 'walnut' && 'Toasted California walnuts embedded in rich chocolate fudge.'}
                      {f.id === 'oreo' && 'Cookies & cream biscuit chunks baked straight into dark fudge.'}
                      {f.id === 'caramel' && 'Slow-cooked golden butter caramel swirl with sea salt.'}
                      {f.id === 'lotus' && 'Lotus Biscoff speculoos crumble and caramelised drizzle.'}
                      {f.id === 'nutella' && 'Swirled with authentic Nutella & toasted hazelnut crunch.'}
                      {f.id === 'pistachio' && 'Roasted Sicilian pistachios over an ultra-fudgy centre.'}
                    </p>

                    <div className="menu-card__row">
                      <div className="menu-card__price">
                        <strong>{rupee(f.p[sizeIndex])}</strong>
                        <small>/ {sizeLabel(SIZES[sizeIndex])}</small>
                      </div>

                      <button
                        className="btn btn--solid"
                        onClick={() =>
                          add({
                            id: `${f.id}-${SIZES[sizeIndex]}`,
                            name: f.name + ' Brownies',
                            detail: sizeLabel(SIZES[sizeIndex]),
                            price: f.p[sizeIndex],
                            img: f.img
                          })
                        }
                      >
                        Add to Bag +
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Specials & Bento Cakes Section */}
        <section className="menu-specials-section">
          <div className="wrap">
            <div className="head">
              <h2>Bento Cakes &amp; <i>Sharing Packs</i></h2>
              <p className="head__sub">Assorted boxes, bites, tubs, towers and celebration brownie cakes.</p>
            </div>

            <div className="specials-grid">
              {[...SPECIALS, ...CAKES].map((s) => (
                <div key={s.name} className="spec-card">
                  <img src={s.img || '/assets/brownies/stack.webp'} alt={s.name} />
                  <h3>{s.name}</h3>
                  <div className="spec-card__opts">
                    {s.opts.map(([label, price]) => (
                      <div key={label} className="spec-opt">
                        <span>{label}</span>
                        <b>{rupee(price)}</b>
                        <button
                          className="btn btn--ghost btn--small"
                          onClick={() => add({ id: `${s.name}-${label}`, name: s.name, detail: label, price, img: s.img })}
                        >
                          Add +
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ₹150 Box Builder Widget */}
        <BoxBuilder />
      </main>

      <Footer />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Smooth>
      <CartProvider>
        <MenuPageContent />
      </CartProvider>
    </Smooth>
  );
}
