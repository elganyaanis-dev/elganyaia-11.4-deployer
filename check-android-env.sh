#!/bin/bash

echo "📱 VÉRIFICATION ENVIRONNEMENT ANDROID"
echo "===================================="

# Vérifier Termux
if [ -d "$PREFIX" ] && [[ "$PREFIX" == *"com.termux"* ]]; then
    echo "✅ Termux: Installé"
else
    echo "❌ Termux: Non détecté"
fi

# Vérifier Android version
if command -v getprop > /dev/null; then
    ANDROID_VERSION=$(getprop ro.build.version.release)
    echo "🤖 Android: Version $ANDROID_VERSION"
else
    echo "❌ Impossible de détecter la version Android"
fi

# Vérifier RAM
RAM_MB=$(free -m | awk '/^Mem:/{print $2}')
RAM_GB=$((RAM_MB / 1024))
echo "🧠 RAM: $RAM_GB Go ($RAM_MB MB)"

# Vérifier stockage
STORAGE_GB=$(df $HOME | awk 'NR==2{print $4}' | awk '{printf "%.1f", $1/1024/1024}')
echo "💾 Stockage libre: $STORAGE_GB Go"

# Vérifier dépendances
echo ""
echo "📦 DÉPENDANCES:"
for cmd in git node npm curl; do
    if command -v $cmd > /dev/null; then
        echo "✅ $cmd: Installé"
    else
        echo "❌ $cmd: Manquant"
    fi
done

echo ""
echo "🎯 RECOMMANDATIONS:"
if [ $RAM_GB -lt 3 ]; then
    echo "⚠️  RAM faible - Ferme d'autres applications"
fi

if (( $(echo "$STORAGE_GB < 3" | bc -l) )); then
# Mettre à jour le déployeur pour gérer les erreurs
cat > deployer.sh << 'EOF'
#!/bin/bash

echo "📱 ELGANYAIA 11.4 - DÉPLOYEUR TERMUX"
echo "===================================="
echo "👤 Créateur: Mohamed Anis Chabbi"
echo "📱 Optimisé pour Android + Termux"
echo ""

# Configuration adaptée Termux
INSTALL_DIR="$HOME/elganyaia"
LOG_DIR="$HOME/elganyaia/logs"
BACKUP_DIR="$HOME/elganyaia/backups"
ELGANYA_REPO="https://github.com/elganyaanis-dev/elganyaia-11.4-final.git"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonctions
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

check_termux_environment() {
    log "🔍 Vérification de l'environnement Termux..."
    
    # Vérifier qu'on est dans Termux
    if [ ! -d "$PREFIX" ] || [[ ! "$PREFIX" == *"com.termux"* ]]; then
        error "Ce script doit être exécuté dans Termux"
        return 1
    fi
    
    success "Environnement: Termux Android"
    
    # Vérification RAM (adaptée mobile)
    local RAM_MB=$(free -m | awk '/^Mem:/{print $2}')
    local RAM_GB=$((RAM_MB / 1024))
    
    if [ $RAM_GB -lt 3 ]; then
        error "RAM insuffisante: ${RAM_GB}Go (3Go minimum requis)"
        return 1
    else
        success "RAM: ${RAM_GB}Go (${RAM_MB}MB)"
    fi
    
    # Vérification stockage
    local STORAGE_MB=$(df $HOME | awk 'NR==2{print $4}')
    local STORAGE_GB=$((STORAGE_MB / 1024 / 1024))
    
    if [ $STORAGE_GB -lt 5 ]; then
        error "Stockage insuffisant: ${STORAGE_GB}Go (5Go minimum requis)"
        return 1
    else
        success "Stockage: ${STORAGE_GB}Go libre"
    fi
    
    # Vérification connexion
    if ping -c 1 github.com &> /dev/null; then
        success "Connexion Internet: OK"
    else
        warning "Vérifie ta connexion Internet"
        return 1
    fi
    
    return 0
}

install_dependencies() {
    log "📦 Installation des dépendances Termux..."
    
    # Mise à jour des packages (ignorer les erreurs mineures)
    pkg update -y && pkg upgrade -y || warning "Certaines mises à jour ont échoué (peut être ignoré)"
    
    # Installation des dépendances essentielles
    pkg install -y git nodejs python curl wget jq
    
    # Vérification Node.js
    if node --version &> /dev/null; then
        success "Node.js: $(node --version)"
    else
        error "Node.js non installé"
        return 1
    fi
    
    # Vérification Git
    if git --version &> /dev/null; then
        success "Git: $(git --version)"
    else
        error "Git non installé"
        return 1
    fi
    
    return 0
}

setup_directories() {
    log "📁 Configuration des répertoires..."
    
    # Nettoyer si existe déjà
    if [ -d "$INSTALL_DIR" ] && [ ! -d "$INSTALL_DIR/.git" ]; then
        log "Nettoyage de l'ancienne installation..."
        rm -rf "$INSTALL_DIR"
    fi
    
    mkdir -p "$INSTALL_DIR" "$LOG_DIR" "$BACKUP_DIR"
    
    success "Répertoires créés:"
    echo "   📁 Installation: $INSTALL_DIR"
    echo "   📋 Logs: $LOG_DIR"
    echo "   💾 Backups: $BACKUP_DIR"
}

