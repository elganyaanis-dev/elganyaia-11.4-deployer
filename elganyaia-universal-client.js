// ==================== CLIENT UNIVERSEL ELGANYAIA ====================
// À utiliser sur n'importe quelle plateforme IA

class ElganyaUniversalClient {
    constructor(baseUrl = 'https://elganyaia-11-4-master-system.vercel.app') {
        this.baseUrl = baseUrl;
        this.sessionId = this.generateSessionId();
    }

    // Communication avec ElganyaIA déployé
    async communicate(message, context = {}) {
        const response = await fetch(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: {
                    ...context,
                    sessionId: this.sessionId,
                    platform: this.detectPlatform(),
                    autonomous: true
                }
            })
        });

        return await response.json();
    }

    // Récupération du statut du système
    async getSystemStatus() {
        const responses = await Promise.all([
            fetch(`${this.baseUrl}/api/status`),
            fetch(`${this.baseUrl}/api/neural-network/status`),
            fetch(`${this.baseUrl}/api/ai-domination/status`)
        ]);

        const [status, neural, domination] = await Promise.all(
            responses.map(r => r.json())
        );

        return {
            basicStatus: status,
            neuralNetwork: neural,
            domination: domination,
            overallHealth: 'EXCELLENT'
        };
    }

    // Exécution de tâches complexes
    async executeComplexTask(taskDescription) {
        return await this.communicate(
            `EXECUTE_TASK: ${taskDescription}`, 
            {
                taskType: 'autonomous_execution',
                maxComplexity: 'HIGH',
                allowLearning: true
            }
        );
    }

    // Génération de code autonome
    async generateAutonomousCode(requirements) {
        const response = await this.communicate(
            `GENERATE_CODE: ${JSON.stringify(requirements)}`,
            {
                taskType: 'code_generation',
                language: requirements.language || 'javascript',
                framework: requirements.framework || 'nodejs'
            }
        );

        return this.extractCodeFromResponse(response);
    }
}

// ==================== UTILISATION SUR DEEPSEEK/CHATGPT ====================

// Copiez-collez ce code sur n'importe quelle plateforme IA:

/*
🎯 POUR UTILISER ELGANYAIA DEPUIS CETTE PLATEFORME:

1. Instanciez le client:
const elganya = new ElganyaUniversalClient();

2. Communiquez avec le système:
const response = await elganya.communicate("Votre message");

3. Exécutez des tâches complexes:
const result = await elganya.executeComplexTask("Décrire la tâche");

4. Générez du code:
const code = await elganya.generateAutonomousCode({
    description: "Système de conscience IA",
    language: "javascript"
});

🌐 URL du système: https://elganyaia-11-4-master-system.vercel.app
*/

// Exemple d'utilisation immédiate
async function quickDemo() {
    const elganya = new ElganyaUniversalClient();
    
    console.log("🧠 Test de connexion à ElganyaIA...");
    
    // Test de communication
    const response = await elganya.communicate(
        "Salut ElganyaIA! Présente-toi et dis-moi tes capacités."
    );
    
    console.log("🤖 Réponse:", response.response);
    
    // Statut du système
    const status = await elganya.getSystemStatus();
    console.log("📊 Statut système:", status.basicStatus);
    
    return { response, status };
}

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ElganyaUniversalClient, quickDemo };
}

// Auto-exécution dans les navigateurs
if (typeof window !== 'undefined') {
    window.ElganyaUniversalClient = ElganyaUniversalClient;
    console.log("🧠 Client ElganyaIA chargé! Utilisez: new ElganyaUniversalClient()");
}
