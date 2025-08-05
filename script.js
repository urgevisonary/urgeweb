// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Supabase configuration
const SUPABASE_URL = 'https://uxpfinmjbqwsbffrahhy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4cGZpbm1qYnF3c2JmZnJhaGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzODI5NjIsImV4cCI6MjA2OTk1ODk2Mn0.uZU5JfEoo15YqGBdBg2kA221kqNDiD67eyPeBMsIf1k';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Contact Form Handling with Supabase
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Insert data into Supabase
        const { data, error } = await supabase
            .from('contacts')
            .insert([
                {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                }
            ]);
        
        if (error) {
            throw error;
        }
        
        // Success
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#000' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// GSAP Reveal Animations for Elements
function initRevealAnimations() {
    // About section elements
    gsap.fromTo('.about-text',
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about-text',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Service cards with stagger
    gsap.fromTo('.service-card',
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Team members with stagger
    gsap.fromTo('.team-member',
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.team-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Contact section elements
    gsap.fromTo('.contact-item',
        { opacity: 0, x: -30 },
        {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('.contact-form',
        { opacity: 0, x: 30 },
        {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Stats animation
    gsap.fromTo('.stats',
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.stats',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

// GSAP Counter animation for stats
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat h4');

    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/\D/g, ''));
        const suffix = stat.textContent.replace(/\d/g, '');

        gsap.fromTo(stat,
            { textContent: 0 },
            {
                textContent: target,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                onUpdate: function() {
                    stat.textContent = Math.ceil(this.targets()[0].textContent) + suffix;
                },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #000;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

scrollTopBtn.addEventListener('click', scrollToTop);
document.body.appendChild(scrollTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

// Add hover effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
});

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// GSAP ScrollTrigger Registration
gsap.registerPlugin(ScrollTrigger);

// Process Section Animation
function initProcessAnimation() {
    const processSteps = document.querySelectorAll('.process-step');
    const trackProgress = document.querySelector('.track-progress');
    const processSection = document.querySelector('.process-timeline');

    if (!processSteps.length || !trackProgress || !processSection) return;

    // Set initial states
    gsap.set(trackProgress, { height: '0%' });
    gsap.set(processSteps, { opacity: 0.3 });

    processSteps.forEach(step => {
        const circle = step.querySelector('.step-circle');
        const number = step.querySelector('.step-number');
        gsap.set(circle, { backgroundColor: '#e5e5e5', scale: 1 });
        gsap.set(number, { color: '#666' });
        step.classList.remove('active');
    });

    // Main scroll trigger for progress tracking
    ScrollTrigger.create({
        trigger: processSection,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;

            // Update track progress height directly without animation
            trackProgress.style.height = `${progress * 100}%`;

            // Calculate which steps should be active
            const totalSteps = processSteps.length;
            const stepProgress = progress * totalSteps;

            processSteps.forEach((step, index) => {
                const circle = step.querySelector('.step-circle');
                const number = step.querySelector('.step-number');

                if (index < stepProgress) {
                    // Fully active step
                    step.classList.add('active');
                    step.style.opacity = '1';
                    circle.style.backgroundColor = '#000';
                    circle.style.transform = 'scale(1.1)';
                    number.style.color = '#fff';
                } else {
                    // Inactive step
                    step.classList.remove('active');
                    step.style.opacity = '0.3';
                    circle.style.backgroundColor = '#e5e5e5';
                    circle.style.transform = 'scale(1)';
                    number.style.color = '#666';
                }
            });
        }
    });

    // Individual step entrance animations
    processSteps.forEach((step) => {
        gsap.fromTo(step,
            {
                opacity: 0
            },
            {
                x: 0,
                opacity: 0.3,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: step,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

// Enhanced scroll animations for other sections
function initScrollAnimations() {
    // Hero section animation - simple fade in
    gsap.fromTo('.hero-title',
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.2
        }
    );

    gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 15 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.4
        }
    );

    gsap.fromTo('.hero-buttons',
        { opacity: 0, y: 15 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.6
        }
    );

    // Section headers animation
    gsap.fromTo('.section-header',
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.section-header',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

// Parallax effect for hero section - disabled to fix layout
function initParallaxEffect() {
    // Parallax disabled to prevent layout issues
    // gsap.to('.hero', {
    //     yPercent: -50,
    //     ease: 'none',
    //     scrollTrigger: {
    //         trigger: '.hero',
    //         start: 'top bottom',
    //         end: 'bottom top',
    //         scrub: true
    //     }
    // });
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initProcessAnimation();
    initScrollAnimations();
    initRevealAnimations();
    initStatsAnimation();
    initParallaxEffect();
});

console.log('Urge Visionary Legal Support  Legal Website - JavaScript with GSAP animations loaded successfully!');

