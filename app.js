const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMenuBtn = document.getElementById('close-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');

        if (mobileMenuBtn && mobileMenu) {
            const openMenu = () => {
                mobileMenu.classList.add('active');
                if (mobileOverlay) {
                    mobileOverlay.classList.add('active');
                    mobileOverlay.style.display = 'block';
                }
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            };
            const closeMenu = () => {
                mobileMenu.classList.remove('active');
                if (mobileOverlay) {
                    mobileOverlay.classList.remove('active');
                    setTimeout(() => {
                        mobileOverlay.style.display = 'none';
                    }, 320);
                }
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            };

            mobileMenuBtn.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) closeMenu(); else openMenu();
            });

            if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
            mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

            // Close menu with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeMenu();
            });

            // Close menu when clicking overlay
            if (mobileOverlay) {
                mobileOverlay.addEventListener('click', closeMenu);
            }
        }
        const stats = document.querySelectorAll('.stat-number');
        let statsAnimated = false;

        function animateStats() {
            stats.forEach(stat => {
                const target = parseInt(stat.dataset.target) || 0;
                const suffix = stat.dataset.suffix || '';
                const duration = 1600;
                const steps = Math.max(20, Math.floor(duration / 16));
                const increment = target / steps;
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target + suffix;
                    }
                };
                updateCounter();
            });
        }

        const statsSection = document.querySelector('.animated-gradient');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !statsAnimated) {
                        animateStats();
                        statsAnimated = true;
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(statsSection);
        }
        let currentSlide = 0;
        const slides = document.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;
        let autoSlideInterval = null;

        function showSlide(index) {
            if (!slides || slides.length === 0) return;
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }

        function nextSlide() {
            if (totalSlides === 0) return;
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            if (totalSlides === 0) return;
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        function startAutoSlide() {
            if (totalSlides === 0) return;
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }

        const nextBtn = document.getElementById('next-testimonial');
        const prevBtn = document.getElementById('prev-testimonial');
        const testimonialContainer = document.getElementById('testimonial-container');

        // Scroll detection for navbar hide/show on mobile
        (function () {
            const siteNav = document.querySelector('nav.site-nav');
            if (!siteNav) return;
            
            let lastY = window.pageYOffset || document.documentElement.scrollTop;
            let ticking = false;
            
            function handleScroll() {
                const currentY = window.pageYOffset || document.documentElement.scrollTop;
                const delta = lastY - currentY; // positive when scrolling up
                
                // Ignore small movements to prevent flickering
                if (Math.abs(delta) < 8) return;
                
                if (delta > 0 && currentY > 50) {
                    // User scrolled up
                    siteNav.classList.add('nav-visible');
                } else if (delta < 0) {
                    // User scrolled down
                    siteNav.classList.remove('nav-visible');
                }
                lastY = Math.max(0, currentY);
            }
            
            window.addEventListener('scroll', function () {
                if (!ticking) {
                    window.requestAnimationFrame(function () {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        })();

        if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
        if (testimonialContainer) {
            testimonialContainer.addEventListener('mouseenter', stopAutoSlide);
            testimonialContainer.addEventListener('mouseleave', startAutoSlide);
        }

        startAutoSlide();
        const accordionBtns = document.querySelectorAll('.accordion-btn');

        accordionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('span:last-child');
                accordionBtns.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        otherBtn.nextElementSibling.classList.remove('active');
                        const otherIcon = otherBtn.querySelector('span:last-child');
                        if (otherIcon) otherIcon.textContent = '+';
                    }
                });

                if (content) content.classList.toggle('active');
                if (icon) icon.textContent = content.classList.contains('active') ? '−' : '+';
            });
        });

        const destinationCards = document.querySelectorAll('.destination-card');
        const modal = document.getElementById('destination-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        const closeModal = document.getElementById('close-modal');

        const destinationData = {
            'Canada': {
                title: '🇨🇦 Canada',
                content: `
                    <p class="mb-4">Canada offers world-class education with excellent post-study work opportunities and pathways to permanent residency.</p>
                    <h4 class="font-bold mb-2 text-lg">Popular Programs:</h4>
                    <ul class="list-disc list-inside mb-4 text-gray-600">
                        <li>Engineering & Technology</li>
                        <li>Business Management</li>
                        <li>Computer Science</li>
                        <li>Healthcare</li>
                    </ul>
                    <h4 class="font-bold mb-2 text-lg">Average Tuition Fees:</h4>
                    <p class="mb-4 text-[#FF6B35] font-bold">CAD 15,000 - 60,000 per year</p>
                    <h4 class="font-bold mb-2 text-lg">Eligibility:</h4>
                    <p class="mb-4">IELTS 6.5+ | High academic scores | Valid study permit</p>
                    <h4 class="font-bold mb-2 text-lg">Post-Study Work Permit:</h4>
                    <p class="mb-4">Up to 3 years depending on program length</p>
                    <h4 class="font-bold mb-2 text-lg">Why Canada?</h4>
                    <p>Safe, multicultural environment with clear PR pathways and high quality of life.</p>
                `
            },
            'UK': {
                title: '🇬🇧 United Kingdom',
                content: `
                    <p class="mb-4">The UK boasts prestigious universities with rich history and cutting-edge research facilities.</p>
                    <h4 class="font-bold mb-2 text-lg">Popular Programs:</h4>
                    <ul class="list-disc list-inside mb-4 text-gray-600">
                        <li>Business & Finance</li>
                        <li>Law</li>
                        <li>Engineering</li>
                        <li>Medicine</li>
                    </ul>
                    <h4 class="font-bold mb-2 text-lg">Average Tuition Fees:</h4>
                    <p class="mb-4 text-[#FF6B35] font-bold">£10,000 - 30,000 per year</p>
                    <h4 class="font-bold mb-2 text-lg">Eligibility:</h4>
                    <p class="mb-4">IELTS 6.0+ | Strong academic record | Student visa</p>
                    <h4 class="font-bold mb-2 text-lg">Graduate Route:</h4>
                    <p class="mb-4">2 years post-study work visa (3 years for PhD)</p>
                    <h4 class="font-bold mb-2 text-lg">Why UK?</h4>
                    <p>World-renowned universities, shorter course duration, and rich cultural experience.</p>
                `
            },
            'USA': {
                title: '🇺🇸 United States',
                content: `
                    <p class="mb-4">Home to world's top universities and excellent research opportunities with diverse programs.</p>
                    <h4 class="font-bold mb-2 text-lg">Popular Programs:</h4>
                    <ul class="list-disc list-inside mb-4 text-gray-600">
                        <li>Computer Science & IT</li>
                        <li>Engineering</li>
                        <li>Business Administration</li>
                        <li>Data Science</li>
                    </ul>
                    <h4 class="font-bold mb-2 text-lg">Average Tuition Fees:</h4>
                    <p class="mb-4 text-[#FF6B35] font-bold">$25,000 - 55,000 per year</p>
                    <h4 class="font-bold mb-2 text-lg">Eligibility:</h4>
                    <p class="mb-4">IELTS/TOEFL | SAT/GRE/GMAT | F-1 student visa</p>
                    <h4 class="font-bold mb-2 text-lg">OPT:</h4>
                    <p class="mb-4">12 months (36 months for STEM programs)</p>
                    <h4 class="font-bold mb-2 text-lg">Why USA?</h4>
                    <p>Best universities globally, diverse campus life, and excellent career opportunities.</p>
                `
            },
            'Australia': {
                title: '🇦🇺 Australia',
                content: `
                    <p class="mb-4">Australia offers high-quality education with work opportunities and a multicultural environment.</p>
                    <h4 class="font-bold mb-2 text-lg">Popular Programs:</h4>
                    <ul class="list-disc list-inside mb-4 text-gray-600">
                        <li>Engineering</li>
                        <li>Healthcare & Nursing</li>
                        <li>IT & Computing</li>
                        <li>Business</li>
                    </ul>
                    <h4 class="font-bold mb-2 text-lg">Average Tuition Fees:</h4>
                    <p class="mb-4 text-[#FF6B35] font-bold">AUD 20,000 - 45,000 per year</p>
                    <h4 class="font-bold mb-2 text-lg">Eligibility:</h4>
                    <p class="mb-4">IELTS 6.5+ | Good academic record | Student visa (subclass 500)</p>
                    <h4 class="font-bold mb-2 text-lg">Work Rights:</h4>
                    <p class="mb-4">20 hours/week during study, full-time during breaks</p>
                    <h4 class="font-bold mb-2 text-lg">Why Australia?</h4>
                    <p>Beautiful lifestyle, excellent education system, and strong PR opportunities.</p>
                `
            },
            'Europe': {
                title: '🇪🇺 Europe',
                content: `
                    <p class="mb-4">Europe offers diverse study options with many affordable and even free education opportunities.</p>
                    <h4 class="font-bold mb-2 text-lg">Popular Destinations:</h4>
                    <ul class="list-disc list-inside mb-4 text-gray-600">
                        <li>Germany (Free/Low tuition)</li>
                        <li>France</li>
                        <li>Netherlands</li>
                        <li>Ireland</li>
                    </ul>
                    <h4 class="font-bold mb-2 text-lg">Average Tuition Fees:</h4>
                    <p class="mb-4 text-[#FF6B35] font-bold">€0 - 20,000 per year (varies by country)</p>
                    <h4 class="font-bold mb-2 text-lg">Eligibility:</h4>
                    <p class="mb-4">IELTS 6.0+ or TOEFL | Country-specific visa requirements</p>
                    <h4 class="font-bold mb-2 text-lg">Benefits:</h4>
                    <p class="mb-4">Travel within Schengen zone, diverse cultures, quality education</p>
                    <h4 class="font-bold mb-2 text-lg">Why Europe?</h4>
                    <p>Affordable education, rich culture, and opportunity to travel across Europe.</p>
                `
            },
            'Russia': {
                title: '🇷🇺 Russia',
                content: `
                    <p class="mb-4">Russia is popular for MBBS with NMC-approved universities and affordable fees.</p>
                    <h4 class="font-bold mb-2 text-lg">Popular Programs:</h4>
                    <ul class="list-disc list-inside mb-4 text-gray-600">
                        <li>MBBS (Most Popular)</li>
                        <li>Engineering</li>
                        <li>Aviation</li>
                        <li>Management</li>
                    </ul>
                    <h4 class="font-bold mb-2 text-lg">Average Tuition Fees:</h4>
                    <p class="mb-4 text-[#FF6B35] font-bold">$4,000 - 6,000 per year</p>
                    <h4 class="font-bold mb-2 text-lg">Eligibility:</h4>
                    <p class="mb-4">NEET qualified (for MBBS) | 50% in PCB | Student visa</p>
                    <h4 class="font-bold mb-2 text-lg">Duration:</h4>
                    <p class="mb-4">MBBS: 6 years (including internship)</p>
                    <h4 class="font-bold mb-2 text-lg">Why Russia?</h4>
                    <p>Extremely affordable, NMC-approved universities, and quality medical education.</p>
                `
            },
            'Kyrgyzstan': {
                title: '🇰🇬 Kyrgyzstan',
                content: `
                    <p class="mb-4">Kyrgyzstan offers one of the most affordable MBBS options with NMC-approved universities.</p>
                    <h4 class="font-bold mb-2 text-lg">Top Universities:</h4>
                    <ul class="list-disc list-inside mb-4 text-gray-600">
                        <li>Asian Medical Institute</li>
                        <li>Osh State University</li>
                        <li>International School of Medicine</li>
                    </ul>
                    <h4 class="font-bold mb-2 text-lg">Average Tuition Fees:</h4>
                    <p class="mb-4 text-[#FF6B35] font-bold">$3,500 - 5,000 per year</p>
                    <h4 class="font-bold mb-2 text-lg">Eligibility:</h4>
                    <p class="mb-4">NEET qualified | 50% in PCB | No entrance exam</p>
                    <h4 class="font-bold mb-2 text-lg">Living Cost:</h4>
                    <p class="mb-4">$150 - 250 per month (very affordable)</p>
                    <h4 class="font-bold mb-2 text-lg">Why Kyrgyzstan?</h4>
                    <p>Most affordable MBBS option, safe environment, and easy adaptation for Indians.</p>
                `
            },
            'Philippines': {
                title: '🇵🇭 Philippines',
                content: `
                    <p class="mb-4">The Philippines offers English-medium MBBS education with NMC recognition and lower costs.</p>
                    <h4 class="font-bold mb-2 text-lg">Top Universities:</h4>
                    <ul class="list-disc list-inside mb-4 text-gray-600">
                        <li>Davao Medical School</li>
                        <li>UV Gullas College of Medicine</li>
                        <li>Southwestern University</li>
                    </ul>
                    <h4 class="font-bold mb-2 text-lg">Average Tuition Fees:</h4>
                    <p class="mb-4 text-[#FF6B35] font-bold">$3,000 - 4,500 per year</p>
                    <h4 class="font-bold mb-2 text-lg">Eligibility:</h4>
                    <p class="mb-4">NEET qualified | 50% in PCB | English proficiency</p>
                    <h4 class="font-bold mb-2 text-lg">Advantages:</h4>
                    <p class="mb-4">English medium, similar climate, easier adaptation for Indians</p>
                    <h4 class="font-bold mb-2 text-lg">Why Philippines?</h4>
                    <p>English-speaking country, tropical climate, and friendly culture similar to India.</p>
                `
            }
        };

        destinationCards.forEach(card => {
            card.addEventListener('click', () => {
                const country = card.dataset.country;
                const data = destinationData[country];
                if (!data) return;
                modalTitle.textContent = data.title;
                modalContent.innerHTML = data.content;
                if (modal) {
                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden', 'false');
                    // focus close button for accessibility
                    if (closeModal) closeModal.focus();
                }
            });
        });

        if (closeModal) closeModal.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
        });

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
        });

        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollTopBtn.style.opacity = '1';
                    scrollTopBtn.style.pointerEvents = 'auto';
                } else {
                    scrollTopBtn.style.opacity = '0';
                    scrollTopBtn.style.pointerEvents = 'none';
                }
            });

            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        const progressBars = document.querySelectorAll('.progress-bar');
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.35 });

        progressBars.forEach(bar => progressObserver.observe(bar));
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // allow external anchors and those without hashes
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.hover-lift');
            const windowHeight = window.innerHeight;

            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                if (elementTop < windowHeight - 50) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Initialize hover-lift elements with initial state
        document.querySelectorAll('.hover-lift').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Run once on load

        console.log('🌍 Admissia Website Loaded Successfully! ✨');
        console.log('Made with ❤️ for aspiring students');

        // Initialize EmailJS if available
        if (window.emailjs && typeof emailjs.init === 'function') {
            try {
                emailjs.init("mPMEFo4rm6yoWkcRG");
            } catch (err) {
                console.warn('EmailJS init failed', err);
            }
        }

        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const payload = {
                    user_name: document.getElementById('contact-name') ? document.getElementById('contact-name').value : '',
                    user_email: document.getElementById('contact-email') ? document.getElementById('contact-email').value : '',
                    user_phone: document.getElementById('contact-phone') ? document.getElementById('contact-phone').value : '',
                    service: document.getElementById('contact-service') ? document.getElementById('contact-service').value : '',
                    message: document.getElementById('contact-message') ? document.getElementById('contact-message').value : ''
                };

                if (window.emailjs && typeof emailjs.send === 'function') {
                    emailjs.send('service_9kldo6k', 'template_we50p04', payload)
                        .then(function (response) {
                            // visually nicer notification
                            if (window.admissiaNotify) window.admissiaNotify('Message sent successfully ✅', 'success', 4500);
                            contactForm.reset();
                        })
                        .catch(function (error) {
                            console.error('EmailJS send error:', error);
                            if (window.admissiaNotify) window.admissiaNotify('Error sending message ❌', 'error', 4500);
                        });
                } else {
                    console.warn('EmailJS not available — logging form payload instead');
                    console.log('Contact form payload:', payload);
                    if (window.admissiaNotify) window.admissiaNotify('Message captured (dev mode).', 'info', 3500);
                    contactForm.reset();
                }
            });
        }

        // Injected: lightweight toast/notify system (no external deps)
        (function () {
            function injectNotifyStyles() {
                if (document.getElementById('notify-styles')) return;
                const css = `
                    .notify-container{position:fixed;bottom:1rem;right:1rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;pointer-events:none;align-items:flex-end}
                    .notify{pointer-events:auto;min-width:260px;padding:12px 14px;border-radius:10px;color:#fff;font-weight:600;box-shadow:0 6px 18px rgba(0,0,0,0.12);opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s;font-family:system-ui,Segoe UI,Roboto,Arial}
                    .notify.show{opacity:1;transform:translateY(0)}
                    .notify.success{background:linear-gradient(90deg,#16a34a,#059669)}
                    .notify.error{background:linear-gradient(90deg,#dc2626,#b91c1c)}
                    .notify.info{background:linear-gradient(90deg,#2563eb,#1e40af)}
                    .notify .notify-close{background:transparent;border:none;color:inherit;font-weight:800;font-size:18px;margin-left:10px;cursor:pointer}
                    .notify .notify-row{display:flex;align-items:center;justify-content:space-between;gap:8px}
                `;
                const s = document.createElement('style');
                s.id = 'notify-styles';
                s.appendChild(document.createTextNode(css));
                document.head.appendChild(s);
            }

            function notify(message, type = 'info', duration = 4000) {
                injectNotifyStyles();
                let container = document.querySelector('.notify-container');
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'notify-container';
                    document.body.appendChild(container);
                }

                const note = document.createElement('div');
                note.className = `notify ${type}`;
                note.innerHTML = `<div class="notify-row"><span>${message}</span><button class="notify-close" aria-label="Close notification">&times;</button></div>`;
                container.appendChild(note);

                // show
                requestAnimationFrame(() => note.classList.add('show'));

                const timer = setTimeout(dismiss, duration);

                function dismiss() {
                    note.classList.remove('show');
                    setTimeout(() => note.remove(), 240);
                    clearTimeout(timer);
                }

                note.querySelector('.notify-close').addEventListener('click', dismiss);
                return { dismiss };
            }

            // Expose to file scope where needed
            window.admissiaNotify = notify;
        })();
