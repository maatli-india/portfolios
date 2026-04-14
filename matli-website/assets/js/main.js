// ===================================
// Main JavaScript (All Pages)
// ===================================

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // Add active class to current page nav link
    highlightCurrentPage();
    
    // Smooth scroll for anchor links
    setupSmoothScroll();
});

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


// Smooth scroll for Navbar
// Navbar glass scroll behaviour
const navbar = document.querySelector('.navbar');
const hero = document.querySelector('.hero'); // adjust selector if needed

window.addEventListener('scroll', () => {
  const heroBottom = hero.getBoundingClientRect().bottom;
  const pastHero = heroBottom <= 0;

  // hide/show entire navbar with all its contents
  navbar.style.opacity = pastHero ? '0' : '1';
  navbar.style.pointerEvents = pastHero ? 'none' : 'auto';

  // glass effect only applies while navbar is visible
  navbar.classList.toggle('scrolled', window.scrollY > 24 && !pastHero);

}, { passive: true });




// clock
const SEGS = {
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0],
  2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1],
  6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1]
};

const H_CLASS = ['seg-h','seg-v','seg-v','seg-h','seg-v','seg-v','seg-h'];
const P_CLASS = ['seg-a','seg-b','seg-c','seg-d','seg-e','seg-f','seg-g'];
const DAYS    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function buildDigit(el) {
  if (!el) return;
  ['a','b','c','d','e','f','g'].forEach((_, i) => {
    const s = document.createElement('div');
    s.className = `seg ${H_CLASS[i]} ${P_CLASS[i]}`;
    el.appendChild(s);
  });
}

function setDigit(el, num) {
  if (!el) return;
  const pattern = SEGS[num] ?? SEGS[0];
  el.querySelectorAll('.seg').forEach((s, i) => {
    s.classList.toggle('on', pattern[i] === 1);
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // build all digit containers
  const allDigits = [
    'h1','h2','m1','m2','s1','s2',   // time
    'dd1','dd2',                       // day-of-month
    'mo1','mo2',                       // month
    'yr1','yr2','yr3','yr4'            // year
  ];
  allDigits.forEach(id => buildDigit(document.getElementById(id)));

  let colonOn = true;

  function tick() {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    const h  = now.getHours();
    const mi = now.getMinutes();
    const s  = now.getSeconds();
    const dd = now.getDate();
    const mo = now.getMonth() + 1;   // 1-based
    const yr = now.getFullYear();
    const dy = now.getDay();          // 0 = Sun

    // ── time ──
    setDigit(document.getElementById('h1'), Math.floor(h  / 10));
    setDigit(document.getElementById('h2'), h  % 10);
    setDigit(document.getElementById('m1'), Math.floor(mi / 10));
    setDigit(document.getElementById('m2'), mi % 10);
    setDigit(document.getElementById('s1'), Math.floor(s  / 10));
    setDigit(document.getElementById('s2'), s  % 10);

    // ── date ──
    setDigit(document.getElementById('dd1'), Math.floor(dd / 10));
    setDigit(document.getElementById('dd2'), dd % 10);
    setDigit(document.getElementById('mo1'), Math.floor(mo / 10));
    setDigit(document.getElementById('mo2'), mo % 10);

    // ── year (4 digits) ──
    setDigit(document.getElementById('yr1'), Math.floor(yr / 1000));
    setDigit(document.getElementById('yr2'), Math.floor((yr % 1000) / 100));
    setDigit(document.getElementById('yr3'), Math.floor((yr % 100)  / 10));
    setDigit(document.getElementById('yr4'), yr % 10);

    // ── day label ──
    document.getElementById('clock-day').textContent = DAYS[dy];

    // ── blink colons ──
    colonOn = !colonOn;
    document.querySelectorAll('.colon').forEach(c =>
      c.style.opacity = colonOn ? '1' : '0.25'
    );
  }

  tick();
  setInterval(tick, 1000);
});