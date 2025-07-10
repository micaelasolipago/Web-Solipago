document.addEventListener('DOMContentLoaded', function() {
// Custom cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    document.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const html = document.documentElement;

    themeToggle.addEventListener('click', () => {
        alert('¡Botón de tema presionado!');
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
}

// Language toggle
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'es';
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        langToggle.textContent = currentLang.toUpperCase();
        // Here you would implement the actual language switching logic
    });
}

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach(anchor => {
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

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Auto-show mobile navigation on scroll
let lastScrollTop = 0;
let scrollTimeout;
// window.addEventListener('scroll', () => {
//     const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     const isMobile = window.innerWidth <= 768;
    
//     if (isMobile && navMenu && navToggle) {
//         // Clear existing timeout
//         clearTimeout(scrollTimeout);
        
//         // Show navigation immediately on scroll
//         navMenu.classList.add('active');
//         navToggle.classList.add('active');
        
//         // Hide navigation after 3 seconds of no scrolling
//         scrollTimeout = setTimeout(() => {
//             navMenu.classList.remove('active');
//             navToggle.classList.remove('active');
//         }, 3000);
//     }
    
//     lastScrollTop = currentScrollTop;
// });

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Mostrar loading
        if (typeof showLoading === 'function') showLoading(true);

        try {
            // Enviar email usando el servicio
            const result = await window.emailService.sendContactEmail({
                name,
                email,
                message
            });
            if (result.success) {
                if (typeof showNotification === 'function') showNotification('¡Mensaje enviado correctamente!', 'success');
                contactForm.reset();
            } else {
                if (typeof showNotification === 'function') showNotification('Error al enviar el mensaje. Intenta nuevamente.', 'error');
            }
        } catch (error) {
            if (typeof showNotification === 'function') showNotification('Error al enviar el mensaje. Intenta nuevamente.', 'error');
        } finally {
            if (typeof showLoading === 'function') showLoading(false);
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedItems = document.querySelectorAll('.craft-item, .work-item');
animatedItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});
}); 