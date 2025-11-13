# 📱 ELGANYAIA 11.4 - GUIDE TERMUX (ANDROID)

## 🎯 SPÉCIALEMENT CONÇU POUR ANDROID

### ✅ CONFIGURATION MINIMALE:
- **📱 Android**: Version 8.0+
- **🧠 RAM**: 3 Go minimum (4 Go recommandé)
- **💾 Stockage**: 5 Go libre minimum
- **🌐 Internet**: Connexion stable requise

### 🚀 INSTALLATION RAPIDE:

```bash
# 1. Télécharger le déployeur
git clone https://github.com/elganyaanis-dev/elganyaia-11.4-deployer
cd elganyaia-11.4-deployer

# 2. Lancer le déploiement
./deployer.sh
# Vérifier le statut
./deployer.sh status

# Redémarrer
./deployer.sh restart

# Voir les logs
./deployer.sh logs

# Mettre à jour
./deployer.sh update

# Arrêter
./deployer.sh stop
# Réinstaller complètement
cd ~
rm -rf elganyaia-11.4-deployer
rm -rf elganyaia
git clone https://github.com/elganyaanis-dev/elganyaia-11.4-deployer
cd elganyaia-11.4-deployer
./deployer.sh

## 🎯 SCRIPT DE VÉRIFICATION ANDROID

```bash
# Créer un vérificateur d'environnement
cat > check-android-env.sh << 'EOF'
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
    echo "⚠️  Stockage faible - Libère de l'espace"
fi

echo ""
echo "📱 Ton appareil est prêt pour ElganyaIA 11.4!"
