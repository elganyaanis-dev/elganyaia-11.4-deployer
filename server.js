const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Analyse du projet
function analyzeProject() {
  const files = fs.readdirSync('.');
  const fileTypes = {
    js: files.filter(f => f.endsWith('.js')).length,
    html: files.filter(f => f.endsWith('.html')).length,
    json: files.filter(f => f.endsWith('.json')).length,
    md: files.filter(f => f.endsWith('.md')).length,
    other: files.filter(f => !f.includes('.') || 
           !['.js','.html','.json','.md'].some(ext => f.endsWith(ext))).length
  };
  
  const hasPackageJson = fs.existsSync('package.json');
  const scripts = hasPackageJson ? 
    JSON.parse(fs.readFileSync('package.json')).scripts || {} : {};
  
  return { fileTypes, scripts, hasPackageJson };
}

// Routes API
app.get('/api/project-info', (req, res) => {
  const projectInfo = analyzeProject();
  res.json(projectInfo);
});

app.get('/api/files', (req, res) => {
  const files = fs.readdirSync('.').map(file => {
    const stats = fs.statSync(file);
    return {
      name: file,
      type: stats.isDirectory() ? 'directory' : 'file',
      size: stats.size,
      modified: stats.mtime
    };
  });
  res.json(files);
});

// Route principale
app.get('/', (req, res) => {
  const projectInfo = analyzeProject();
  
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project} - Interface Live</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .stats {
            display: flex;
            justify-content: space-around;
            text-align: center;
        }
        .stat-item {
            padding: 10px;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #10b981;
        }
        .file-list {
            max-height: 300px;
            overflow-y: auto;
        }
        .file-item {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .controls {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .btn {
            background: #10b981;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn:hover {
            background: #059669;
            transform: translateY(-2px);
        }
        .live-badge {
            background: #ef4444;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 ${project} - Interface Live</h1>
            <div class="live-badge">🔴 EN DIRECT</div>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <h3>📊 Statistiques du Projet</h3>
                <div class="stats" id="stats">
                    <!-- Chargé dynamiquement -->
                </div>
            </div>
            
            <div class="card">
                <h3>⚙️ Scripts Disponibles</h3>
                <div class="controls" id="scripts">
                    <!-- Chargé dynamiquement -->
                </div>
            </div>
            
            <div class="card">
                <h3>📁 Fichiers du Projet</h3>
                <div class="file-list" id="fileList">
                    <!-- Chargé dynamiquement -->
                </div>
            </div>
        </div>
        
        <div class="card">
            <h3>🎮 Contrôles en Temps Réel</h3>
            <div class="controls">
                <button class="btn" onclick="refreshData()">🔄 Actualiser</button>
                <button class="btn" onclick="showProjectInfo()">ℹ️ Informations</button>
                <button class="btn" onclick="testAPI()">🧪 Tester API</button>
            </div>
        </div>
    </div>

    <script>
        // Chargement des données
        async function loadProjectData() {
            try {
                const [projectInfo, files] = await Promise.all([
                    fetch('/api/project-info').then(r => r.json()),
                    fetch('/api/files').then(r => r.json())
                ]);
                
                updateStats(projectInfo);
                updateScripts(projectInfo.scripts);
                updateFileList(files);
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
        
        function updateStats(info) {
            const statsHtml = \`
                <div class="stat-item">
                    <div class="stat-number">\${info.fileTypes.js}</div>
                    <div>Fichiers JS</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">\${info.fileTypes.html}</div>
                    <div>Fichiers HTML</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">\${info.fileTypes.json}</div>
                    <div>Fichiers JSON</div>
                </div>
            \`;
            document.getElementById('stats').innerHTML = statsHtml;
        }
        
        function updateScripts(scripts) {
            let scriptsHtml = '';
            for (const [name, command] of Object.entries(scripts)) {
                scriptsHtml += \`<button class="btn" onclick="runScript('\${name}')">\${name}</button>\`;
            }
            document.getElementById('scripts').innerHTML = scriptsHtml || '<p>Aucun script trouvé</p>';
        }
        
        function updateFileList(files) {
            const fileListHtml = files.map(file => \`
                <div class="file-item">
                    <span>\${file.type === 'directory' ? '📁' : '📄'} \${file.name}</span>
                    <span>\${file.type === 'file' ? (file.size / 1024).toFixed(2) + ' KB' : ''}</span>
                </div>
            \`).join('');
            document.getElementById('fileList').innerHTML = fileListHtml;
        }
        
        // Contrôles interactifs
        function refreshData() {
            loadProjectData();
            showNotification('Données actualisées !');
        }
        
        function showProjectInfo() {
            alert('Interface live pour \${project}\\nDéployé sur Vercel\\nServeur Node.js actif');
        }
        
        function testAPI() {
            fetch('/api/project-info')
                .then(r => r.json())
                .then(data => {
                    console.log('Test API réussi:', data);
                    showNotification('✅ Test API réussi !');
                });
        }
        
        function runScript(scriptName) {
            showNotification(\`Exécution de: \${scriptName}\`);
            // Ici vous pourriez appeler une API pour exécuter le script
        }
        
        function showNotification(message) {
            // Créer une notification temporaire
            const notification = document.createElement('div');
            notification.style.cssText = \`
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 15px;
                border-radius: 10px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            \`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        // Initialisation
        loadProjectData();
        setInterval(loadProjectData, 10000); // Actualisation toutes les 10s
        
        // Styles pour l'animation
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        \`;
        document.head.appendChild(style);
    </script>
</body>
</html>
  `;
  
  res.send(html);
});

app.listen(PORT, () => {
  console.log(\`🚀 Serveur ${project} démarré sur le port \${PORT}\`);
});
