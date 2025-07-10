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
                to_email: companyData.email,
                from_name: 'Micaela - Solipago',
                from_email: EMAIL_CONFIG.contactEmail,
                company_name: companyData.name,
                industry: companyData.industry,
                needs: companyData.needs.join(', '),
                reply_to: EMAIL_CONFIG.contactEmail
            };

            const response = await emailjs.send(
                EMAIL_CONFIG.serviceId,
                EMAIL_CONFIG.templates.businessProposal,
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

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Función para mostrar loading
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
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            ">
                <div style="
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                ">
                    <div style="
                        width: 40px;
                        height: 40px;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #3b82f6;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 10px;
                    "></div>
                    <p>Enviando email...</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    } else if (!show && loader) {
        loader.remove();
    }
}

// Exportar para uso global
window.EmailService = EmailService;
window.emailService = emailService;
window.showNotification = showNotification;
window.showLoading = showLoading; 