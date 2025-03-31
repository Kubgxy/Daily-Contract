pipeline {
    agent any

    environment {
        NODE_OPTIONS = "--max_old_space_size=4096"
    }

    stages {
        stage('📥 Checkout') {
            steps {
                echo '✅ Repo Cloned (Auto by Jenkins SCM)'
            }
        }

        stage('📦 Install Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('🧪 Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'echo "No frontend test yet"'
                }
            }
        }

        stage('📦 Install Dashboard') {
            steps {
                dir('dashboard') {
                    bat 'npm install'
                }
            }
        }

        stage('🧪 Test Dashboard') {
            steps {
                dir('dashboard') {
                    bat 'echo "No dashboard test yet"'
                }
            }
        }

        stage('📦 Install Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('🧪 Test Backend') {
            steps {
                dir('backend') {
                    bat 'echo "No backend test yet"'
                }
            }
        }
    }

    post {
        always {
            echo '🏁 Pipeline Finished!'
        }
    }
}
