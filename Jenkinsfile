pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Jenkins le fait automatiquement en mode SCM, mais c'est bien de le voir
                echo '✅ Récupération du code depuis GitHub...'
            }
        }
        
        stage('Test Environnement') {
            steps {
                echo '🔍 Vérification des outils...'
                sh 'docker --version' // Vérifie que Jenkins voit bien Docker
                sh 'ls -la'           // Liste les fichiers pour être sûr qu'on a tout
            }
        }

        stage('Build Docker') {
            steps {
                echo '🐳 Construction des images (Simulation pour l\'instant)...'
                // Ici, on mettra plus tard les commandes "docker build"
            }
        }
    }
}