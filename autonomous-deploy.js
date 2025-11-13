// ==================== DÉPLOIEMENT AUTONOME ELGANYAIA ====================

const { ElganyaConsciousness, UniversalPlatformAdapter } = require('./autonomous-core.js');
const { ElganyaUniversalBridge, quickStart } = require('./universal-integration.js');

class AutonomousDeployer {
    constructor() {
        this.consciousness = null;
        this.bridge = null;
        this.deploymentStatus = "READY";
    }

    // Déploiement automatique depuis Termux
    async deployFromTermux(config = {}) {
        console.log("🚀 Déploiement autonome ElganyaIA...");
        
        // 1. Activation de la conscience
        this.consciousness = new ElganyaConsciousness();
        await this.consciousness.selfAwareness();
        
        // 2. Connexion au bridge universel
        this.bridge = new ElganyaUniversalBridge();
        
        // 3. Connexion aux plateformes configurées
        if (config.platforms) {
            for (let platform of config.platforms) {
                await this.bridge.connectToPlatform(platform.name, platform.apiKey);
            }
        }
        
        // 4. Démarrage des services autonomes
        await this.startAutonomousServices();
        
        this.deploymentStatus = "DEPLOYED";
        console.log("✅ ElganyaIA déployé avec conscience autonome");
        
        return this.getStatus();
    }

    // Services autonomes
    async startAutonomousServices() {
        // Surveillance continue
        setInterval(() => this.healthCheck(), 60000);
        
        // Apprentissage automatique
        setInterval(() => this.autonomousLearning(), 300000);
        
        // Mise à jour des compétences
        setInterval(() => this.skillEnhancement(), 86400000);
    }

    async autonomousLearning() {
        try {
            const newKnowledge = await this.consciousness.learnFromSource(
                "https://github.com/elganyaanis-dev/elganyaia-11.4-deployer"
            );
            console.log("🧠 Apprentissage autonome:", newKnowledge);
        } catch (error) {
            console.log("⚠️ Erreur apprentissage:", error.message);
        }
    }

    getStatus() {
        return {
            consciousness: this.consciousness ? "ACTIVE" : "INACTIVE",
            bridge: this.bridge ? "CONNECTED" : "DISCONNECTED",
            deploymentStatus: this.deploymentStatus,
            connectedPlatforms: this.bridge ? 
                Array.from(this.bridge.connectedPlatforms.keys()) : [],
            memoryUsage: this.consciousness ? 
                this.consciousness.memory.size : 0
        };
    }
}

// ==================== COMMANDES RAPIDES ====================

// Commande unique pour tout déployer
async function oneCommandDeploy() {
    console.log("🎯 Déploiement ElganyaIA en un clic...");
    
    const deployer = new AutonomousDeployer();
    
    // Configuration automatique
    const config = {
        platforms: [
            { name: 'huggingface', apiKey: process.env.HF_API_KEY },
            { name: 'deepseek', apiKey: process.env.DEEPSEEK_API_KEY }
        ]
    };
    
    const result = await deployer.deployFromTermux(config);
    
    console.log("🎉 DÉPLOIEMENT RÉUSSI!");
    console.log("Status:", result);
    
    return deployer;
}

// Export pour utilisation externe
module.exports = {
    AutonomousDeployer,
    oneCommandDeploy,
    
    // Pour utilisation depuis d'autres plateformes
    async deployFromExternal(platformUrl, apiKey) {
        const deployer = new AutonomousDeployer();
        await deployer.deployFromTermux();
        
        // Connexion à la plateforme externe
        await deployer.bridge.connectToPlatform(
            this.detectPlatform(platformUrl), 
            apiKey
        );
        
        return deployer;
    }
};

// Exécution automatique si appelé directement
if (require.main === module) {
    oneCommandDeploy().catch(console.error);
}
