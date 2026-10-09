/* ---------- DATA (from the Baketale menu) ---------- */

// Official Instagram handle for direct order confirmations
export const INSTAGRAM_ID = process.env.NEXT_PUBLIC_INSTAGRAM_ID || 'baketalee';
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || `https://instagram.com/${INSTAGRAM_ID}`;
export const INSTAGRAM_DM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_DM_URL || `https://ig.me/m/${INSTAGRAM_ID}`;

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
export const getWhatsAppUrl = text => WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
export const getSmsUrl = text => `sms:?body=${encodeURIComponent(text)}`;

export const FLAVOURS = [
  { id: 'classic',   name: 'Classic Chocolate', p: [250, 450, 850],   img: '/assets/brownies/classic.webp',   base: '#3b1d10', light: '#5d2f1a', drizzle: '#7a3b1c', top: 'none' },
  { id: 'double',    name: 'Double Chocolate',  p: [275, 500, 950],   img: '/assets/brownies/classic.webp',   base: '#2e140a', light: '#4d2616', drizzle: '#1a0903', top: 'chips' },
  { id: 'chip',      name: 'Choco Chip',        p: [275, 500, 950],   img: '/assets/brownies/classic.webp',   base: '#3b1d10', light: '#5d2f1a', drizzle: '#6a3318', top: 'chips' },
  { id: 'walnut',    name: 'Walnut',            p: [300, 550, 1050],  img: '/assets/brownies/stack.webp',     base: '#3b1d10', light: '#5d2f1a', drizzle: '#6a3318', top: 'nuts' },
  { id: 'oreo',      name: 'Oreo',              p: [300, 550, 1050],  img: '/assets/brownies/oreo.webp',      base: '#34190d', light: '#55291a', drizzle: '#f3ead8', top: 'oreo' },
  { id: 'caramel',   name: 'Caramel',           p: [300, 550, 1050],  img: '/assets/brownies/biscoff.webp',   base: '#3b1d10', light: '#5d2f1a', drizzle: '#e0a24a', top: 'none' },
  { id: 'lotus',     name: 'Lotus Biscoff',     p: [350, 650, 1250],  img: '/assets/brownies/biscoff.webp',   base: '#3b1d10', light: '#5d2f1a', drizzle: '#d9a35f', top: 'biscoff', premium: true },
  { id: 'nutella',   name: 'Nutella',           p: [350, 650, 1250],  img: '/assets/brownies/nutella.webp',   base: '#3b1d10', light: '#5d2f1a', drizzle: '#8b4a22', top: 'hazel',   premium: true },
  { id: 'pistachio', name: 'Pistachio',         p: [375, 700, 1350],  img: '/assets/brownies/pistachio.webp', base: '#3b1d10', light: '#5d2f1a', drizzle: '#8fae4a', top: 'pistachio', premium: true }
];

export const SIZES = [250, 500, 1000];
export const sizeLabel = g => g === 1000 ? '1 kg' : g + ' g';
export const F = id => FLAVOURS.find(f => f.id === id);

/* Hero flavours: background colour + text colour + line */
export const HERO = [
  { id: 'classic',   name: 'Classic Chocolate', bg: '#3a1a0e', ink: '#fbf1e2', tag: 'Rich, fudgy and homemade. The one that started the story.', img: '/assets/brownies/classic.webp' },
  { id: 'nutella',   name: 'Nutella',           bg: '#9a5426', ink: '#fff3e2', tag: 'Swirled with Nutella, hazelnut crunch on top.',             img: '/assets/brownies/nutella.webp' },
  { id: 'lotus',     name: 'Lotus Biscoff',     bg: '#e0b277', ink: '#2a1109', tag: 'Lotus Biscoff crumble and a caramel-spice drizzle.',       img: '/assets/brownies/biscoff.webp' },
  { id: 'pistachio', name: 'Pistachio',         bg: '#6f7f3d', ink: '#fbf6e6', tag: 'Crunchy pistachio over fudgy centre. Our premium pick.',  img: '/assets/brownies/pistachio.webp' },
  { id: 'oreo',      name: 'Oreo',              bg: '#2d2d3a', ink: '#fbf1e2', tag: 'Cookies and cream, baked straight into the fudge.',        img: '/assets/brownies/oreo.webp' }
];

export const SPECIALS = [
  { name: 'Assorted Brownie Box', icon: 'gift',  opts: [['6 pcs', 399], ['9 pcs', 599]],  img: '/assets/brownies/gift_box.webp' },
  { name: 'Brownie Bites',        icon: 'bites', opts: [['12 pcs', 249], ['20 pcs', 399]], img: '/assets/brownies/bites.jpg' },
  { name: 'Brownie Tub',          icon: 'tub',   opts: [['250 g', 299], ['500 g', 499]],   img: '/assets/brownies/tub.jpg' },
  { name: 'Brownie Tower',        icon: 'tower', opts: [['12 pcs', 699], ['16 pcs', 899]], img: '/assets/brownies/stack.webp' }
];

export const CAKES = [
  { name: 'Bento Brownie Cake',      opts: [['250 g', 449], ['500 g', 649]],  img: '/assets/brownies/cake.webp' },
  { name: 'Customised Brownie Cake', opts: [['500 g', 749], ['1 kg', 1299]], img: '/assets/brownies/cake.webp' }
];

export const EXTRAS = [
  ['Chocolate Drizzle', 20],
  ['Biscoff Drizzle', 25],
  ['Nutella Topping', 30],
  ['Toppings (Choco Chips / Nuts)', 20]
];

export const ADDONS = [
  ['Kinder Bueno', 40],
  ['Ferrero Rocher', 50],
  ['Nutella', 30],
  ['Oreo', 20],
  ['Biscoff', 25],
  ['Choco Chips', 20]
];

export const BOX_FLAVOURS = [
  ['Classic Fudgy', '#3b1d10', '/assets/brownies/classic.webp'],
  ['Oreo', '#1e1e24', '/assets/brownies/oreo.webp'],
  ['Double Chocolate', '#2e140a', '/assets/brownies/classic.webp'],
  ['Choco Chip', '#6a3318', '/assets/brownies/classic.webp'],
  ['Nutella', '#9a5426', '/assets/brownies/nutella.webp'],
  ['Biscoff', '#d9a35f', '/assets/brownies/biscoff.webp']
];

export const ICONS = {
  gift: '<path d="M6 16h28v20H6zM4 11h32v5H4zM20 11v25M20 11c-6-8-12-2-7 0M20 11c6-8 12-2 7 0"/>',
  bites: '<path d="M6 22l8-5 8 5-8 5zM14 27v8l8 5v-8zM22 22l8-5 8 5-8 5zM30 27v8l8 5v-8z" transform="scale(.8) translate(4 0)"/>',
  tub: '<path d="M8 14h24l-3 22H11zM6 14h28M10 14c0-6 20-6 20 0"/>',
  tower: '<path d="M6 36h28v-9H6zM10 27v-8h20v8M14 19v-8h12v8M20 11V6"/>'
};

export const rupee = n => '₹' + n.toLocaleString('en-IN');
