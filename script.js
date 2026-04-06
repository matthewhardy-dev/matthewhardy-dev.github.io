// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// Typing animation for hero value proposition
const typedEl = document.getElementById('typed-text');
if (typedEl) {
    const phrases = [
        "I turn operational chaos into automated systems.",
        "Building data pipelines that save thousands of hours.",
        "From raw data to executive-ready insights.",
        "Automating what others do manually."
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseEnd = 0;

    function typeLoop() {
        const current = phrases[phraseIndex];
        const speed = isDeleting ? 30 : 55;

        if (!isDeleting && charIndex <= current.length) {
            typedEl.textContent = current.substring(0, charIndex);
            charIndex++;
            if (charIndex > current.length) {
                // Pause at end of phrase
                setTimeout(() => { isDeleting = true; typeLoop(); }, 2000);
                return;
            }
        } else if (isDeleting && charIndex >= 0) {
            typedEl.textContent = current.substring(0, charIndex);
            charIndex--;
            if (charIndex < 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                charIndex = 0;
                setTimeout(typeLoop, 400);
                return;
            }
        }
        setTimeout(typeLoop, speed);
    }
    // Start after hero animations finish
    setTimeout(typeLoop, 1200);
}

// Collapsible experience bullets
function toggleBullets(btn) {
    const bullets = btn.previousElementSibling;
    bullets.classList.toggle('expanded');
    btn.textContent = bullets.classList.contains('expanded') ? 'Show less ▴' : 'Show more ▾';
}

// Staggered scroll fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Group elements by parent so siblings stagger
const staggerGroups = new Map();
document.querySelectorAll('.timeline-item, .skill-category, .edu-card, .contact-card, .stat-card, .about-text, .highlight-item').forEach(el => {
    el.classList.add('fade-in');
    const parent = el.parentElement;
    if (!staggerGroups.has(parent)) staggerGroups.set(parent, []);
    staggerGroups.get(parent).push(el);
});

// Apply stagger delay per group
staggerGroups.forEach(group => {
    group.forEach((el, i) => {
        el.style.transitionDelay = `${i * 100}ms`;
        observer.observe(el);
    });
});

// Skill tags slide-in animation
const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const tags = entry.target.querySelectorAll('.tag');
            tags.forEach((tag, i) => {
                tag.style.transitionDelay = `${i * 60}ms`;
                tag.classList.add('tag-visible');
            });
            tagObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-tags').forEach(container => {
    container.querySelectorAll('.tag').forEach(tag => tag.classList.add('tag-hidden'));
    tagObserver.observe(container);
});

// Active nav highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    let currentId = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop) {
            currentId = section.getAttribute('id');
        }
    });
    navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${currentId}`) {
            a.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Hero CTA pulse on load (once)
const heroBtn = document.querySelector('.btn-primary');
if (heroBtn) {
    heroBtn.classList.add('pulse-once');
    heroBtn.addEventListener('animationend', () => heroBtn.classList.remove('pulse-once'));
}

// Animated stat counters
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const duration = 1500;
            const start = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// Particle background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2.5 + 1
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167,139,250,0.8)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(167,139,250,${0.4 * (1 - dist / 150)})`;
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();
