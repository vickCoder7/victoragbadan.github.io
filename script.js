/* =========================================================
   Victor Agbadan Portfolio — script.js
   ========================================================= */

/* ─── 1. PARTICLE CANVAS ─────────────────────────────── */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], mouse = { x: null, y: null };
    const N = 90, MAX_DIST = 130;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function makeParticle() {
        return {
            x: rand(0, W), y: rand(0, H),
            vx: rand(-0.35, 0.35), vy: rand(-0.35, 0.35),
            r: rand(1.5, 3.2),
            color: Math.random() > 0.5 ? '#7c3aed' : '#06b6d4',
        };
    }

    function init() {
        particles = [];
        for (let i = 0; i < N; i++) particles.push(makeParticle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124,58,237,${0.18 * (1 - dist / MAX_DIST)})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            // Mouse connections
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST * 1.5) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(6,182,212,${0.25 * (1 - dist / (MAX_DIST * 1.5))})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        // Draw dots
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    function update() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        });
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    resize(); init(); loop();
})();


/* ─── 2. TYPEWRITER ──────────────────────────────────── */
(function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;

    const phrases = [
        'ML Researcher',
        'Data Scientist',
        'Mathematician',
        'Deep Learning Engineer',
        'ICCR Scholar',
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
        const current = phrases[phraseIdx];
        if (!deleting) {
            el.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }
            setTimeout(type, 80);
        } else {
            el.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 45);
        }
    }
    setTimeout(type, 700);
})();


/* ─── 3. NAVBAR SCROLL EFFECT ────────────────────────── */
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
        });
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // Active link highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navAs = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
        });
        navAs.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
        });
    }, { passive: true });
})();


/* ─── 4. SCROLL REVEAL ───────────────────────────────── */
(function initScrollReveal() {
    const els = document.querySelectorAll('[data-aos]');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger for grid children
                const delay = entry.target.closest('.skills-grid, .research-grid, .projects-grid, .awards-grid')
                    ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
                    : 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
})();


/* ─── 5. COUNTER ANIMATION ───────────────────────────── */
(function initCounters() {
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    if (!statNums.length) return;

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1200;
        const step = 16;
        const increment = target / (duration / step);
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current);
        }, step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => observer.observe(el));
})();


/* ─── 6. EXPERIENCE TABS ─────────────────────────────── */
(function initTabs() {
    const tabs = document.querySelectorAll('.exp-tab');
    const panels = document.querySelectorAll('.exp-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById(`panel-${target}`);
            if (panel) panel.classList.add('active');
        });
    });
})();


/* ─── 7. CONTACT FORM ────────────────────────────────── */
(function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const btn = document.getElementById('form-submit-btn');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = form.querySelector('#cf-name').value.trim();
        const email = form.querySelector('#cf-email').value.trim();
        const message = form.querySelector('#cf-message').value.trim();

        if (!name || !email || !message) {
            status.textContent = '⚠ Please fill in all fields.';
            status.style.color = '#f87171';
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            status.textContent = '⚠ Please enter a valid email address.';
            status.style.color = '#f87171';
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span>Sending…</span> <i class="fas fa-spinner fa-spin"></i>';

        // Build a mailto link as fallback (no backend needed)
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoURL = `mailto:agbadanvictor@gmail.com?subject=${subject}&body=${body}`;

        setTimeout(() => {
            window.location.href = mailtoURL;
            status.textContent = '✅ Your email client should open. Thank you for reaching out!';
            status.style.color = '#4ade80';
            btn.disabled = false;
            btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
            form.reset();
        }, 800);
    });
})();


/* ─── 8. SMOOTH SCROLL OFFSET (for fixed nav) ────────── */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 76;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();
