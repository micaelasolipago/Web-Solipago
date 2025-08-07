document.addEventListener('DOMContentLoaded', function() {
// Enhanced 3D Custom cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        const ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;
        
        cursorOutline.style.left = `${cursorX}px`;
        cursorOutline.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Add 3D effect on hover
    document.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.craft-item') || e.target.closest('.work-item')) {
            cursorOutline.style.transform = 'scale(1.5)';
            cursorDot.style.transform = 'scale(1.2)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.craft-item') || e.target.closest('.work-item')) {
            cursorOutline.style.transform = 'scale(1)';
            cursorDot.style.transform = 'scale(1)';
        }
    });
}

// Theme toggle with 3D effects
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const html = document.documentElement;

    // Set initial theme based on user preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add 3D rotation effect
        themeToggle.style.transform = 'perspective(100px) rotateY(180deg)';
        
        setTimeout(() => {
            html.setAttribute('data-theme', newTheme);
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            localStorage.setItem('theme', newTheme);
            
            // Reset rotation
            themeToggle.style.transform = 'perspective(100px) rotateY(0deg)';
        }, 150);
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

// Form submission - Mejorado y arreglado
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validación básica
        if (!name || !email || !message) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor ingresa un email válido', 'error');
            return;
        }

        // Mostrar loading y deshabilitar botón
        showLoading(true);
        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="button-text">Enviando...</span>
            <div style="
                width: 20px;
                height: 20px;
                border: 2px solid var(--bg-primary);
                border-top: 2px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        `;

        try {
            // Verificar si EmailJS está disponible
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS no está cargado');
            }

            // Enviar email directamente con EmailJS
            const templateParams = {
                to_name: name,
                to_email: email,
                from_name: 'Solipago',
                from_email: 'micaela@solipago.com',
                message: message,
                reply_to: email
            };

            const response = await emailjs.send(
                'service_q9miodp',  // Service ID
                'template_f7644tn', // Template ID
                templateParams
            );

            if (response.status === 200) {
                showNotification('¡Mensaje enviado correctamente! Te responderemos pronto.', 'success');
                contactForm.reset();
                
                // Limpiar las clases de los labels
                const labels = contactForm.querySelectorAll('label');
                labels.forEach(label => {
                    label.classList.remove('active');
                });
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al enviar email:', error);
            showNotification('Error al enviar el mensaje. Por favor intenta nuevamente o contáctanos directamente a micaela@solipago.com', 'error');
        } finally {
            showLoading(false);
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

// Mejorar la experiencia de los campos del formulario
const formFields = document.querySelectorAll('.form-field input, .form-field textarea');
formFields.forEach(field => {
    // Agregar clase active cuando el campo tiene contenido
    field.addEventListener('input', function() {
        const label = this.nextElementSibling;
        if (this.value.trim() !== '') {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });

    // Agregar clase active cuando el campo está enfocado
    field.addEventListener('focus', function() {
        const label = this.nextElementSibling;
        label.classList.add('active');
    });

    // Mantener clase active si hay contenido al perder el foco
    field.addEventListener('blur', function() {
        const label = this.nextElementSibling;
        if (this.value.trim() === '') {
            label.classList.remove('active');
        }
    });
});

// Enhanced 3D Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'perspective(1000px) rotateX(2deg) translateY(0) translateZ(0)';
            
            // Add staggered animation for multiple items
            const items = entry.target.parentElement.children;
            Array.from(items).forEach((item, index) => {
                if (item === entry.target) {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'perspective(1000px) rotateX(2deg) translateY(0) translateZ(0)';
                    }, index * 100);
                }
            });
        }
    });
}, observerOptions);

// Observe elements for 3D animation
const animatedItems = document.querySelectorAll('.craft-item, .work-item');
animatedItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'perspective(1000px) rotateX(2deg) translateY(50px) translateZ(-50px)';
    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(item);
});

// Cookie Banner Functionality
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const rejectCookiesBtn = document.getElementById('reject-cookies');

// Check if user has already made a choice
const cookieChoice = localStorage.getItem('cookieChoice');

if (!cookieChoice && cookieBanner) {
    // Show banner after a short delay
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 1000);
}

// Accept cookies
if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieChoice', 'accepted');
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
        
        // Optional: Enable analytics or other tracking
        console.log('Cookies accepted');
    });
}

// Reject cookies
if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieChoice', 'rejected');
        localStorage.setItem('cookiesAccepted', 'false');
        cookieBanner.classList.remove('show');
        
        // Optional: Disable analytics or other tracking
        console.log('Cookies rejected');
    });
}

// Sistema de Estrellas Fugaces Dinámicas
function createShootingStar() {
    const shootingStars = document.querySelector('.shooting-stars');
    if (!shootingStars) return;

    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    // Variaciones aleatorias
    const sizes = ['', 'small', 'large'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    if (randomSize) star.classList.add(randomSize);
    
    // Posición aleatoria
    const startY = Math.random() * 100;
    const startX = -100;
    const endX = window.innerWidth + 100;
    const endY = startY + (Math.random() * 50 - 25); // Variación en Y
    
    // Duración aleatoria - Más lenta
    const duration = 6 + Math.random() * 8; // 6-14 segundos
    
    // Color aleatorio (blanco, azul claro, dorado, plateado)
    const colors = ['#ffffff', '#87ceeb', '#ffd700', '#f0f8ff', '#c0c0c0', '#e6e6fa'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Ángulo aleatorio para más realismo
    const angle = 30 + Math.random() * 30; // Entre 30 y 60 grados
    
    // Aplicar estilos dinámicos
    star.style.cssText = `
        position: absolute;
        top: ${startY}%;
        left: ${startX}px;
        width: ${randomSize === 'small' ? '1px' : randomSize === 'large' ? '3px' : '2px'};
        height: ${randomSize === 'small' ? '1px' : randomSize === 'large' ? '3px' : '2px'};
        background: ${randomColor};
        border-radius: 50%;
        animation: shooting-star-dynamic ${duration}s linear forwards;
        opacity: 0;
        z-index: 1;
        filter: blur(${randomSize === 'small' ? '0.3px' : randomSize === 'large' ? '0.8px' : '0.5px'});
    `;
    
    // Crear estela principal
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: ${randomSize === 'small' ? '50px' : randomSize === 'large' ? '150px' : '100px'};
        height: ${randomSize === 'small' ? '0.5px' : randomSize === 'large' ? '2px' : '1px'};
        background: linear-gradient(90deg, ${randomColor}, transparent);
        transform: translateX(-100%);
        border-radius: 50%;
        box-shadow: 0 0 ${randomSize === 'small' ? '10px' : randomSize === 'large' ? '30px' : '20px'} ${randomColor};
        filter: blur(${randomSize === 'small' ? '0.3px' : randomSize === 'large' ? '0.8px' : '0.5px'});
    `;
    
    // Crear estela secundaria
    const trail2 = document.createElement('div');
    trail2.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: ${randomSize === 'small' ? '25px' : randomSize === 'large' ? '75px' : '50px'};
        height: ${randomSize === 'small' ? '0.3px' : randomSize === 'large' ? '1px' : '0.5px'};
        background: linear-gradient(90deg, ${randomColor}80, transparent);
        transform: translateX(-100%);
        border-radius: 50%;
        box-shadow: 0 0 ${randomSize === 'small' ? '5px' : randomSize === 'large' ? '15px' : '10px'} ${randomColor};
        filter: blur(${randomSize === 'small' ? '0.2px' : randomSize === 'large' ? '0.6px' : '0.4px'});
    `;
    
    // Crear contenedor de partículas
    const particles = document.createElement('div');
    particles.className = 'particles';
    
    // Agregar partículas aleatorias
    const particleCount = randomSize === 'small' ? 3 : randomSize === 'large' ? 8 : 5;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            background: ${randomColor};
            animation-delay: ${Math.random() * 0.5}s;
        `;
        particles.appendChild(particle);
    }
    
    star.appendChild(trail);
    star.appendChild(trail2);
    star.appendChild(particles);
    shootingStars.appendChild(star);
    
    // Animación CSS personalizada
    const keyframes = `
        @keyframes shooting-star-dynamic-${Date.now()} {
            0% {
                transform: translateX(0) translateY(0) rotate(${angle}deg);
                opacity: 0;
            }
            5% {
                opacity: 1;
            }
            95% {
                opacity: 1;
            }
            100% {
                transform: translateX(${endX}px) translateY(${endY}px) rotate(${angle}deg);
                opacity: 0;
            }
        }
    `;
    
    // Agregar keyframes al documento
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    // Aplicar animación
    star.style.animation = `shooting-star-dynamic-${Date.now()} ${duration}s linear forwards`;
    
    // Efecto de partículas durante la animación - Más lento
    const particleInterval = setInterval(() => {
        if (star.parentNode) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                background: ${randomColor};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particle-fade-slow 1.5s ease-out forwards;
                opacity: 0;
            `;
            star.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1500);
        }
    }, 200);
    
    // Remover estrella después de la animación
    setTimeout(() => {
        clearInterval(particleInterval);
        if (star.parentNode) {
            star.parentNode.removeChild(star);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, duration * 1000);
}

// Crear estrellas fugaces periódicamente - Más lentas
function startShootingStars() {
    // Crear estrellas iniciales
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createShootingStar();
        }, i * 4000); // Una estrella cada 4 segundos
    }
    
    // Continuar creando estrellas
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% de probabilidad
            createShootingStar();
        }
    }, 6000 + Math.random() * 8000); // Cada 6-14 segundos
}

// Iniciar estrellas fugaces cuando la página esté lista
setTimeout(startShootingStars, 1000); // Esperar 1 segundo antes de empezar

// Crear estrellas estáticas de fondo
function createStaticStars() {
    const staticStarsContainer = document.getElementById('static-stars');
    if (!staticStarsContainer) return;

    const starCount = 50; // Número de estrellas estáticas
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'static-star';
        
        // Posición aleatoria
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Tamaño aleatorio
        const sizes = ['', 'medium', 'large'];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        if (randomSize) star.classList.add(randomSize);
        
        // Retraso aleatorio para la animación
        const delay = Math.random() * 3;
        
        star.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            animation-delay: ${delay}s;
        `;
        
        staticStarsContainer.appendChild(star);
    }
}

// Crear estrellas estáticas al cargar la página
createStaticStars();
}); 