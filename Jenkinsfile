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
                    bat 'echo Frontend test (optional)'
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
                    bat 'echo Backend test (optional)'
                }
            }
        }

        stage('🤖 Robot Framework') {
            steps {
                dir('dashboard') {
                    bat 'C:\\Users\\._kubgxy\\AppData\\Local\\Programs\\Python\\Python3x\\Scripts\\robot.bat Testcase.robot'
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
