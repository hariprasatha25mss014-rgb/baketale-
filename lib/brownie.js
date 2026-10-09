function toppings(f){
  const pts=[[120,126],[190,121],[262,131],[158,148],[232,150],[302,142]];
  let s='';
  const r=(i,m)=>((i*37)%m);
  pts.forEach(([x,y],i)=>{
    if(f.top==='nuts') s+=`<path d="M${x-14} ${y} q4-14 16-12 q10-6 14 6 q4 12-10 14 q-14 6-20-8z" fill="#b98552" stroke="#7a5230" stroke-width="3"/>`;
    if(f.top==='oreo' && i%2===0) s+=`<g transform="rotate(${r(i,40)-20} ${x} ${y})"><circle cx="${x}" cy="${y}" r="17" fill="#1b1b22"/><path d="M${x-9} ${y} h18 M${x} ${y-9} v18" stroke="#f3ead8" stroke-width="3" stroke-linecap="round" opacity=".85"/></g>`;
    if(f.top==='biscoff' && i%2===0) s+=`<g transform="rotate(${r(i,50)-25} ${x} ${y})"><rect x="${x-18}" y="${y-11}" width="36" height="22" rx="6" fill="#c98a4b" stroke="#8a5424" stroke-width="2.5"/><path d="M${x-9} ${y-6}v12M${x} ${y-6}v12M${x+9} ${y-6}v12" stroke="#8a5424" stroke-width="2" stroke-linecap="round"/></g>`;
    if(f.top==='hazel') s+=`<circle cx="${x}" cy="${y}" r="${i%2?10:13}" fill="#a06a35" stroke="#6b4220" stroke-width="3"/><circle cx="${x-3}" cy="${y-4}" r="3" fill="#fff" opacity=".35"/>`;
    if(f.top==='pistachio'){ s+=`<rect x="${x-12}" y="${y-5}" width="24" height="10" rx="5" fill="#8fae4a" transform="rotate(${r(i,70)-35} ${x} ${y})"/><rect x="${x+8}" y="${y+7}" width="12" height="6" rx="3" fill="#c3d98a" transform="rotate(${r(i+3,60)-30} ${x} ${y})"/>`; }
    if(f.top==='chips' && i<5) s+=`<path d="M${x-8} ${y+6} l8-14 l8 14z" fill="#1a0903" stroke="#1a0903" stroke-width="4" stroke-linejoin="round"/>`;
  });
  return s;
}
function block(f,withTop=true){
  const drips=[[88,26],[152,40],[230,22],[300,34]].map(([x,l])=>`<rect x="${x}" y="164" width="14" height="${l}" rx="7" fill="${f.drizzle}"/>`).join('');
  return `
  <rect x="50" y="162" width="300" height="122" rx="24" fill="${f.base}" stroke="${f.base}" stroke-width="6"/>
  <path d="M62 200q40-12 80 0t80 0 80 0 40 0M62 242q40-12 80 0t80 0 80 0 40 0" stroke="${f.light}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>
  <path d="M72 112L328 112L352 170L48 170Z" fill="${f.light}" stroke="${f.light}" stroke-width="24" stroke-linejoin="round"/>
  <path d="M92 132q28-16 58 0M172 126q36-12 70 4M252 142q24-10 56 2M112 154q40-10 82 2M214 156q40-8 86 0" stroke="${f.base}" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>
  <ellipse cx="150" cy="122" rx="40" ry="6" fill="#fff" opacity=".14"/><ellipse cx="270" cy="140" rx="28" ry="5" fill="#fff" opacity=".12"/>
  ${drips}
  <path d="M74 126q25 20 50 0t50 0 50 0 50 0 50 0" stroke="${f.drizzle}" stroke-width="8" stroke-linecap="round" fill="none"/>
  ${withTop?toppings(f):''}`;
}
export function brownie(f,stack=false){
  if(!stack) return `<svg viewBox="20 78 360 224" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${f.name} brownie">${block(f)}</svg>`;
  return `<svg viewBox="0 20 400 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${f.name} brownie stack">
    <ellipse cx="200" cy="372" rx="175" ry="18" fill="rgba(0,0,0,.28)"/>
    <g transform="translate(0 92)">${block({...f,top:'none'},false)}</g>
    <g class="upper" transform="translate(8 -52) rotate(-3 200 200)">${block(f)}</g></svg>`;
}

