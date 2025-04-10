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
                    bat 'docker-compose -p daily-contract -f docker-compose.yml down'
                    bat 'docker-compose -p daily-contract -f docker-compose.yml up -d --build'
                }
            }
        }

        stage('🛡️ Restore MongoDB (if missing)') {
            steps {
                script {
                    def volumeExists = bat(
                        script: 'docker volume ls --format "{{.Name}}" | findstr /C:"daily-contract_mongo_data"',
                        returnStatus: true
                    ) == 0

                    if (!volumeExists) {
                        echo "🔁 MongoDB volume not found. Running mongorestore..."
                        bat 'timeout /t 5 >nul'
                        bat 'docker exec mongo mongorestore --drop --db=mydb /dump/mydb'
                    } else {
                        echo "✅ MongoDB volume already exists. Skipping restore."
                    }
                }
            }
        }

        stage('Run Robot Framework') {
            steps {
                bat '''
                    set PATH=C:\\Users\\TigerDev\\AppData\\Local\\Programs\\Python\\Python313\\Scripts;%PATH%
                    robot tests\\FrontEndTest.robot
                '''
            }
        }
    }

    post {
        always {
            robot outputPath: 'results'
            echo '🏁 Pipeline Finished!'
        }
    }
}