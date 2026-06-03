/**
 * CLEARSITE HOLDINGS - MAIN INTERACTIVES & TELEMETRY MODULES
 * Engineered with high-performance vanilla Javascript, zero dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
     * 0. SCROLL PROGRESS INDICATOR BAR
     * =========================================================================
     */
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${pct}%`;
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    /* =========================================================================
     * 1. PRELOADER DISMISS CONTROLLER
     * =========================================================================
     */
    const preloader = document.getElementById('site-preloader');
    
    if (preloader) {
        let dismissed = false;

        const dismiss = () => {
            if (dismissed) return;
            dismissed = true;
            
            preloader.style.opacity = '0';
            preloader.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        };

        // Safety trigger: dismiss after a maximum of 1.5s
        const safetyTimer = setTimeout(dismiss, 1500);

        // Standard load trigger
        window.addEventListener('load', () => {
            clearTimeout(safetyTimer);
            setTimeout(dismiss, 600);
        });
    }

    /* =========================================================================
     * 2. HIGH-PERFORMANCE BACKGROUND IMAGE PARALLAX ENGINE
     * Runs scroll translates inside hardware-accelerated requestAnimationFrame loops
     * =========================================================================
     */
    const heroBg = document.getElementById('hero-parallax-bg');
    const leaderBg = document.getElementById('leadership-parallax-bg');
    
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateParallax = () => {
        if (heroBg) {
            heroBg.style.transform = `translateY(${lastScrollY * 0.3}px)`;
        }
        if (leaderBg) {
            const rect = leaderBg.parentElement.getBoundingClientRect();
            const visibleOffset = window.innerHeight - rect.top;
            if (visibleOffset > 0) {
                // Parallax translation offset inside viewport
                leaderBg.style.transform = `translateY(${-rect.top * 0.25}px)`;
            }
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Initial trigger to position backgrounds correctly
    updateParallax();

    /* =========================================================================
     * 3. HEADER SCROLL & STICK TRANSITIONS
     * =========================================================================
     */
    const header = document.querySelector('.header-navbar');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Trigger immediately to check active state
    }

    /* =========================================================================
     * 4. MOBILE HAMBURGER TOGGLE & DRAWER NAVIGATION Menu
     * =========================================================================
     */
    const mobileBtn = document.querySelector('.mobile-ham-btn');
    const drawerOverlay = document.querySelector('.mobile-menu-overlay');
    const drawerLinks = document.querySelectorAll('.mobile-menu-list a');

    if (mobileBtn && drawerOverlay) {
        const toggleDrawer = () => {
            const isActive = drawerOverlay.classList.toggle('active');
            header.classList.toggle('active-drawer', isActive);
            // Toggle body scrolling block to lock scrolling when drawer is active
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        mobileBtn.addEventListener('click', toggleDrawer);

        // Close drawer overlay when list navigation links are clicked
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                drawerOverlay.classList.remove('active');
                header.classList.remove('active-drawer');
                document.body.style.overflow = '';
            });
        });
    }

    /* =========================================================================
     * 5. TELEMETRY STATS COUNTER ODOMETER ANIMATION
     * Animates both Hero stats and Track Record stats dynamically
     * =========================================================================
     */
    const statNumbers = document.querySelectorAll('.value');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numberEl = entry.target;
                    const targetVal = parseFloat(numberEl.getAttribute('data-target'));
                    let currentVal = 0;
                    
                    const animationFrames = 80; // Easing speed
                    const increment = targetVal / animationFrames;
                    
                    const countAnimation = () => {
                        currentVal += increment;
                        if (currentVal < targetVal) {
                            // Check if value is decimal (e.g. 4.2 Capital raised)
                            if (targetVal % 1 !== 0) {
                                numberEl.innerText = currentVal.toFixed(1);
                            } else {
                                numberEl.innerText = Math.ceil(currentVal);
                            }
                            requestAnimationFrame(countAnimation);
                        } else {
                            numberEl.innerText = targetVal;
                        }
                    };

                    countAnimation();
                    observer.unobserve(numberEl); // Animate only once
                }
            });
        }, { threshold: 0.75 });

        statNumbers.forEach(num => {
            counterObserver.observe(num);
        });
    }

    /* =========================================================================
     * 6. CAGR GAUGE RADIAL FILL ANIMATION
     * =========================================================================
     */
    const cagrFill = document.getElementById('cagr-gauge-radial-fill');
    if (cagrFill) {
        const cagrObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // target cagr = 34%. circumference = 251.2px
                    // 34% fill = 85.4px stroke length. offset target = 251.2 - 85.4 = 165.8px
                    cagrFill.style.strokeDashoffset = '165.8';
                    observer.unobserve(cagrFill);
                }
            });
        }, { threshold: 0.5 });
        cagrObserver.observe(cagrFill);
    }

    /* =========================================================================
     * 7. CLIPBOARD DIRECT COPY ACTIONS FOR DETAILS CARDS
     * =========================================================================
     */
    const copyCards = document.querySelectorAll('.coord-card');
    copyCards.forEach(card => {
        const copyVal = card.getAttribute('data-copy');
        const copyBtn = card.querySelector('.coord-copy-btn');
        const tooltip = copyBtn ? copyBtn.querySelector('.coord-tooltip') : null;
        
        if (copyBtn && tooltip) {
            const originalTooltip = tooltip.textContent;

            const copyText = (e) => {
                e.stopPropagation(); // Avoid triggering any secondary link behaviors
                navigator.clipboard.writeText(copyVal).then(() => {
                    copyBtn.classList.add('copied');
                    tooltip.textContent = 'TRANSMITTED!';
                    
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        tooltip.textContent = originalTooltip;
                    }, 1800);
                }).catch(() => {
                    tooltip.textContent = 'FAILED TO COPY';
                });
            };

            copyBtn.addEventListener('click', copyText);
            card.addEventListener('click', copyText);
        }
    });

    /* =========================================================================
     * 8. SECURE CONTACT FORM VALIDATION & TRANSMISSION OVERLAY
     * =========================================================================
     */
    const contactForm = document.getElementById('command-contact-form');
    const formOverlay = document.getElementById('form-success-overlay');
    const dismissBtn = document.getElementById('success-dismiss-btn');

    if (contactForm && formOverlay) {
        
        // Input validator helpers
        const validateInput = (input) => {
            const parent = input.closest('.technical-input-group');
            if (!parent) return true;

            let isValid = true;
            if (input.required && !input.value.trim()) {
                isValid = false;
            } else if (input.type === 'email' && input.value.trim()) {
                // Precise email standard regex
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(input.value.trim());
            }

            if (!isValid) {
                parent.classList.add('invalid-field');
            } else {
                parent.classList.remove('invalid-field');
            }

            return isValid;
        };

        // Validate on blur interaction
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            input.addEventListener('input', () => {
                const parent = input.closest('.technical-input-group');
                if (parent && parent.classList.contains('invalid-field')) {
                    validateInput(input); // Clear errors dynamically on input change
                }
            });
        });

        // Submit listener
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formValid = true;

            inputs.forEach(input => {
                const isFieldValid = validateInput(input);
                if (!isFieldValid) formValid = false;
            });

            if (formValid) {
                // Show secure slide-in overlay
                formOverlay.classList.add('active');
                contactForm.reset();
            }
        });

        // Dismiss secure console screen
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                formOverlay.classList.remove('active');
            });
        }
    }

    /* =========================================================================
     * 9. ADVANCED INTERACTIVE MODULE: 3D CARD PARALLAX TILT
     * Eases absolute 3D perspective rotation on glass cards during mouse hovers
     * =========================================================================
     */
    const tiltCards = document.querySelectorAll('.glass-card, .subsidiary-tile-card, .visual-editorial-frame');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cardWidth = rect.width;
            const cardHeight = rect.height;

            // 1. Calculate and update mouse cursor coordinates relative to card bounds (for glowing border gradients)
            const cursorXpx = e.clientX - rect.left;
            const cursorYpx = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${cursorXpx}px`);
            card.style.setProperty('--mouse-y', `${cursorYpx}px`);

            // 2. Calculate cursor offset from card center (-width/2 to width/2)
            const offsetX = e.clientX - rect.left - (cardWidth / 2);
            const offsetY = e.clientY - rect.top - (cardHeight / 2);

            // Normalize offsets to range -1 to 1, multiply by maximum tilt intensity (6deg)
            const rotateY = (offsetX / (cardWidth / 2)) * 6;
            const rotateX = -(offsetY / (cardHeight / 2)) * 6;

            // Apply smooth 3D rotations in local space coordinates
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reset smooth tilt upon mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });

    /* =========================================================================
     * 10. SMOOTH SECTION ANCHOR SCROLL ADJUSTMENTS
     * =========================================================================
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                
                const offset = 80; // Offset for sticky navbar header height
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =========================================================================
     * 11. DYNAMIC INTERSECTION VIEWPORT REVEALER
     * Animates staggered elements cleanly onto the screen on viewport entry
     * =========================================================================
     */
    const revealElements = document.querySelectorAll('.reveal-up');
    if (revealElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    /* =========================================================================
     * 12. LEGAL MODAL CONTROLLER (PRIVACY & TERMS AND CONDITIONS)
     * =========================================================================
     */
    const privacyTrigger = document.getElementById('privacy-trigger');
    const termsTrigger = document.getElementById('terms-trigger');
    const legalModal = document.getElementById('legal-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');

    const legalContent = {
        privacy: `
            <h2>Privacy <span>Protocol</span></h2>
            <p><strong>Last Updated: June 2, 2026</strong></p>
            <p>Clearsite Holdings (Pty) Ltd ("Clearsite", "we", "us", "our") is committed to protecting your privacy and ensuring that your personal information is processed safely, responsibly, and in strict compliance with the <strong>Protection of Personal Information Act, No. 4 of 2013 ("POPIA")</strong> of South Africa.</p>
            
            <h3>1. Personal Information We Collect</h3>
            <p>Through our digital Inquiry Terminal and corporate touchpoints, we may collect:</p>
            <ul>
                <li><strong>Identity Information:</strong> Full name and corporate title.</li>
                <li><strong>Contact Information:</strong> Professional email address, phone number, and organization.</li>
                <li><strong>Inquiry Details:</strong> Subject matters, transaction parameters, or investment inquiries.</li>
                <li><strong>Telemetry Data:</strong> IP address, device specs, browser details, and navigation metrics.</li>
            </ul>

            <h3>2. Purpose of Data Processing</h3>
            <p>We process your personal information strictly for the following operational nodes:</p>
            <ul>
                <li>Evaluating prospective investment, private equity, and joint-venture opportunities.</li>
                <li>Responding to inquiries submitted via the secure connection command deck.</li>
                <li>Distributing critical corporate advisories, shareholder reports, or regulatory updates.</li>
                <li>Maintaining cybersecurity logs, database integrity, and system performance telemetry.</li>
            </ul>

            <h3>3. Information Sharing & Third Parties</h3>
            <p>Clearsite does not sell, trade, or lease your personal information. Data may be shared internally with our registered strategic subsidiaries (Gear Rail, Elematic SA, Intellehub) if your inquiry directly relates to their concrete engineering, transit system, or ICT business nodes. We ensure all subsidiaries maintain equivalent POPIA compliance standards.</p>

            <h3>4. Security Measures</h3>
            <p>We implement robust, state-of-the-art administrative, physical, and technological security controls to safeguard your data against unauthorized access, loss, or destruction. This includes end-to-end secure database hosting, encrypted email protocols, and real-time firewall monitoring.</p>

            <h3>5. Your Rights Under POPIA</h3>
            <p>You hold complete authority over your data. You have the right to request access to the personal information we store, request corrections to inaccurate records, or request complete deletion of your records from our servers. To execute these rights, please contact our Information Officer at <a href="mailto:info@clearsiteholdings.co.za" style="color: var(--brand-lime); text-decoration: underline;">info@clearsiteholdings.co.za</a>.</p>
        `,
        terms: `
            <h2>Terms & <span>Conditions</span></h2>
            <p><strong>Effective Date: June 2, 2026</strong></p>
            <p>Welcome to the official corporate portal of Clearsite Holdings (Pty) Ltd ("Clearsite", "we", "us"). By accessing or utilizing this website, you agree to comply with and be bound by the following Terms and Conditions.</p>

            <h3>1. Non-Reliance & Disclaimer</h3>
            <p>The information contained on this website is for general informational and corporate showcase purposes only. <strong>Nothing on this site constitutes financial, legal, investment, or professional advisory services.</strong></p>
            <p>All prospective private equity, institutional co-investments, or venture acquisitions discussed are subject to strict private diligence and are only finalized via executed written private placement memorandums or formal bilateral contracts.</p>

            <h3>2. Intellectual Property Rights</h3>
            <p>All visual designs, custom cursor-tracking shaders, 3D tilt mathematical engines, SVG logistics telemetry charts, black and white editorial photographs, logos, and written content are the exclusive intellectual property of Clearsite Holdings or licensed partners. Unauthorized duplication, modification, or hotlinking is strictly prohibited.</p>

            <h3>3. Strategic Subsidiary Showcase</h3>
            <p>This portal features styled browser mockups loading live previews of our independent subsidiary entities (Gear Rail, Elematic SA, and Intellehub). Users acknowledge that entering or interacting with these portals is subject to those specific subsidiaries' external terms, and Clearsite holds no liability for their direct operations, server uptimes, or content accuracies.</p>

            <h3>4. Limitation of Liability</h3>
            <p>In no event shall Clearsite Holdings or its directors be liable for any direct, indirect, incidental, or consequential damages arising from your access to, or inability to access, this portal, including but not limited to server downtimes, software glitches, or temporary iframe errors.</p>

            <h3>5. Jurisdiction & Governing Law</h3>
            <p>These terms shall be governed by, construed, and enforced in accordance with the laws of the Republic of South Africa. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the High Court of South Africa (Gauteng Local Division, Johannesburg).</p>

            <h3>6. Corporate Information</h3>
            <p><strong>Physical Address for Legal Notices:</strong><br>
            2 Alyth Road, Unit 16, Forest Town, Westcliff, Johannesburg, 2196, South Africa.</p>
        `
    };

    if (legalModal && modalBody && modalClose) {
        const openModal = (type) => {
            modalBody.innerHTML = legalContent[type];
            legalModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        };

        const closeModal = () => {
            legalModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore background scrolling
            setTimeout(() => {
                modalBody.innerHTML = '';
            }, 400);
        };

        if (privacyTrigger) {
            privacyTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('privacy');
            });
        }

        if (termsTrigger) {
            termsTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('terms');
            });
        }

        modalClose.addEventListener('click', closeModal);

        // Close on clicking the backdrop overlay directly
        legalModal.addEventListener('click', (e) => {
            if (e.target === legalModal) {
                closeModal();
            }
        });

        // Close on hitting Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && legalModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});
