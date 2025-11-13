#!/bin/bash

echo "🤖 INSTALLATION ELGANYAIA 11.4 - 1 CLIC"
echo "======================================"

# Vérifier Internet
if ! ping -c 1 github.com &> /dev/null; then
    echo "❌ Pas de connexion Internet"
    exit 1
fi

# Télécharger le déployeur
echo "📥 Téléchargement du déployeur..."
git clone https://github.com/elganyaanis-dev/elganyaia-11.4-deployer

# Lancer l'installation
echo "🚀 Lancement de l'installation..."
cd elganyaia-11.4-deployer
./deployer.sh

echo ""
echo "🎉 Installation terminée!"
echo "📱 ElganyaIA 11.4 est maintenant sur ton Android!"
