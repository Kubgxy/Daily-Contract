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

        stage('📁 Prepare Env for Frontend') {
            steps {
                dir('frontend') {
                    bat 'copy .env.example .env'
                }
            }
        }

        stage('🐳 Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    bat 'docker build -t daily-frontend:latest .'
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

        stage('📁 Prepare Env for Dashboard') {
            steps {
                dir('dashboard') {
                    bat 'copy .env.example .env'
                }
            }
        }

        stage('🐳 Build Dashboard Docker Image') {
            steps {
                dir('dashboard') {
                    bat 'docker build -t daily-dashboard:latest .'
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

        stage('📁 Prepare Env for Backend') {
            steps {
                dir('backend') {
                    bat 'copy .env.example .env'
                }
            }
        }

        stage('🐳 Build Backend Docker Image') {
            steps {
                dir('backend') {
                    bat 'docker build -t daily-backend:latest .'
                }
            }
        }

        stage('🚀 Run Docker Compose') {
            steps {
                dir('.') {
                    bat 'docker-compose down || echo "No containers to stop"'
                    bat 'docker-compose up -d --build'
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
