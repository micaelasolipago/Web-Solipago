// Servicio de emails automatizados usando EmailJS
class EmailService {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    // Inicializar EmailJS
    async init() {
        try {
            // Cargar EmailJS desde CDN si no está disponible
            if (typeof emailjs === 'undefined') {
                await this.loadEmailJS();
            }
            
            // Inicializar EmailJS con tu User ID
            emailjs.init(EMAIL_CONFIG.userId);
            this.isInitialized = true;
            console.log('EmailJS inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar EmailJS:', error);
        }
    }

    // Cargar EmailJS desde CDN
    loadEmailJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Enviar email de contacto
    async sendContactEmail(formData) {
        if (!this.isInitialized) {
            throw new Error('EmailJS no está inicializado');
        }

        try {
            const userIP = await getUserIP();
            const currentDate = formatDate();

            const templateParams = {
                to_name: formData.name,
                to_email: formData.email,
                from_name: 'Solipago',
                from_email: EMAIL_CONFIG.contactEmail,
                message: formData.message,
                user_ip: userIP,
                date: currentDate,
                reply_to: formData.email
            };

            const response = await emailjs.send(
                EMAIL_CONFIG.serviceId,
                EMAIL_CONFIG.templates.contact,
                templateParams
            );

            return {
                success: true,
                message: 'Email enviado correctamente',
                response: response
            };
        } catch (error) {
            console.error('Error al enviar email:', error);
            return {
                success: false,
                message: 'Error al enviar email',
                error: error
            };
        }
    }

    // Enviar propuesta empresarial automatizada
    async sendBusinessProposal(companyData) {
        if (!this.isInitialized) {
            throw new Error('EmailJS no está inicializado');
        }

        try {
            const templateParams = {
                to_name: companyData.name,
                company_name: companyData.name, // Nombre de la empresa
                industry: companyData.industry, // Industria
                needs: companyData.needs.join(', '), // Necesidades
                message: companyData.message, // Mensaje personalizado
                from_name: 'Micaela - Solipago',
                from_email: 'tuemail@solipago.com',
                reply_to: 'tuemail@solipago.com'
            };

            const response = await emailjs.send(
                'service_xxxxx',      // <-- Tu Service ID de EmailJS
                'template_abc123',    // <-- Tu Template ID de EmailJS
                templateParams
            );

            return {
                success: true,
                message: `Propuesta enviada a ${companyData.name}`,
                response: response
            };
        } catch (error) {
            console.error('Error al enviar propuesta:', error);
            return {
                success: false,
                message: `Error al enviar propuesta a ${companyData.name}`,
                error: error
            };
        }
    }

    // Enviar campaña masiva de propuestas
    async sendBulkProposals(companies = EMAIL_CONFIG.targetCompanies) {
        const results = [];
        
        for (const company of companies) {
            try {
                // Esperar 2 segundos entre emails para evitar spam
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const result = await this.sendBusinessProposal(company);
                results.push({
                    company: company.name,
                    ...result
                });
                
                console.log(`Propuesta enviada a ${company.name}: ${result.success ? 'Éxito' : 'Error'}`);
            } catch (error) {
                results.push({
                    company: company.name,
                    success: false,
                    message: 'Error inesperado',
                    error: error
                });
            }
        }

        return results;
    }

    // Enviar email de seguimiento
    async sendFollowUpEmail(contactData, daysAfter = 7) {
        if (!this.isInitialized) {
            throw new Error('EmailJS no está inicializado');
        }

        try {
            const templateParams = {
                to_name: contactData.name,
                to_email: contactData.email,
                from_name: 'Micaela - Solipago',
                from_email: EMAIL_CONFIG.contactEmail,
                days_after: daysAfter,
                reply_to: EMAIL_CONFIG.contactEmail
            };

            const response = await emailjs.send(
                EMAIL_CONFIG.serviceId,
                'template_follow_up', // Template de seguimiento
                templateParams
            );

            return {
                success: true,
                message: 'Email de seguimiento enviado',
                response: response
            };
        } catch (error) {
            console.error('Error al enviar email de seguimiento:', error);
            return {
                success: false,
                message: 'Error al enviar email de seguimiento',
                error: error
            };
        }
    }

    // Programar email de seguimiento
    scheduleFollowUp(contactData, daysAfter = 7) {
        const delay = daysAfter * 24 * 60 * 60 * 1000; // Convertir días a milisegundos
        
        setTimeout(async () => {
            await this.sendFollowUpEmail(contactData, daysAfter);
        }, delay);
    }

    // Validar email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Obtener estadísticas de envío
    getEmailStats() {
        // Aquí podrías implementar tracking de emails enviados
        return {
            totalSent: 0,
            successful: 0,
            failed: 0,
            lastSent: null
        };
    }
}

// Crear instancia global del servicio
const emailService = new EmailService();

// Función para mostrar notificaciones - Mejorada con diseño 3D
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Crear contenido con icono
    const icon = type === 'success' ? '✅' : '❌';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2em;">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos minimalistas 3D de la notificación (Deevty + 3D style)
    const bgColor = type === 'success' ? 'var(--text-primary)' : '#ef4444';
    const textColor = type === 'success' ? 'var(--bg-primary)' : 'white';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: ${textColor};
        font-weight: 500;
        z-index: 10000;
        background: ${bgColor};
        box-shadow: 0 8px 32px var(--shadow-color);
        transform: perspective(100px) rotateY(5deg) translateX(100%);
        transition: all 0.3s ease;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'perspective(100px) rotateY(5deg) translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos con animación de salida
    setTimeout(() => {
        notification.style.transform = 'perspective(100px) rotateY(5deg) translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Función para mostrar loading - Mejorada con diseño 3D
function showLoading(show = true) {
    let loader = document.getElementById('email-loader');
    
    if (show && !loader) {
        loader = document.createElement('div');
        loader.id = 'email-loader';
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            ">
                <div style="
                    background: var(--bg-primary);
                    padding: 30px;
                    border-radius: 16px;
                    text-align: center;
                    box-shadow: 
                        0 20px 60px var(--shadow-color),
                        inset 0 1px 0 var(--glass-border);
                    border: 1px solid var(--glass-border);
                    transform: perspective(1000px) rotateX(5deg);
                    max-width: 300px;
                    width: 90%;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        border: 4px solid var(--border-color);
                        border-top: 4px solid var(--accent-primary);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                        box-shadow: 0 0 20px var(--glow-color);
                    "></div>
                    <p style="
                        color: var(--text-primary);
                        font-weight: 600;
                        font-size: 1.1rem;
                        margin: 0;
                        font-family: 'Inter', sans-serif;
                    ">Enviando mensaje...</p>
                    <p style="
                        color: var(--text-secondary);
                        font-size: 0.9rem;
                        margin: 10px 0 0 0;
                        font-family: 'Inter', sans-serif;
                    ">Por favor espera un momento</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
        
        // Agregar estilos CSS para la animación spin
        if (!document.getElementById('loader-styles')) {
            const style = document.createElement('style');
            style.id = 'loader-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    } else if (!show && loader) {
        loader.remove();
    }
}

// Exportar para uso global
window.EmailService = EmailService;
window.emailService = emailService;
window.showNotification = showNotification;
window.showLoading = showLoading; 