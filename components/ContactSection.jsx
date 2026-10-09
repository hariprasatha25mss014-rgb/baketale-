'use client';

import { INSTAGRAM_ID, INSTAGRAM_URL } from '../lib/data';

export default function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="wrap contact__grid">
        <div className="contact__info">
          <p className="eyebrow">ORDER INQUIRIES &amp; CARE</p>
          <h2>Have a question?<br /><i>Let’s talk brownies.</i></h2>
          <p className="contact__lede">
            For custom birthday cakes, bulk event orders, shipping tracking or corporate gifting, reach out directly on Instagram.
          </p>

          <div className="contact__cards">
            <div className="contact-card">
              <span className="contact-icon">📲</span>
              <div>
                <b>Instagram DM</b>
                <p>@{INSTAGRAM_ID} · Live Order Confirmations</p>
              </div>
            </div>
            <div className="contact-card">
              <span className="contact-icon">📦</span>
              <div>
                <b>Pan-India Delivery</b>
                <p>Protective thermal packaging for doorstep delivery</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact__box">
          <h3>Quick DM Helper</h3>
          <p>Tap below to launch Instagram Direct with our order atelier:</p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--solid btn--wide btn--insta"
            style={{ marginTop: '20px' }}
          >
            Chat with @{INSTAGRAM_ID} on Instagram ↗
          </a>
        </div>
      </div>
    </section>
  );
}
