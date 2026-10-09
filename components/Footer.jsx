'use client';

export default function Footer() {
  return (
    <footer className="atelier-footer">
      <div className="atelier-footer__top">
        <div className="atelier-footer__brand">
          <a href="#top" className="atelier-footer__logo">BAKETALE<span>®</span></a>
          <p className="atelier-footer__tagline">A story in every bite.</p>
          <p className="atelier-footer__desc">
            Handcrafted homemade brownies, bento cakes &amp; artisanal gift boxes. Baked in small batches with premium couverture chocolate and pure butter.
          </p>
        </div>

        <div className="atelier-footer__col">
          <h4>EXPLORE</h4>
          <nav>
            <a href="/menu">Flavours Menu</a>
            <a href="/#story">Our Story</a>
            <a href="/#box">Build a Box (₹150)</a>
            <a href="/menu">Specials &amp; Cakes</a>
          </nav>
        </div>

        <div className="atelier-footer__col">
          <h4>ORDER &amp; CARE</h4>
          <nav>
            <a href="/#faq">Frequently Asked Questions</a>
            <a href="https://instagram.com/baketalee" target="_blank" rel="noopener noreferrer">Instagram @baketalee ↗</a>
            <span>Shipping Across India 📦</span>
            <span>Fresh Small-Batch Baking</span>
          </nav>
        </div>

        <div className="atelier-footer__col atelier-footer__col--insta">
          <h4>INSTAGRAM DM ORDERING</h4>
          <p>Add items to your bag, open receipt, and send to <b>@baketalee</b> to confirm your delivery slot.</p>
          <a href="https://instagram.com/baketalee" target="_blank" rel="noopener noreferrer" className="bt-pill bt-pill--insta">
            Order on Instagram @baketalee ↗
          </a>
        </div>
      </div>

      <div className="atelier-footer__bottom">
        <span>© {new Date().getFullYear()} Baketale Atelier. All rights reserved. Handcrafted with love. ♡</span>
        <a href="#top" className="atelier-footer__back-top">Back to top ↑</a>
      </div>
    </footer>
  );
}
