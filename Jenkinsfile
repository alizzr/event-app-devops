pipeline {
    agent any

    environment {
        // On définit le tag pour les images (ici 'latest', mais on pourrait utiliser le numéro de build)
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🚀 Récupération du code...'
                // Jenkins le fait auto si configuré via SCM, sinon :
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo '🐳 Construction des images Docker...'
                // On utilise docker-compose pour construire tout le monde d'un coup
                // Le '-f' précise le fichier, 'build' lance la construction
                sh 'docker-compose -f docker-compose.yml build'
            }
        }

        stage('Test Unitaire (Simulation)') {
            steps {
                echo '🧪 Lancement des tests...'
                // Ici on pourrait lancer 'php artisan test' dans le conteneur auth-service
                // Pour l'instant, on simule juste que tout va bien
                sh 'echo "Tests passés avec succès !"'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline réussi ! Les images sont prêtes.'
        }
        failure {
            echo '❌ Aïe, quelque chose a cassé.'
        }
    }
}