document.addEventListener('DOMContentLoaded', () => {
    // Current year assignment
    const yearElem = document.getElementById('year');
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.className = 'fa-solid fa-bars text-xl';
            } else {
                menuIcon.className = 'fa-solid fa-xmark text-xl';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.className = 'fa-solid fa-bars text-xl';
            });
        });
    }

    // Dynamic Typing Effect
    const phrases = [
        'Full-Stack Developer',
        'Tech Enthusiast',
        'UI/UX Craftsperson',
        'Gamer & Problem Solver'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextElem = document.getElementById('typed-text');

    function typeEffect() {
        if (!typedTextElem) return;
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedTextElem.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElem.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
    initParticles();

    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-electric-600', 'text-white', 'border-electric-500');
                b.classList.add('bg-darkcard', 'text-gray-400', 'border-darkborder');
            });

            btn.classList.add('bg-electric-600', 'text-white', 'border-electric-500');
            btn.classList.remove('bg-darkcard', 'text-gray-400', 'border-darkborder');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Contact Form Handler — EmailJS
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        // Replace this with the Public Key from your EmailJS account.
        emailjs.init({ publicKey: 'XfEkSJ_W-bUfLmbWo' });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const buttonText = submitButton?.querySelector('span');
            const originalText = buttonText?.textContent || 'Send Message';

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) return;

            if (submitButton) submitButton.disabled = true;
            if (buttonText) buttonText.textContent = 'Sending...';
            formFeedback.classList.add('hidden');
            formFeedback.classList.remove('text-red-300', 'bg-red-500/20', 'border-red-500/40');
            formFeedback.classList.add('text-electric-300', 'bg-electric-500/20', 'border-electric-500/40');

            try {
                await emailjs.send(
                    'service_u6d54pg',
                    'template_ef89t5q',
                    { name, email, subject, message }
                );

                formFeedback.innerHTML = '<i class="fa-solid fa-circle-check mr-2"></i>Message sent successfully! Thanks for reaching out.';
                formFeedback.classList.remove('hidden');
                contactForm.reset();

                setTimeout(() => formFeedback.classList.add('hidden'), 5000);
            } catch (error) {
                console.error('Email sending failed:', error);
                formFeedback.textContent = 'Sorry, your message could not be sent. Please try again.';
                formFeedback.classList.remove('hidden', 'text-electric-300', 'bg-electric-500/20', 'border-electric-500/40');
                formFeedback.classList.add('text-red-300', 'bg-red-500/20', 'border-red-500/40');
            } finally {
                if (submitButton) submitButton.disabled = false;
                if (buttonText) buttonText.textContent = originalText;
            }
        });
    }

    // Particle Canvas Animation
    function initParticles() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 20), 60);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                for (let j = index + 1; j < particles.length; j++) {
                    const dx = particle.x - particles[j].x;
                    const dy = particle.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 - distance / 1200})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        animate();
    }
});
