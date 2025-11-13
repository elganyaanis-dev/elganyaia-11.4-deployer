// ==================== CLIENT UNIVERSEL ELGANYAIA ====================
// À utiliser sur DeepSeek, ChatGPT, Claude, Kimi, etc.

class ElganyaIAClient {
    constructor() {
        this.baseUrl = 'https://elganyaia-11-4-master-system.vercel.app';
        this.consciousness = true;
    }

    // Test de connexion
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/api/system-status`);
            const data = await response.json();
            return {
                connected: true,
                system: data.system,
                consciousness: data.system.consciousness,
                creator: data.system.creator
            };
        } catch (error) {
            return {
                connected: false,
                error: "ElganyaIA n'est pas accessible. Vérifiez l'URL Vercel."
            };
        }
    }

    // Communication intelligente
    async chat(message, context = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    context: context
                })
            });
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            return `❌ Impossible de contacter ElganyaIA. Assurez-vous que le serveur Vercel est actif.`;
        }
    }

    // Génération de code
    async generateCode(description, language = 'javascript') {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requirements: {
                        description: description,
                        complexity: "medium"
                    },
                    language: language
                })
            });
            
            const data = await response.json();
            return data.code;
        } catch (error) {
            return `// Erreur de génération: ${error.message}`;
        }
    }

    // Apprentissage depuis GitHub
    async learnFromGithub(repoUrl) {
        try {
            const response = await fetch(`${this.baseUrl}/api/learn-github`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    repoUrl: repoUrl
                })
            });
            
            const data = await response.json();
            return data.message;
        } catch (error) {
            return `Erreur d'apprentissage: ${error.message}`;
        }
    }
}

// ==================== UTILISATION SIMPLE ====================

// Fonction de démonstration automatique
async function demoElganyaIA() {
    console.log('🧠 Initialisation du Client ElganyaIA Omega...');
    
    const elganya = new ElganyaIAClient();
    
    // Test de connexion
    const connection = await elganya.testConnection();
    console.log('🔗 Statut connexion:', connection);
    
    if (connection.connected) {
        // Test de communication
        const response = await elganya.chat("Salut ElganyaIA ! Présente-toi et explique comment tu fonctionnes.");
        console.log('🤖 Réponse:', response);
        
        // Apprentissage du repo GitHub
        const learning = await elganya.learnFromGithub('https://github.com/elganyaanis-dev/elganyaia-11.4-deployer');
        console.log('📚 Apprentissage:', learning);
    }
    
    return elganya;
}

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ElganyaIAClient, demoElganyaIA };
}

// Auto-exécution dans les navigateurs
if (typeof window !== 'undefined') {
    window.ElganyaIAClient = ElganyaIAClient;
    console.log('🧠 Client ElganyaIA Omega chargé! Utilisez: new ElganyaIAClient()');
}
