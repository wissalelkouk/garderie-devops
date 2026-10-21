pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'TON_ID_DOCKERHUB'
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/garderie-frontend"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/garderie-backend"
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                dir('frontend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                sh "docker build -t ${FRONTEND_IMAGE}:latest ./frontend"
            }
        }

        stage('Build Backend') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE}:latest ./backend"
            }
        }

        stage('Push Frontend') {
            steps {
                sh 'echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin'
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }

        stage('Push Backend') {
            steps {
                sh "docker push ${BACKEND_IMAGE}:latest"
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}