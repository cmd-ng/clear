document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const uicoreHamButtons = document.querySelectorAll('.uicore-ham');
    const mobileMenuWrapper = document.querySelector('.uicore-navigation-wrapper');
    const mobileMenuLinks = document.querySelectorAll('.uicore-navigation-wrapper .uicore-menu li a');
    
    if (mobileMenuWrapper) {
        uicoreHamButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                mobileMenuWrapper.classList.toggle('active');
            });
        });

        // Close mobile menu when an anchor link is clicked
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuWrapper.classList.remove('active');
            });
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (mobileMenuWrapper && mobileMenuWrapper.classList.contains('active')) {
                    mobileMenuWrapper.classList.remove('active');
                }
                
                const offset = 80;
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

    // 4. Fade Up Animation on Scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
        observer.observe(element);
    });

    // 5. Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        countObserver.observe(counter);
    });

    // 6. Accordion Functionality for FAQs
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            
            // Close other open items
            document.querySelectorAll('.accordion-content').forEach(item => {
                if (item !== content) {
                    item.style.maxHeight = null;
                    item.previousElementSibling.classList.remove('active');
                }
            });

            // Toggle current item
            header.classList.toggle('active');
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // 7. Site Snappy Preloader Animation
    const preloader = document.getElementById('site-preloader');
    if (preloader) {
        let preloaderDismissed = false;

        const dismissPreloader = () => {
            if (preloaderDismissed) return;
            preloaderDismissed = true;

            preloader.style.opacity = '0';
            preloader.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600); // Match fast 0.6s cubic transition
        };

        // Safety Trigger: Dismiss preloader after a maximum of 1000ms (1 second) so slow iframes/images don't block layout reveal
        const safetyTimer = setTimeout(dismissPreloader, 1000);

        // Standard Fast Trigger: Dismiss preloader 400ms after window loads (if load finishes under 1 second)
        window.addEventListener('load', () => {
            clearTimeout(safetyTimer);
            setTimeout(dismissPreloader, 400);
        });
    }

    // 8. Clipboard Copying System for Contact Cards
    const infoCards = document.querySelectorAll('.contact-info-card');
    infoCards.forEach(card => {
        const copyVal = card.getAttribute('data-copy');
        const copyBtn = card.querySelector('.copy-card-btn');
        const tooltip = copyBtn.querySelector('.tooltip');
        const originalTooltipText = tooltip.textContent;
        
        const copyText = () => {
            navigator.clipboard.writeText(copyVal).then(() => {
                copyBtn.classList.add('copied');
                tooltip.textContent = 'Copied!';
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    tooltip.textContent = originalTooltipText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        };

        // Handle copying when clicking the copy button
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            copyText();
        });

        // Handle copying when clicking anywhere on the card (except active links/buttons)
        card.addEventListener('click', (e) => {
            if (e.target.closest('a') || e.target.closest('.copy-card-btn')) {
                // Let the browser handle standard anchor clicking (or let copyBtn handler do its job)
                return;
            }
            copyText();
        });
    });

    // 9. Interactive Form Validation & Success Overlay States
    const contactForm = document.getElementById('premium-contact-form');
    const successOverlay = document.getElementById('form-success-state');
    const successCloseBtn = document.getElementById('success-close-btn');

    if (contactForm && successOverlay) {
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const messageInput = document.getElementById('form-message');

        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        const showError = (input) => {
            const group = input.closest('.input-group');
            if (group) {
                group.classList.add('has-error');
            }
        };

        const clearError = (input) => {
            const group = input.closest('.input-group');
            if (group) {
                group.classList.remove('has-error');
            }
        };

        // Remove error states dynamically on input
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    clearError(input);
                });
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Validate Name
            if (nameInput && nameInput.value.trim() === '') {
                showError(nameInput);
                isValid = false;
            } else if (nameInput) {
                clearError(nameInput);
            }

            // Validate Email
            if (emailInput && (emailInput.value.trim() === '' || !validateEmail(emailInput.value.trim()))) {
                showError(emailInput);
                isValid = false;
            } else if (emailInput) {
                clearError(emailInput);
            }

            // Validate Subject
            if (subjectInput && subjectInput.value.trim() === '') {
                showError(subjectInput);
                isValid = false;
            } else if (subjectInput) {
                clearError(subjectInput);
            }

            // Validate Message
            if (messageInput && messageInput.value.trim() === '') {
                showError(messageInput);
                isValid = false;
            } else if (messageInput) {
                clearError(messageInput);
            }

            if (isValid) {
                // Show custom animated success overlay
                successOverlay.classList.add('active');
                
                // Reset form fields
                contactForm.reset();
            }
        });

        // Close Success Overlay and return to cleared form
        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', () => {
                successOverlay.classList.remove('active');
            });
        }
    }
});
