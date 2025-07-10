// Configuración del sistema de emails automatizados
const EMAIL_CONFIG = {
    // Configuración del servidor de email (usando EmailJS como ejemplo)
    serviceId: 'service_q9miodp',
    templateId: 'template_agp5j0c', // Usado por defecto para contacto
    userId: 'vJWS9-xxIjLpgqETA',
    
    // Email de contacto principal
    contactEmail: 'micaela@solipago.com',
    
    // Templates de email
    templates: {
        contact: 'template_f7644tn',
        businessProposal: 'template_agp5j0c'
    },
    
    // Lista de empresas objetivo (ejemplo)
    targetCompanies: [
        {
            name: 'Empresa Ejemplo 1',
            email: 'contacto@empresa1.com',
            industry: 'Manufactura',
            needs: ['Sistema de planificación', 'Optimización de procesos']
        },
        {
            name: 'Empresa Ejemplo 2', 
            email: 'info@empresa2.com',
            industry: 'Finanzas',
            needs: ['Plataforma financiera', 'Integración de sistemas']
        }
    ]
};

// Función para obtener la IP del usuario
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'No disponible';
    }
}

// Función para formatear fecha
function formatDate() {
    return new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAIL_CONFIG;
} 