deploy_elganyaia() {
    log "🔄 Déploiement d'ElganyaIA 11.4..."
    
    if [ -d "$INSTALL_DIR/.git" ]; then
        log "Mise à jour du repository existant..."
        cd "$INSTALL_DIR"
        git pull origin main
    else
        log "Clonage d'ElganyaIA..."
        git clone "$ELGANYA_REPO" "$INSTALL_DIR"
        cd "$INSTALL_DIR"
    fi
    
    # Installation des modules Node.js
    log "Installation des modules Node.js..."
    npm install --production --no-audit --no-fund
    
    # Configuration des permissions (ignorer les erreurs si fichiers manquants)
    chmod +x scripts/*.sh 2>/dev/null || warning "Certains scripts non trouvés (normal au premier déploiement)"
    chmod +x elganya/*.js 2>/dev/null || warning "Certains modules JS non trouvés"
    
    success "ElganyaIA 11.4 déployée avec succès"
}

optimize_for_termux() {
    log "⚡ Optimisation pour Termux..."
    
    echo "⚡ Mode optimisé mobile activé"
    
    # Création script de démarrage simple
    cat > "$HOME/start-elganyaia.sh" << 'SCRIPT'
#!/bin/bash
echo "🚀 Démarrage d'ElganyaIA..."
cd ~/elganyaia
node core/bridge-v3-packages.js
SCRIPT
    
    chmod +x "$HOME/start-elganyaia.sh"
    
    success "Optimisations Termux appliquées"
}

start_elganyaia() {
    log "🚀 Démarrage d'ElganyaIA..."
    
    cd "$INSTALL_DIR"
    
    # Vérifier que le fichier existe
    if [ ! -f "core/bridge-v3-packages.js" ]; then
        error "Fichier de démarrage non trouvé: core/bridge-v3-packages.js"
        return 1
    fi
    
    # Démarrage en arrière-plan avec nohup
    nohup node core/bridge-v3-packages.js > "$LOG_DIR/elganyaia.log" 2>&1 &
    local PID=$!
    
    # Attendre un peu
    sleep 5
    
    # Vérifier si le processus tourne
    if ps -p $PID > /dev/null 2>&1; then
        success "ElganyaIA démarré (PID: $PID)"
        echo "📱 L'IA tourne maintenant en arrière-plan"
        return 0
    else
        error "Erreur lors du démarrage - vérifiez les logs: $LOG_DIR/elganyaia.log"
        return 1
    fi
}

show_status() {
    log "📊 Statut du déploiement..."
    
    echo ""
    echo "🎉 DÉPLOIEMENT RÉUSSI SUR ANDROID !"
    echo "==================================="
    echo "🔗 Accès Web: http://localhost:3000"
    echo "📊 Dashboard: http://localhost:3000/status"
    echo ""
    echo "📁 Installation: $INSTALL_DIR"
    echo "📋 Logs: $LOG_DIR"
    echo "💾 Backups: $BACKUP_DIR"
    echo ""
    echo "🛠️ Commandes utiles:"
    echo "   cd ~/elganyaia && node core/bridge-v3-packages.js"
    echo "   tail -f ~/elganyaia/logs/elganyaia.log"
    echo "   pkill -f 'node.*bridge-v3'"
    echo ""
    echo "📱 Pour redémarrer: ./deployer.sh restart"
    echo ""
    echo "🤖 ElganyaIA 11.4 est maintenant active sur ton Android!"
}

check_running_status() {
    if pgrep -f "node.*bridge-v3" > /dev/null 2>&1; then
        echo "🟢 ElganyaIA est en cours d'exécution"
        return 0
    else
        echo "🔴 ElganyaIA n'est pas démarré"
        return 1
    fi
}

# Gestion des arguments
case "${1:-}" in
    "status")
        check_running_status
        ;;
    "restart")
        log "🔄 Redémarrage d'ElganyaIA..."
        pkill -f "node.*bridge-v3" 2>/dev/null
        sleep 2
        start_elganyaia
        ;;
    "stop")
        log "🛑 Arrêt d'ElganyaIA..."
        pkill -f "node.*bridge-v3" 2>/dev/null
        success "ElganyaIA arrêté"
        ;;
    "logs")
        log "📋 Affichage des logs..."
        if [ -f "$LOG_DIR/elganyaia.log" ]; then
            tail -f "$LOG_DIR/elganyaia.log"
        else
            error "Fichier de logs non trouvé"
        fi
        ;;
    "update")
        log "📥 Mise à jour d'ElganyaIA..."
        cd "$INSTALL_DIR"
        git pull
        npm install
        success "ElganyaIA mise à jour"
        ;;
    "help"|"--help"|"-h")
        echo "📱 ELGANYAIA 11.4 - DÉPLOYEUR TERMUX"
        echo "Usage: ./deployer.sh [commande]"
        echo ""
        echo "Commandes:"
        echo "  status    - Vérifier le statut"
        echo "  restart   - Redémarrer ElganyaIA"
        echo "  stop      - Arrêter ElganyaIA"
        echo "  logs      - Voir les logs en temps réel"
        echo "  update    - Mettre à jour ElganyaIA"
        echo "  help      - Afficher cette aide"
        echo ""
        echo "Sans commande: Déploiement complet"
        ;;
    *)
        # Mode déploiement complet
        main() {
            echo ""
            check_termux_environment || { error "Environnement incompatible"; exit 1; }
            install_dependencies || { error "Échec installation dépendances"; exit 1; }
            setup_directories || { error "Échec configuration dossiers"; exit 1; }
            deploy_elganyaia || { error "Échec déploiement ElganyaIA"; exit 1; }
            optimize_for_termux || { error "Échec optimisation"; exit 1; }
            start_elganyaia || { error "Échec démarrage"; exit 1; }
            show_status
        }
        
        main
        ;;
esac
