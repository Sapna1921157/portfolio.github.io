/* ======= INTERACTIVE HOME ENHANCEMENTS ======= */

// --- Typewriter effect ---
const roles = [
  'FullStack Developer',
  'MEAN Stack Developer',
  'Angular Developer',
  'Web Designer',
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeText() {
  const current = roles[roleIndex];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);

  isDeleting ? charIndex-- : charIndex++;

  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    setTimeout(typeText, 1800);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(typeText, isDeleting ? 55 : 110);
}
typeText();

// --- Particle network canvas ---
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.init(); }
  init() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2 + 1;
    this.a  = Math.random() * 0.4 + 0.15;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(126,149,218,${this.a})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: 75 }, () => new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.hypot(dx, dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(126,149,218,${0.18 * (1 - d / 130)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

(function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
})();


/* ============================================= */

/* ======= SITE-WIDE INTERACTIVE ENHANCEMENTS ======= */

// --- Scroll progress bar ---
// Updates the width of the progress bar based on how far the user has scrolled
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrolled / maxScroll) * 100) + '%';
});

// --- Custom cursor ---
// Dot follows mouse instantly; outline follows with a slight delay for a smooth feel
const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let outlineX = 0, outlineY = 0;  // current outline position (lerped)
let mouseX   = 0, mouseY   = 0;  // actual mouse position

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Dot snaps directly to the cursor
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Animate the outline ring to lag slightly behind for a smooth trailing effect
(function animateCursor() {
  outlineX += (mouseX - outlineX) * 0.15;
  outlineY += (mouseY - outlineY) * 0.15;
  cursorOutline.style.left = outlineX + 'px';
  cursorOutline.style.top  = outlineY + 'px';
  requestAnimationFrame(animateCursor);
})();

// Enlarge the outline when hovering over interactive elements
document.querySelectorAll('a, button, .btn, .skill-box, .stat-box, #menu-icon').forEach(el => {
  el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
});

// Shrink dot on click for a satisfying press feel
document.addEventListener('mousedown', () => cursorDot.classList.add('clicked'));
document.addEventListener('mouseup',   () => cursorDot.classList.remove('clicked'));

// Hide cursor when mouse leaves the window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity     = '0';
  cursorOutline.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity     = '1';
  cursorOutline.style.opacity = '0.6';
});

// --- Animated counters in About section ---
// Each .counter element counts up from 0 to its data-target value when scrolled into view
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'));
  const duration = 1800; // ms
  const step     = target / (duration / 16); // increment per frame (60fps)
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

// Use IntersectionObserver so counters only animate when the About section is visible
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted'); // prevent re-triggering on re-scroll
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

// --- Button ripple effect ---
// Creates a circular ripple that expands from the click point on any .btn
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    // Size the ripple to cover the full button
    const size = Math.max(this.offsetWidth, this.offsetHeight);
    ripple.style.width  = size + 'px';
    ripple.style.height = size + 'px';

    // Position ripple at the click point, centred
    const rect = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600); // clean up after animation
  });
});

// --- Contact form real-time validation ---
// Adds green (valid) or red (invalid) border feedback as the user types

function validateEmail(val) {
  // Basic email format check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function validatePhone(val) {
  // Accepts exactly 10 digits
  return /^[0-9]{10}$/.test(val);
}

function liveValidate(inputEl, isValidFn) {
  inputEl.addEventListener('input', function() {
    const ok = isValidFn(this.value);
    // Only show invalid state if user has typed something
    this.classList.toggle('valid',   ok);
    this.classList.toggle('invalid', this.value.length > 0 && !ok);
  });
}

liveValidate(document.getElementById('name'),    v => v.trim().length >= 2);
liveValidate(document.getElementById('email'),   validateEmail);
liveValidate(document.getElementById('number'),  validatePhone);
liveValidate(document.getElementById('subject'), v => v.trim().length >= 2);

// --- Textarea character counter ---
// Shows live "x / 500" count below the message box; turns red near limit
const textarea = document.getElementById('message');
const charCounter = document.createElement('div');
charCounter.classList.add('char-counter');
charCounter.textContent = '0 / 500';
textarea.parentElement.appendChild(charCounter);

textarea.addEventListener('input', function() {
  const len = this.value.length;
  charCounter.textContent = len + ' / 500';
  charCounter.classList.toggle('limit', len > 450); // red when close to limit

  this.classList.toggle('valid',   len >= 10);
  this.classList.toggle('invalid', len > 0 && len < 10);
});

/* =================================================== */

// toggle icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

//scroll section

let sections = document.querySelectorAll('section');
let navlinks = document.querySelectorAll('header nav a');



window.onscroll =() =>{

  sections.forEach(sec =>{
    let top = window.scrollY;
    let offset = sec.offsetTop - 100;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if(top >= offset && top < offset + height){
    //active navbar links
        navlinks.forEach(links => {
            links.classList.remove('active');
            document.querySelector('header nav a[href*= '+ id +']').classList.add('active');
        });
        // active sections for animation on scroll
        sec.classList.add('show-animate');
    }
    else{
      sec.classList.remove('show-animate');
    }
  })


    //sticky header
    let header = document.querySelector('header');

    header.classList.toggle('sticky', window.scrollY > 100);

    // remove toggle icon and navbar when click navbar links (scroll)
    
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');


    // animation footer on scroll

    let footer = document.querySelector('footer');
    
    footer.classList.toggle('show-animate', this.innerHeight + this.scrollY >= document.scrollingElement.scrollHeight);

}













