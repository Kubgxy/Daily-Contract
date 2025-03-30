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
                    sh 'npm install'
                }
            }
        }

        stage('🧪 Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'echo "Frontend test (optional)"'
                }
            }
        }

        stage('📦 Install Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('🧪 Test Backend') {
            steps {
                dir('backend') {
                    sh 'echo "Backend test (optional)"'
                }
            }
        }

        stage('🤖 Robot Framework') {
            steps {
                dir('dashboard') {
                    sh 'robot Testcase.robot'
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
